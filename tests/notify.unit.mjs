import test from 'node:test';
import assert from 'node:assert/strict';
process.env.RESEND_API_KEY='local-fixture-not-a-key';
process.env.ADMIN_EMAIL='unapproved@example.invalid';
process.env.SEND_CUSTOMER_CONFIRMATION='1';
process.env.CALLMEBOT_PHONE_NUMBER='000';
process.env.CALLMEBOT_API_KEY='local-fixture';
const {notifyPulse,notifyCustomer,templateFromRows,renderTemplate,DEFAULT_AUTO_REPLIES}=await import('../api/notify.js');

test('owner-only email guard blocks visitors and WhatsApp and ignores alternate admin',async()=>{
 const calls=[];globalThis.fetch=async(url,opts)=>{calls.push({url,body:JSON.parse(opts.body)});return {ok:true}};
 await notifyCustomer('join_confirmation','visitor@example.invalid','Synthetic');
 assert.equal(calls.length,0);
 await notifyPulse('booking request',{name:'Synthetic'});
 await notifyCustomer('join_confirmation','elihsa@gmail.com','Synthetic');
 assert.equal(calls.length,2);
 for(const call of calls){assert.equal(call.url,'https://api.resend.com/emails');assert.deepEqual(call.body.to,['elihsa@gmail.com'])}
 assert.match(calls[1].body.text,/applying to join the Pulse Male Revue team/);
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
