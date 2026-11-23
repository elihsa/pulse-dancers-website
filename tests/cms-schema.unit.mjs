import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const src=fs.readFileSync('assets/js/sheets-cms.js','utf8');
const ctx={console,window:{},document:{addEventListener(){},getElementById(){return null}},sessionStorage:{getItem(){return null},setItem(){}},Map,Set};
vm.createContext(ctx);vm.runInContext(src+';globalThis.cms=PulseSheetsCMS',ctx);
test('HOME reader includes servicesList and remaining rows beyond ten',async()=>{
 let range;ctx.cms.fetchSheet=async(...args)=>{range=args;return [['servicesList','One|Two'],['topBannerImage','top.png']]};
 const home=await ctx.cms.getHome();assert.equal(home.servicesList,'One|Two');assert.ok(range[2]>=15);
});
test('SERVICES reader skips Name header, inactive rows and formats raw identifiers',async()=>{
 ctx.cms.fetchSheet=async()=>[['Name','Description','Active'],['male_strippers','Description','TRUE'],['hidden','Description',false]];
 assert.deepEqual(Array.from(await ctx.cms.getServicesList()),['male strippers']);
 ctx.cms.fetchSheet=async()=>[['Service','Description'],['Custom readable service','Detail']];
 assert.deepEqual(Array.from(await ctx.cms.getServicesList()),['Custom readable service']);
});
test('homepage explicit HOME services selection cannot be overwritten by fallback',()=>{
 assert.match(fs.readFileSync('index.html','utf8'),/if \(!hasHomeServicesList && isDefault\)/);
});
