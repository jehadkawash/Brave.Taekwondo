import fs from 'node:fs';
const original=fs.readFileSync('firestore.rules','utf8');
const additions=fs.readFileSync('management/firestore.additions.rules','utf8');
const end=original.lastIndexOf('  }');
if(end<0||!/^\s*}\s*}\s*$/.test(original.slice(end)))throw Error('Unexpected original rules structure; review manually.');
fs.writeFileSync('management/firestore.combined.rules',original.slice(0,end)+additions+'\n'+original.slice(end));
console.log('Generated management/firestore.combined.rules. Existing firestore.rules was not changed. Do not deploy before emulator verification.');
