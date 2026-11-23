import test from 'node:test';
import assert from 'node:assert/strict';
import { buildJoinRow, JOIN_DETAIL_FIELDS } from '../lib/join-row.js';

test('recruitment keeps all20 original positions and appends only existing form details', () => {
  const fields = {firstName:'Synthetic',lastName:'QA',birthMonth:'1',birthDay:'01',birthYear:'2000',streetAddress:'Synthetic fixture',city:'Fixture city',email:'qa@example.invalid',phone:'0000000000',danceExperience:'Yes',promoExperience:'No',transport:'Yes',gymLocation:'Fixture gym',otherWork:'Fixture work',skills:'Fixture skills'};
  for(const name of JOIN_DETAIL_FIELDS) fields[name]='fixture-'+name;
  const row=buildJoinRow(fields,{fullBodyShot:'synthetic photo1',fullFacePhoto:'synthetic photo2'},'fixture time','Dancing, Waitering');
  assert.deepEqual(row.slice(0,20),['fixture time','Synthetic','QA','1','01','2000','Synthetic fixture','Fixture city','qa@example.invalid',"'0000000000",'Dancing, Waitering','Yes','No','Yes','Fixture gym','Fixture work','Fixture skills','synthetic photo1','synthetic photo2','Pending']);
  assert.deepEqual(row.slice(20),JOIN_DETAIL_FIELDS.map(name=>'fixture-'+name));
  assert.equal(row.length,32);
});

test('older recruitment callers leave appended cells empty without shifting Status',()=>{
  const row=buildJoinRow({}, {}, 'fixture time', 'Not specified');
  assert.equal(row[19],'Pending');
  assert.deepEqual(row.slice(20),Array(12).fill(''));
});
