import test from 'node:test';
import assert from 'node:assert/strict';
process.env.RESEND_API_KEY='local-fixture-not-a-key';
process.env.ADMIN_EMAIL='unapproved@example.invalid';
process.env.SEND_CUSTOMER_CONFIRMATION='1';
process.env.CALLMEBOT_PHONE_NUMBER='000';
process.env.CALLMEBOT_API_KEY='local-fixture';
const {notifyPulse,notifyCustomer,templateFromRows,renderTemplate,DEFAULT_AUTO_REPLIES,receiptEmail}=await import('../api/notify.js');

test('new receipts use entered email, admin stays Eli and WhatsApp stays off',async()=>{
 const calls=[];globalThis.fetch=async(url,opts)=>{calls.push({url,body:JSON.parse(opts.body)});return {ok:true}};
 await notifyCustomer('join_confirmation','visitor@example.invalid','Synthetic');
 assert.equal(calls.length,1);
 assert.deepEqual(calls[0].body.to,['visitor@example.invalid']);
 await notifyPulse('booking request',{name:'Synthetic'});
 await notifyCustomer('join_confirmation','elihsa@gmail.com','Synthetic');
 assert.equal(calls.length,3);
 for(const call of calls.slice(1)){assert.equal(call.url,'https://api.resend.com/emails');assert.deepEqual(call.body.to,['elihsa@gmail.com'])}
 for(const call of calls){assert.equal(call.body.from,'Pulse Website <info@pulsedancers.com>');assert.equal(call.body.reply_to,'info@pulsedancers.com')}
 assert.match(calls[2].body.text,/applying to join the Pulse Male Revue team/);
});

test('each form type gets its own distinct default confirmation',async()=>{
 const calls=[];globalThis.fetch=async(url,opts)=>{calls.push({url,body:JSON.parse(opts.body)});return {ok:true}};
 for(const key of ['booking_confirmation','join_confirmation','testimonial_confirmation','contact_confirmation']){
  await notifyCustomer(key,'elihsa@gmail.com','Synthetic');
 }
 assert.equal(calls.length,4);
 const bodies=calls.map(c=>c.body.text);
 assert.equal(new Set(bodies).size,4,'each template must differ');
 const subjects=calls.map(c=>c.body.subject);
 assert.equal(new Set(subjects).size,4,'each subject must differ');
 assert.match(bodies[0],/booking request with Pulse Male Revue/);
 assert.match(bodies[0],/only confirmed once we've spoken to you directly/);
 assert.match(bodies[1],/applying to join the Pulse Male Revue team/);
 assert.match(bodies[2],/sharing your Pulse Male Revue experience/);
 assert.match(bodies[3],/contacting Pulse Male Revue/);
 for(const body of bodies){assert.match(body,/^Hi Synthetic,/);assert.match(body,/info@pulsedancers\.com/)}
});

test('unknown template keys and missing env skip sending instead of guessing copy',async()=>{
 const calls=[];globalThis.fetch=async(url,opts)=>{calls.push({url,body:JSON.parse(opts.body)});return {ok:true}};
 await notifyCustomer('message','elihsa@gmail.com','Synthetic');
 await notifyCustomer('','elihsa@gmail.com','Synthetic');
 await notifyCustomer('booking_confirmation','','Synthetic');
 assert.equal(calls.length,0);
});

test('CMS rows override defaults, blank cells fall back per field',()=>{
 const rows=[
  ['booking_confirmation','Custom subject','Custom body for {firstName}'],
  ['join_confirmation','',''],
 ];
 const custom=templateFromRows(rows,'booking_confirmation');
 assert.equal(custom.subject,'Custom subject');
 assert.equal(renderTemplate(custom.body,{firstName:'Eli'}),'Custom body for Eli');
 const blank=templateFromRows(rows,'join_confirmation');
 assert.equal(blank.body,DEFAULT_AUTO_REPLIES.join_confirmation.body);
 const missing=templateFromRows(rows,'testimonial_confirmation');
 assert.equal(missing,DEFAULT_AUTO_REPLIES.testimonial_confirmation);
 assert.equal(templateFromRows(null,'booking_confirmation'),DEFAULT_AUTO_REPLIES.booking_confirmation);
 assert.equal(templateFromRows(rows,'nope'),null);
});

test('renderTemplate replaces every placeholder and names are sanitised for plain-text mail',async()=>{
 assert.equal(renderTemplate('Hi {firstName}, hi {firstName}',{firstName:'Eli'}),'Hi Eli, hi Eli');
 const calls=[];globalThis.fetch=async(url,opts)=>{calls.push({url,body:JSON.parse(opts.body)});return {ok:true}};
 await notifyCustomer('booking_confirmation','elihsa@gmail.com','Eli\nBCC: attacker@example.invalid');
 assert.match(calls[0].body.text,/^Hi Eli BCC: attacker@example\.invalid,/);
 await notifyCustomer('booking_confirmation','elihsa@gmail.com','   ');
 assert.match(calls[1].body.text,/^Hi there,/);
});


test('receipt recipient is one address only, rejects injected headers and lists',()=>{
 assert.equal(receiptEmail(' person@example.com '),'person@example.com');
 for(const v of [null,{},'', 'a@example.com,b@example.com', 'A <a@example.com>', 'a@example.com\r\nBcc:b@example.com','a@b','a@@b.com']) assert.equal(receiptEmail(v),null);
});


test('provider failure is contained without pretending a receipt was sent',async()=>{
 const errors=[];const old=console.error;console.error=(...args)=>errors.push(args);
 globalThis.fetch=async()=>({ok:false,status:429,text:async()=>'daily_quota_exceeded'});
 try { await notifyCustomer('booking_confirmation','synthetic@example.invalid','Synthetic'); }
 finally { console.error=old; }
 assert.equal(errors.length,1);assert.equal(errors[0][1],429);
});
