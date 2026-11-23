import test from 'node:test';
import assert from 'node:assert/strict';
import {submissionSummary,composeCustomerReceipt} from '../lib/submission-summary.js';

test('booking receipt includes supplied event details, zeroes and choices only',()=>{
 const s=submissionSummary('booking_confirmation',{name:'Synthetic',eventDate:'2026-12-12',eventTime:'19:30',guestCount:0,distanceKm:0,services:['Show','Waiter'],notes:'Line one\nLine two',adminNotes:'INTERNAL',status:'Approved',secret:'NO'});
 for(const text of ['Event date: 2026-12-12','Event time: 19:30','Guest count: 0','Distance (km): 0','Services: Show, Waiter','Your notes: Line one\n  Line two']) assert.ok(s.includes(text),text);
 assert.doesNotMatch(s,/INTERNAL|Approved|secret|NO/);
});
test('join receipt keeps multiple preferences and supplied detail but no photo bytes',()=>{
 const s=submissionSummary('join_confirmation',{firstName:'Synthetic',birthYear:1990,preference:['Dancing','Waitering'],height:180,skills:'Dance',status:'Pending'}, {fullBodyShot:'data:image/jpeg;base64,PRIVATE',fullFacePhoto:'data:image/jpeg;base64,PRIVATE'});
 for(const text of ['Birth year: 1990','Work preferences: Dancing, Waitering','Height (cm): 180','Full-body photo: received','Face photo: received'])assert.ok(s.includes(text));
 assert.doesNotMatch(s,/base64|PRIVATE|Pending/);
});
test('testimonials and contact show only their supplied fields',()=>{
 assert.match(submissionSummary('testimonial_confirmation',{name:'Synthetic',rating:5,message:'Test',area:'Demo',status:'Pending'}),/Rating: 5/);
 assert.doesNotMatch(submissionSummary('contact_confirmation',{subject:'Testing',message:'Hello',rating:5}),/Rating/);
});
test('summary always follows greeting, with legacy and placeholder CMS bodies',()=>{
 const summary='This is the information you provided:\nName: Synthetic';
 for(const body of ['Hi Synthetic,\n\nThank you.','Hi Synthetic,\n\n{submissionSummary}\n\nThank you.','Thank you.']){
  const out=composeCustomerReceipt(body,'Synthetic',summary);
  assert.equal(out,'Hi Synthetic,\n\n'+summary+'\n\nThank you.');
  assert.equal(out.split('This is the information').length,2);
 }
});
