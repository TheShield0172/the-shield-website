'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../shield-crypto.js');
const PASS='not a real secret - fictional only - 2026';
const fresh=()=>C.create(PASS);
const testCase=(id='test-case-001')=>({id,name:'Fictional Personnel Case',createdAt:new Date().toISOString(),events:[],foia:[],files:[]});

test('new pack has no plaintext, AES-GCM decrypts and per-save IV changes', async()=>{
 const v=await fresh();assert(C.validateEnvelope(v.envelope));
 const v2={version:1,createdAt:'2026-11-11T01:00:00.000Z',cases:[testCase()],history:[]};
 const a=await C.seal(v2,v.key,v.salt,1),b=await C.seal(v2,v.key,v.salt,2);
 assert(!JSON.stringify(a).includes('Fictional Personnel Case'));
 assert.notEqual(a.cipher.iv,b.cipher.iv);assert.notEqual(a.ciphertext,b.ciphertext);
 assert.equal((await C.decryptPack(a,v.key)).cases[0].name,'Fictional Personnel Case');
 assert.equal((await C.openPack(a,PASS)).data.cases[0].id,'test-case-001');
});

test('wrong passphrase and header tampering fail authentication',async()=>{
 const v=await fresh();const a=v.envelope;
 await assert.rejects(()=>C.openPack(a,'Incorrect passphrase 0000000000'));
 for(const modified of [
  {...a,revision:a.revision+1},
  {...a,cipher:{...a.cipher,iv:C.toB64(C.rnd(12))}},
  {...a,kdf:{...a.kdf,salt:C.toB64(C.rnd(16))}},
  {...a,ciphertext:a.ciphertext.slice(0,-8)+'AAAAAAAA'}
 ]){if(C.validateEnvelope(modified)) await assert.rejects(()=>C.decryptPack(modified,v.key));}
});

test('unbounded KDF and malformed pack are rejected before expensive derivation',async()=>{
 const a=(await fresh()).envelope;
 assert.equal(C.validateEnvelope({...a,kdf:{...a.kdf,iterations:999999999}}),false);
 assert.equal(C.validateEnvelope({...a,revision:-4}),false);
 assert.equal(C.validateEnvelope({...a,cipher:{...a.cipher,iv:'AAAA'}}),false);
 await assert.rejects(()=>C.openPack({...a,ciphertext:'<script>'},PASS));
 await assert.rejects(()=>C.create('12345678901'));
});

test('test file roundtrip exact byte fingerprint and corruption detection',async()=>{
 const txt=new TextEncoder().encode('FICTIONAL TEST DATA - NO REAL PERSONNEL RECORDS');
 const f={name:'training.txt',size:txt.length,type:'text/plain',arrayBuffer:async()=>txt.buffer.slice(0)};
 const rec=await C.fileRecord(f);
 assert.equal(rec.sha256,await C.digest(txt));
 const v=await fresh();const data={version:1,createdAt:new Date().toISOString(),cases:[{...testCase(),files:[rec]}],history:[]};
 const e=await C.seal(data,v.key,v.salt,1);
 const restored=await C.decryptPack(e,v.key);
 assert.equal(new TextDecoder().decode(C.fromB64(restored.cases[0].files[0].data)),'FICTIONAL TEST DATA - NO REAL PERSONNEL RECORDS');
 const changed=structuredClone(data);changed.cases[0].files[0].data=C.toB64(new TextEncoder().encode('X'.repeat(txt.length)));
 const tamperedCipher=await C.seal(changed,v.key,v.salt,2);await assert.rejects(()=>C.decryptPack(tamperedCipher,v.key),/fingerprint/);
});

test('attachment restrictions prevent unsupported and mislabeled files',async()=>{
 const x=new TextEncoder().encode('<script>alert(1)</script>');
 await assert.rejects(()=>C.fileRecord({name:'exec.html',size:x.length,arrayBuffer:async()=>x.buffer}));
 await assert.rejects(()=>C.fileRecord({name:'fake.pdf',size:x.length,arrayBuffer:async()=>x.buffer}));
 await assert.rejects(()=>C.fileRecord({name:'huge.txt',size:C.MAX_FILE_BYTES+1}));
});

test('same-revision replacement and authenticated header changes are rejected before a write',async()=>{
 const v=await fresh();
 const original=v.envelope;
 const later=await C.seal(v.data,v.key,v.salt,original.revision);
 assert.equal(C.sameEncryptedSnapshot(null,null),true);
 assert.equal(C.sameEncryptedSnapshot(null,original),false);
 assert.equal(C.sameEncryptedSnapshot(original,null),false);
 assert.equal(C.sameEncryptedSnapshot(original,structuredClone(original)),true);
 assert.equal(C.sameEncryptedSnapshot(original,later),false,'same revision does not imply same ciphertext');
 for(const altered of [
  {...original,revision:original.revision+1},
  {...original,kdf:{...original.kdf,salt:C.toB64(C.rnd(16))}},
  {...original,cipher:{...original.cipher,iv:C.toB64(C.rnd(12))}},
  {...original,ciphertext:later.ciphertext},
 ])assert.equal(C.sameEncryptedSnapshot(original,altered),false);
 assert.equal(C.sameEncryptedSnapshot({},original),false);
});
