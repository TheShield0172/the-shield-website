'use strict';
/* THE SHIELD vault review candidate.
   All stored records are encrypted before IndexedDB; no password or key is persisted.
   This is NOT an audited product and is restricted to fictional test data.
*/
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ShieldCrypto = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  const MAGIC = 'THE_SHIELD_CASE_PACK';
  const VERSION = 1;
  const ITERATIONS = 650000;
  const MAX_CIPHER_CHARS = 18000000;
  const MAX_PLAIN_BYTES = 12582912;
  const MAX_FILE_BYTES = 2097152;
  const MAX_FILE_TOTAL_BYTES = 6291456;
  const ALLOWED = new Set(['pdf', 'txt', 'eml', 'png', 'jpg', 'jpeg']);
  const utf8 = s => new TextEncoder().encode(s);
  const rnd = n => crypto.getRandomValues(new Uint8Array(n));
  const toB64 = data => {
    const a = data instanceof Uint8Array ? data : new Uint8Array(data);
    let s = '';
    for (let i = 0; i < a.length; i += 8192) s += String.fromCharCode(...a.subarray(i, i + 8192));
    return btoa(s);
  };
  const fromB64 = value => {
    if (typeof value !== 'string' || !value || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) throw Error('Invalid base64.');
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
  };
  const hex = u8 => [...u8].map(x => x.toString(16).padStart(2, '0')).join('');
  const digest = async u8 => hex(new Uint8Array(await crypto.subtle.digest('SHA-256', u8)));
  const safeText = (value, max) => typeof value === 'string' && value.length <= max;
  const recordDate = value => safeText(value, 40);
  const isObject = x => !!x && typeof x === 'object' && !Array.isArray(x);
  const now = () => new Date().toISOString();

  function validateEnvelope(x) {
    try {
      if (!isObject(x) || x.format !== MAGIC || x.version !== VERSION || !Number.isSafeInteger(x.revision) || x.revision < 0 || x.revision > 100000000 ||
          !isObject(x.kdf) || x.kdf.name !== 'PBKDF2' || x.kdf.hash !== 'SHA-256' || x.kdf.iterations !== ITERATIONS ||
          !isObject(x.cipher) || x.cipher.name !== 'AES-GCM' || x.cipher.tagBits !== 128 ||
          typeof x.ciphertext !== 'string' || x.ciphertext.length < 24 || x.ciphertext.length > MAX_CIPHER_CHARS ||
          fromB64(x.kdf.salt).length !== 16 || fromB64(x.cipher.iv).length !== 12) return false;
      return true;
    } catch (_) { return false; }
  }
  function aad(x) {
    return utf8([x.format, x.version, x.revision, x.kdf.name, x.kdf.hash, x.kdf.iterations, x.kdf.salt, x.cipher.name, x.cipher.tagBits, x.cipher.iv].join('|'));
  }
  async function derive(passphrase, salt) {
    if (typeof passphrase !== 'string' || passphrase.length < 16 || passphrase.length > 200) throw Error('Passphrase must be 16–200 characters.');
    if (!(salt instanceof Uint8Array) || salt.length !== 16) throw Error('Invalid encryption salt.');
    const imported = await crypto.subtle.importKey('raw', utf8(passphrase), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},imported,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }
  function validateData(data) {
    if (!isObject(data) || data.version !== 1 || !recordDate(data.createdAt) || !Array.isArray(data.cases) || data.cases.length > 40 ||
        !Array.isArray(data.history) || data.history.length > 2000) throw Error('Invalid or unsupported case pack.');
    const seen = new Set(); let fileTotal = 0;
    for (const c of data.cases) {
      if (!isObject(c) || !safeText(c.id, 80) || c.id.length < 8 || seen.has(c.id) || !safeText(c.name, 150) || !c.name.trim() ||
          !recordDate(c.createdAt) || !Array.isArray(c.events) || c.events.length > 350 || !Array.isArray(c.foia) || c.foia.length > 150 ||
          !Array.isArray(c.files) || c.files.length > 35) throw Error('Invalid case data.');
      seen.add(c.id);
      for (const e of c.events) if (!isObject(e) || !safeText(e.id,80) || !recordDate(e.at) || !recordDate(e.eventDate) || !safeText(e.title,160) || !safeText(e.body,12000)) throw Error('Invalid case event.');
      for (const f of c.foia) if (!isObject(f) || !safeText(f.id,80) || !safeText(f.agency,160) || !safeText(f.status,40) || !safeText(f.description,4000) || !recordDate(f.at)) throw Error('Invalid FOIA entry.');
      for (const f of c.files) {
        if (!isObject(f) || !safeText(f.id,80) || !safeText(f.name,240) || !safeText(f.sha256,64) || !/^[a-f0-9]{64}$/.test(f.sha256) ||
            !Number.isInteger(f.size) || f.size < 0 || f.size > MAX_FILE_BYTES || !recordDate(f.at) || !safeText(f.type,100)) throw Error('Invalid attachment metadata.');
        const content = fromB64(f.data);
        if (content.length !== f.size) throw Error('Attachment byte length mismatch.');
        fileTotal += content.length;
      }
    }
    for (const h of data.history) if (!isObject(h) || !recordDate(h.at) || !safeText(h.action,40) || !safeText(h.detail,240)) throw Error('Invalid local history.');
    if (fileTotal > MAX_FILE_TOTAL_BYTES) throw Error('Too much attachment data.');
    return data;
  }
  async function verifyFileDigests(data) {
    validateData(data);
    for (const c of data.cases) for (const f of c.files) {
      const bytes = fromB64(f.data);
      const actual = await digest(bytes);
      bytes.fill(0);
      if (actual !== f.sha256) throw Error('An attachment fingerprint does not match its bytes.');
    }
    return true;
  }
  async function seal(data, key, salt, revision) {
    validateData(data);
    if (!Number.isSafeInteger(revision) || revision < 0) throw Error('Invalid revision.');
    if (!(salt instanceof Uint8Array) || salt.length !== 16) throw Error('Invalid salt.');
    const plain = utf8(JSON.stringify(data));
    if (plain.length > MAX_PLAIN_BYTES) throw Error('This encrypted pack has reached its size limit.');
    const envelope = {format:MAGIC,version:VERSION,revision,
      kdf:{name:'PBKDF2',hash:'SHA-256',iterations:ITERATIONS,salt:toB64(salt)},
      cipher:{name:'AES-GCM',tagBits:128,iv:toB64(rnd(12))},ciphertext:''};
    const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM',iv:fromB64(envelope.cipher.iv),additionalData:aad(envelope),tagLength:128},key,plain);
    envelope.ciphertext = toB64(new Uint8Array(ciphertext));
    return envelope;
  }
  async function openPack(envelope, passphrase) {
    if (!validateEnvelope(envelope)) throw Error('Invalid or unsupported encrypted pack.');
    const salt = fromB64(envelope.kdf.salt);
    const key = await derive(passphrase,salt);
    const data = await decryptPack(envelope,key);
    return {data,key,salt};
  }
  async function decryptPack(envelope, key) {
    if (!validateEnvelope(envelope)) throw Error('Invalid or unsupported encrypted pack.');
    let buf;
    try { buf = await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(envelope.cipher.iv),additionalData:aad(envelope),tagLength:128},key,fromB64(envelope.ciphertext)); }
    catch (_) { throw Error('Incorrect passphrase or encrypted pack was altered.'); }
    if (buf.byteLength > MAX_PLAIN_BYTES) throw Error('Pack is too large.');
    let data;
    try { data = JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(buf)); } catch (_) { throw Error('Encrypted pack contents are invalid.'); }
    validateData(data);
    await verifyFileDigests(data);
    return data;
  }
  async function create(passphrase) {
    const salt = rnd(16), key=await derive(passphrase,salt);
    const data={version:1,createdAt:now(),cases:[],history:[]};
    const envelope=await seal(data,key,salt,0);
    return {salt,key,data,envelope};
  }
  async function fileRecord(file) {
    const name=String(file.name||'').slice(0,240);
    const ext=name.split('.').pop().toLowerCase();
    if (!ALLOWED.has(ext)) throw Error('Only PDF, TXT, EML, PNG and JPG test files are allowed.');
    if (file.size > MAX_FILE_BYTES || file.size < 1) throw Error('The test file must be between 1 byte and 2 MiB.');
    const bytes = new Uint8Array(await file.arrayBuffer());
    if(bytes.byteLength!==file.size) throw Error('File changed during reading.');
    const isPdf = ext === 'pdf';
    if (isPdf && ![37,80,68,70,45].every((x,i)=>bytes[i]===x)) throw Error('Not a valid PDF header.');
    if(ext==='png' && ![137,80,78,71,13,10,26,10].every((x,i)=>bytes[i]===x)) throw Error('Not a valid PNG header.');
    if(['jpg','jpeg'].includes(ext) && !(bytes[0]===255 && bytes[1]===216 && bytes[2]===255)) throw Error('Not a valid JPEG header.');
    const hash=await digest(bytes);
    const encoded=toB64(bytes);bytes.fill(0);
    return {id:crypto.randomUUID(),name,size:file.size,type:file.type||'application/octet-stream',sha256:hash,data:encoded,at:now()};
  }
  return Object.freeze({MAGIC,VERSION,ITERATIONS,MAX_FILE_BYTES,MAX_FILE_TOTAL_BYTES,create,derive,seal,openPack,decryptPack,validateEnvelope,validateData,verifyFileDigests,fileRecord,fromB64,toB64,digest,rnd});
});
