import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBookingRow } from '../lib/booking-row.js';
const timestamp = '2026-11-23T10:15:00.000Z';
const oldInput = {name:'Fixture',phone:'0820000000',email:'qa@example.invalid',eventType:'Fixture event',managing:'No',managerName:'Manager',managerPhone:'0810000000',managerEmail:'manager@example.invalid',locType:'area',address:'Fixture address',area:'Fixture area',distanceKm:0,services:['male','games'],maleCount:2,showType:'Standard',race:'No preference',costume:'Fixture',femaleCount:1,waiterCount:2,waiterHours:3,butlerCount:4,butlerHours:5,gamesQty:6,poleQty:7,otherText:'Fixture other',notes:'Fixture notes',quote:{performance:'R1',travel:'R2',total:'R3'}};
const legacy = [timestamp,'Fixture',"'0820000000",'qa@example.invalid','Fixture event','No','Manager',"'0810000000",'manager@example.invalid','area','Fixture address','Fixture area',0,'male, games',2,'Standard','No preference','Fixture',1,2,3,4,5,6,7,'Fixture other','Fixture notes','R1','R2','R3','Pending'];
test('all31 legacy columns are unchanged, with extensions only after Status',()=>{
  const row=buildBookingRow({...oldInput,eventDate:'2026-12-24',eventTime:'19:30',guestCount:40},timestamp);
  assert.deepEqual(row.slice(0,31),legacy);
  assert.deepEqual(row.slice(31),['2026-12-24','19:30',40]);
  assert.equal(row.length,34);
});
test('older callers receive empty extension cells without shifting legacy fields',()=>{
  assert.deepEqual(buildBookingRow(oldInput,timestamp),[...legacy,'','','']);
});
test('zero guest count and distance are retained instead of treated as missing',()=>{
  const row=buildBookingRow({...oldInput,guestCount:0},timestamp);
  assert.equal(row[12],0);assert.equal(row[33],0);
});
