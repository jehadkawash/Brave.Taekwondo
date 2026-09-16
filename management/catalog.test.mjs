import assert from 'node:assert/strict';import{catalogUpdate}from'./catalog.mjs';
const updated=catalogUpdate({variants:[{size:'140',stock:11}]},{name:'new name',price:30,branch:'other',variants:[{size:'140',stock:8},{size:'150',stock:2}]});
assert.equal(updated.variants[0].stock,11);assert.equal(updated.variants[1].stock,2);assert.equal(updated.name,'new name');assert.equal(updated.branch,undefined);
assert.throws(()=>catalogUpdate({variants:[]},{variants:[{size:'a',stock:-1}]}));
assert.throws(()=>catalogUpdate({variants:[]},{variants:[{size:'a',stock:1},{size:'a',stock:2}]}));
console.log('PASS: catalog updates preserve concurrent stock and validate added sizes.');
