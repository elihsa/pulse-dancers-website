import test from 'node:test';
import assert from 'node:assert/strict';
process.env.RESEND_API_KEY='local-fixture-not-a-key';
process.env.ADMIN_EMAIL='unapproved@example.invalid';
process.env.SEND_CUSTOMER_CONFIRMATION='1';
process.env.CALLMEBOT_PHONE_NUMBER='000';
process.env.CALLMEBOT_API_KEY='local-fixture';
const {notifyPulse,notifyCustomer}=await import('../api/notify.js');
test('owner-only email guard blocks visitors and WhatsApp and ignores alternate admin',async()=>{
 const calls=[];globalThis.fetch=async(url,opts)=>{calls.push({url,body:JSON.parse(opts.body)});return {ok:true}};
 await notifyCustomer('application','visitor@example.invalid','Synthetic');
 assert.equal(calls.length,0);
 await notifyPulse('booking request',{name:'Synthetic'});
 await notifyCustomer('application','elihsa@gmail.com','Synthetic');
 assert.equal(calls.length,2);
 for(const call of calls){assert.equal(call.url,'https://api.resend.com/emails');assert.deepEqual(call.body.to,['elihsa@gmail.com'])}
 assert.match(calls[1].body.text,/development test/);
});
