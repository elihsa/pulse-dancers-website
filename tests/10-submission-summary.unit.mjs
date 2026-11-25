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
test('booking omits hidden default service quantities and uses visible labels',()=>{
 const s=submissionSummary('booking_confirmation',{services:['male'],maleCount:1,showType:'full',femaleCount:1,waiterCount:1,butlerCount:1,gamesQty:1,poleQty:1,managing:'Yes, but im not managing it.'});
 assert.match(s,/Services: Male Stripper/);assert.match(s,/Male performers: 1/);assert.match(s,/Show type: Full show \(20 mins\)/);assert.match(s,/No, someone else is managing it/);
 assert.doesNotMatch(s,/Female performers|Waiters:|Butlers:|Games:|Pole shows:/);
});

test('legacy booking manager and exact-location values match visible choices',()=>{ const s=submissionSummary('booking_confirmation',{managing:'No',locType:'exact'});assert.match(s,/Managing the event: Yes, I.m managing it/);assert.match(s,/Location type: Exact address/);});

test('multi-man shows get visible names and the performer preference follows them',()=>{
 const s=submissionSummary('booking_confirmation',{services:['show3'],race:"We don't care as long as he's hot",maleCount:1});
 assert.match(s,/Services: 3 Man Show/);
 assert.match(s,/Preferred ethnicity of performer: We don't care as long as he's hot/);
 assert.doesNotMatch(s,/Male performers/);
 const none=submissionSummary('booking_confirmation',{services:['games'],race:'White'});
 assert.doesNotMatch(none,/ethnicity/);
});
