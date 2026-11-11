'use strict';
/* THE SHIELD FOIA Desk: local-only drafting and encrypted test workspace.
 * No AI endpoints, analytics, payment SDKs, third-party libraries or network requests.
 */
(() => {
  const $ = id => document.getElementById(id);
  const val = id => $(id).value.trim();
  const setStatus = (id, msg) => { $(id).textContent = msg; };
  const clean = text => String(text || '').replace(/\r/g, '').trim();
  const stamp = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const cite = 'https://legislature.mi.gov/Laws/MCL?objectName=';
  const fields = ['agency', 'reference', 'name', 'contact', 'address', 'records', 'start', 'end', 'decision', 'reasons'];
  let key = null;
  let opened = null;
  let lastActivity = 0;
  let databasePromise = null;

  function showType() {
    const type = val('type');
    $('appeal-inputs').hidden = !['denial', 'fee'].includes(type);
    $('fee-inputs').hidden = type !== 'fee';
  }
  $('type').addEventListener('change', showType);
  // Only accept the guide's public draft type; never pass private case text in URLs.
  const selectedType = new URLSearchParams(window.location.search).get('type');
  if (['request','denial','fee','followup'].includes(selectedType)) $('type').value=selectedType;
  showType();

  function buildDraft() {
    const type = val('type');
    const agency = val('agency'), name = val('name'), address = val('address');
    const contact = val('contact'), records = val('records'), reasons = val('reasons');
    if (![agency, name, address, contact, records].every(Boolean)) {
      throw new Error('Please enter the agency, your name, mailing address, contact information, and records requested.');
    }
    if ((type === 'denial' || type === 'fee') && !reasons) {
      throw new Error('For a denial or fee dispute, describe the agency\'s stated reason or calculation and the specific basis for your challenge.');
    }
    const start = val('start'), end = val('end');
    if (start && end && end < start) throw new Error('The records end date must not precede the start date.');
    const period = start || end ? `\nTime period: ${start || '(no starting date specified)'} through ${end || '(no ending date specified)'}.` : '';
    const ref = val('reference') ? `\nAgency reference: ${val('reference')}` : '';
    const notice = val('decision') ? `\nDate on agency notice: ${val('decision')}` : '';
    const intro = `${stamp()}\n\nTo: ${agency}\nAttention: ${type === 'denial' || type === 'fee' ? 'Head of Public Body / FOIA Appeals' : 'FOIA Coordinator'}\n\n`;
    const signature = `\n\nSincerely,\n${name}\n${address}\n${contact}`;
    const scope = `\n\nRecords at issue:\n${records}${period}`;
    let subject = '', content = '', caution = '';
    if (type === 'request') {
      subject = 'Michigan Freedom of Information Act request';
      content = `Under Michigan's Freedom of Information Act, MCL 15.231 et seq., I request inspection of or electronic copies of the existing public records described below.${scope}\n\nPlease provide responsive records in electronic form if they are maintained electronically and can be provided that way. If any portion is exempt, please identify the legal basis for withholding and provide reasonably separable nonexempt material as required by law. If a fee applies, please provide the detailed itemization and information about any applicable deposit before proceeding.\n\nPlease respond in accordance with MCL 15.235. Thank you.`;
      caution = 'Verify the designated FOIA coordinator and agency procedures. Michigan generally requires your full name, mailing address and contact information (see MCL 15.233). A request for answers or new analysis is not necessarily a request for existing records.';
    } else if (type === 'denial') {
      subject = 'APPEAL — denial or partial denial of Michigan FOIA request';
      content = `This correspondence is an APPEAL under MCL 15.240(1)(a) of the denial or partial denial of my Michigan FOIA request.${ref}${notice}${scope}\n\nI request reversal for these specific reasons:\n${reasons}\n\nPlease review the cited basis for withholding, consider whether nonexempt information can reasonably be separated for disclosure under MCL 15.244, and issue a written determination in accordance with MCL 15.240. Please identify any additional records or portions that can be released.\n\nIf this is not the correct office to receive the appeal, please identify the appropriate recipient promptly.`;
      caution = 'This appeal must reach the head of the public body or the recipient authorized by its procedures. Review the exact denial notice and judicial-review options; a 180-day court deadline may apply. This draft does not determine whether an exemption is lawful.';
    } else if (type === 'fee') {
      const appeal = $('fee-policy').checked;
      subject = appeal ? 'APPEAL — Michigan FOIA fee reduction' : 'Request for itemization and explanation of Michigan FOIA fee';
      content = appeal
        ? `This correspondence is an APPEAL for reduction of the fee required for my Michigan FOIA request, under MCL 15.240a(1)(a), because the public body's published procedures provide a fee-appeal process.${ref}${notice}${scope}\n\nI dispute the fee for the following specific reasons, based on the agency's calculation and applicable fee limits:\n${reasons}\n\nPlease review the detailed itemization, identify the basis for the charge under MCL 15.234 and the public body's published procedures, and issue the written determination required by MCL 15.240a. I request waiver or reduction of any amount that exceeds those requirements.`
        : `I request clarification and a detailed itemization of the fee associated with my Michigan FOIA request.${ref}${notice}${scope}\n\nPlease explain the following charges and how each was calculated under MCL 15.234 and your published FOIA procedures:\n${reasons}\n\nPlease also provide a copy or link to your public fee procedures and explain whether the public body provides a written administrative fee appeal to its head. This correspondence asks for an explanation; it is NOT intended as a statutory administrative fee appeal.`;
      caution = appeal
        ? 'Fee appeals under MCL 15.240a(1)(a) are available only if the public body provides that route. Court review may involve a 45-day deadline and special prerequisites. Verify the fee notice and agency procedures immediately.'
        : 'This is a fee clarification letter, not a statutory appeal. Court review of a disputed fee can have a short 45-day limit. Obtain legal advice promptly if a deadline may be approaching.';
    } else {
      subject = 'Status inquiry — Michigan FOIA request';
      content = `I am writing to request a status update on my pending Michigan FOIA request.${ref}${scope}\n\nPlease confirm the legally applicable date of receipt, whether an extension notice has been issued, and the current status of the response. If the request needs clarification, please identify the specific information required. Thank you for your assistance.`;
      caution = 'This is a status inquiry, not a new request or an appeal. Do not assume that sending a follow-up restarts or pauses any statutory deadline. Initial-response timing depends on legal receipt, extensions and business days.';
    }
    const letter = `${intro}RE: ${subject}${ref && type === 'request' ? ref : ''}\n\n${content}${signature}`;
    return { letter, caution, type };
  }

  $('foia-form').addEventListener('submit', e => {
    e.preventDefault();
    try {
      const result = buildDraft();
      $('draft').value = result.letter;
      setStatus('draft-status', `Draft created locally. ${result.caution} Sources: ${cite}mcl-15-235, ${cite}mcl-15-240, ${cite}mcl-15-240a.`);
      $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) { setStatus('draft-status', err.message); $('result').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  $('copy').addEventListener('click', async () => {
    if (!val('draft')) return setStatus('draft-status', 'Generate a draft first.');
    try { await navigator.clipboard.writeText($('draft').value); setStatus('draft-status', 'Copied. Review before filing.'); }
    catch { $('draft').select(); setStatus('draft-status', 'Clipboard permission was denied. The letter is selected; use your device Copy command.'); }
  });
  function downloadFile(filename, data, mime) {
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  $('download').addEventListener('click', () => {
    if (!val('draft')) return setStatus('draft-status', 'Generate a draft first.');
    downloadFile('THE_SHIELD_FOIA_Draft.txt', $('draft').value, 'text/plain;charset=utf-8');
    setStatus('draft-status', 'Downloaded an unencrypted text file. Store or send it carefully.');
  });
  $('print').addEventListener('click', () => {
    if (!val('draft')) return setStatus('draft-status', 'Generate a draft first.');
    $('print-only').textContent = $('draft').value;
    window.print();
  });

  // Browser-only encrypted test workspace. PBKDF2 + AES-GCM; no keys in persistent storage.
  function db() {
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('the-shield-foia-pilot', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('data');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || Error('Browser storage failed.'));
    });
    return databasePromise;
  }
  async function readEnvelope() {
    const database = await db();
    return new Promise((resolve, reject) => {
      const tx = database.transaction('data', 'readonly');
      const req = tx.objectStore('data').get('vault');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }
  async function writeEnvelope(data) {
    const database = await db();
    return new Promise((resolve, reject) => {
      const tx = database.transaction('data', 'readwrite');
      tx.objectStore('data').put(data, 'vault');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  const random = n => crypto.getRandomValues(new Uint8Array(n));
  const b64 = bytes => {
    let result = ''; for (let i = 0; i < bytes.length; i += 8192) result += String.fromCharCode(...bytes.slice(i, i + 8192));
    return btoa(result);
  };
  const from64 = str => Uint8Array.from(atob(str), ch => ch.charCodeAt(0));
  async function derive(passphrase, salt) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 650000, hash: 'SHA-256' }, base,
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async function encryptVault(data, k, salt) {
    const iv = random(12);
    const plain = new TextEncoder().encode(JSON.stringify(data));
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, plain);
    return { format: 'THE_SHIELD_LOCAL_TEST', version: 1, kdf: 'PBKDF2-SHA256', iterations: 650000,
      salt: b64(salt), iv: b64(iv), ciphertext: b64(new Uint8Array(cipher)) };
  }
  async function decryptVault(envelope, k) {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: from64(envelope.iv) }, k, from64(envelope.ciphertext));
    const data = JSON.parse(new TextDecoder().decode(plain));
    if (data.version !== 1 || !Array.isArray(data.records) || data.records.length > 500) throw Error('Unsupported workspace data.');
    return data;
  }
  function validEnvelope(data) {
    return data && data.format === 'THE_SHIELD_LOCAL_TEST' && data.version === 1 &&
      data.kdf === 'PBKDF2-SHA256' && data.iterations === 650000 &&
      ['salt', 'iv', 'ciphertext'].every(k => typeof data[k] === 'string' && /^[A-Za-z0-9+/]+={0,2}$/.test(data[k])) &&
      from64(data.salt).length === 16 && from64(data.iv).length === 12 && data.ciphertext.length < 2000000;
  }
  function lock() {
    key = null; opened = null; $('vault-content').hidden = true;
    $('saved-list').replaceChildren(); $('note-title').value = ''; $('note-body').value = '';
    $('vault-pass').value = ''; $('vault-confirm').value = '';
    setStatus('vault-status', 'Vault locked. No passphrase is saved.');
  }
  $('vault-lock').addEventListener('click', lock);
  function activity() { if (key) lastActivity = Date.now(); }
  document.addEventListener('keydown', activity);
  document.addEventListener('pointerdown', activity);
  document.addEventListener('visibilitychange', () => { if (document.hidden) lock(); });
  window.addEventListener('pagehide', lock);
  setInterval(() => { if (key && Date.now() - lastActivity > 300000) lock(); }, 15000);

  async function refreshState() {
    try {
      const existing = await readEnvelope();
      $('confirm-wrap').hidden = Boolean(existing);
      $('vault-open').textContent = existing ? 'Unlock test workspace' : 'Create encrypted test workspace';
    } catch (err) { setStatus('vault-status', 'Local storage unavailable: ' + err.message); }
  }
  $('vault-open').addEventListener('click', async () => {
    if (!crypto?.subtle) return setStatus('vault-status', 'Secure browser cryptography is unavailable. Use HTTPS in a modern browser.');
    const pass = $('vault-pass').value;
    if (pass.length < 12) return setStatus('vault-status', 'Use a unique passphrase of at least 12 characters.');
    try {
      let envelope = await readEnvelope();
      if (!envelope) {
        if (pass !== $('vault-confirm').value) throw Error('Passphrase confirmation does not match.');
        const salt = random(16), newKey = await derive(pass, salt);
        const fresh = { version: 1, records: [] };
        envelope = await encryptVault(fresh, newKey, salt);
        await writeEnvelope(envelope); key = newKey; opened = fresh;
      } else {
        if (!validEnvelope(envelope)) throw Error('Unrecognized encrypted data; do not overwrite it.');
        const k = await derive(pass, from64(envelope.salt));
        opened = await decryptVault(envelope, k); key = k;
      }
      $('vault-pass').value = ''; $('vault-confirm').value = '';
      lastActivity = Date.now(); $('vault-content').hidden = false;
      setStatus('vault-status', 'Unlocked in this tab. Locks when hidden or after five minutes of inactivity. Export regular encrypted backups.');
      renderRecords(); await refreshState();
    } catch (err) { key = null; opened = null; setStatus('vault-status', 'Cannot unlock or create workspace: ' + err.message); }
  });
  function renderRecords() {
    const list = $('saved-list'); list.replaceChildren();
    if (!opened || !opened.records.length) { const p = document.createElement('p'); p.textContent = 'No saved test entries.'; list.append(p); return; }
    for (const item of [...opened.records].reverse()) {
      const wrap = document.createElement('div'); wrap.className = 'saved-entry';
      const heading = document.createElement('strong'); heading.textContent = item.title || 'Untitled entry';
      const info = document.createElement('small'); info.textContent = `${item.kind === 'draft' ? 'FOIA draft' : 'Journal'} • ${item.eventDate || item.created}`;
      const body = document.createElement('p'); body.textContent = item.body;
      const del = document.createElement('button'); del.type = 'button'; del.className = 'button secondary'; del.textContent = 'Delete entry';
      del.addEventListener('click', async () => {
        if (!confirm('Delete this entry from this browser? This cannot be undone except through an older encrypted backup.')) return;
        const old = opened.records; opened.records = opened.records.filter(r => r.id !== item.id);
        try { await persist(); renderRecords(); } catch (e) { opened.records = old; setStatus('vault-status', 'Delete failed: ' + e.message); }
      });
      wrap.append(heading, info, body, del); list.append(wrap);
    }
  }
  async function persist() {
    if (!key || !opened) throw Error('Unlock the workspace first.');
    if (opened.records.length > 500) throw Error('Maximum 500 records in this beta. Export and archive older notes.');
    const existing = await readEnvelope();
    if (!validEnvelope(existing)) throw Error('Stored envelope cannot be validated.');
    const envelope = await encryptVault(opened, key, from64(existing.salt));
    await writeEnvelope(envelope); activity();
  }
  async function addRecord(kind, title, body, eventDate) {
    if (!key || !opened) throw Error('Unlock your encrypted test workspace first.');
    if (!body.trim()) throw Error('There is no text to save.');
    const entry = { id: crypto.randomUUID(), kind, title, body: body.slice(0, 16000), eventDate, created: new Date().toISOString() };
    opened.records.push(entry);
    try { await persist(); renderRecords(); }
    catch (err) { opened.records.pop(); throw err; }
  }
  $('note-save').addEventListener('click', async () => {
    try { await addRecord('note', val('note-title') || 'Test note', val('note-body'), val('note-date'));
      $('note-title').value = ''; $('note-body').value = ''; setStatus('vault-status', 'Encrypted test note saved locally.'); }
    catch (err) { setStatus('vault-status', err.message); }
  });
  $('save-draft').addEventListener('click', async () => {
    try { await addRecord('draft', `${$('type').selectedOptions[0].textContent} — ${val('agency') || 'unknown agency'}`, val('draft'), '');
      setStatus('draft-status', 'Draft encrypted into this browser workspace. Export an encrypted backup separately.'); }
    catch (err) { setStatus('draft-status', err.message); }
  });
  $('vault-export').addEventListener('click', async () => {
    try {
      const envelope = await readEnvelope();
      if (!validEnvelope(envelope)) throw Error('No valid encrypted workspace found.');
      downloadFile('THE_SHIELD_Encrypted_Test_Backup.json', JSON.stringify(envelope, null, 2), 'application/json');
      setStatus('vault-status', 'Encrypted backup exported. Keep your passphrase separate; it cannot be recovered.');
    } catch (err) { setStatus('vault-status', err.message); }
  });
  $('vault-import').addEventListener('change', async e => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    if (file.size > 1600000) return setStatus('vault-status', 'Backup too large for this test version.');
    try {
      const data = JSON.parse(await file.text());
      if (!validEnvelope(data)) throw Error('Invalid or unsupported encrypted backup.');
      const pass = $('vault-pass').value;
      if (!pass) throw Error('Enter the backup passphrase in the passphrase field before restoring.');
      const k = await derive(pass, from64(data.salt));
      await decryptVault(data, k); // Verify authenticity BEFORE replacing anything.
      if (!confirm('Replace ALL existing browser workspace records with this backup? Export the current backup first.')) return;
      lock(); await writeEnvelope(data); await refreshState();
      setStatus('vault-status', 'Verified encrypted backup restored. Enter its passphrase again to unlock.');
    } catch (err) { setStatus('vault-status', 'Backup was not restored: ' + err.message); }
  });
  fields.forEach(id => { if (!$(id)) throw Error('Missing form field: ' + id); });
  refreshState();
})();
