'use strict';
/* THE SHIELD security review candidate: fictional test data only.
   Data is encrypted BEFORE persistent storage. No network requests or external libraries.
*/
(() => {
  const C = window.ShieldCrypto;
  const $ = id => document.getElementById(id);
  const V = id => ($(id)?.value || '').trim();
  const state = {key:null,salt:null,data:null,revision:null,selected:'',busy:false,last:0,lastEnvelope:null};
  let databasePromise = null;
  const now = () => new Date().toISOString();
  const ALLOW_LOCK_MS = 5*60*1000;
  const setMsg = (message, error=false) => {const el=$('lock-status');el.textContent=message;el.className='minor '+(error?'error':'good');};
  const clear = el => el.replaceChildren();
  const el = (tag,text,className) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
  const safeDate = t => (t?String(t).slice(0,24):'—');
  const uuid=()=>crypto.randomUUID();
  const statusError = e=>setMsg(e?.message||'An error occurred.',true);
  function download(filename,bytes,type){
    const blob=new Blob([bytes],{type});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),12000);
  }
  function db(){
    if(databasePromise)return databasePromise;
    databasePromise=new Promise((resolve,reject)=>{
      const r=indexedDB.open('the-shield-local-vault-review',1);
      r.onupgradeneeded=()=>r.result.createObjectStore('packs');
      r.onsuccess=()=>{r.result.onversionchange=()=>{r.result.close();lock('Another tab changed browser storage. Vault locked.');};resolve(r.result);};
      r.onerror=()=>reject(r.error||Error('Unable to open browser storage.'));
      r.onblocked=()=>reject(Error('Storage is locked by another tab.'));
    });return databasePromise;
  }
  async function readPack(){const database=await db();return new Promise((resolve,reject)=>{
    const tx=database.transaction('packs','readonly');const r=tx.objectStore('packs').get('primary');r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);
  });}
  async function compareAndSwap(next,expectedSnapshot,allowDamagedPrevious=false){
    const database=await db();return new Promise((resolve,reject)=>{
      const tx=database.transaction('packs','readwrite');let failure=null;
      const r=tx.objectStore('packs').get('primary');
      r.onsuccess=()=>{const prev=r.result||null;
        if(prev && !C.validateEnvelope(prev) && !allowDamagedPrevious){failure=Error('Stored encrypted pack is damaged. Restore a verified backup or delete the local copy.');tx.abort();return;}
        if(!C.sameEncryptedSnapshot(prev,expectedSnapshot) &&
           !(allowDamagedPrevious && C.sameStoredSnapshot(prev,expectedSnapshot))){failure=Error('Another tab or restore changed this vault. Your edit was NOT saved. Reopen the vault.');tx.abort();return;}
        tx.objectStore('packs').put(next,'primary');
      };
      r.onerror=()=>{failure=r.error||Error('Cannot read current revision.');tx.abort();};
      tx.oncomplete=()=>resolve();
      tx.onabort=()=>reject(failure||tx.error||Error('Save cancelled.'));
      tx.onerror=()=>{failure=tx.error||Error('Save failed.');};
    });
  }
  function lock(msg){
    state.key=null;state.salt=null;state.data=null;state.revision=null;state.selected='';state.lastEnvelope=null;state.busy=false;
    $('vault-pane').hidden=true;$('lock-pane').hidden=false;
    for(const id of ['pass','confirm-pass','case-name','event-title','event-body','foia-agency','foia-description']) $(id).value='';
    for(const id of ['events','foias','attachments','history','case-metrics'])clear($(id));
    $('case-select').replaceChildren(el('option','Select a case'));
    $('current-case').textContent='Select a case first';$('case-summary').textContent='Create a fictional case to start.';
    setMsg(msg||'Locked. Only encrypted bytes remain in browser storage. Export separate backups.');
  }
  function touch(){if(state.key)state.last=Date.now();}
  document.addEventListener('keydown',touch);
  document.addEventListener('pointerdown',touch);
  document.addEventListener('visibilitychange',()=>{if(document.hidden && state.key)lock('Locked when the page became hidden. Encrypted changes were saved.');});
  window.addEventListener('pagehide',()=>{if(state.key)lock('Locked because the page was closed.');});
  setInterval(()=>{if(state.key && Date.now()-state.last>ALLOW_LOCK_MS)lock('Locked after five minutes of inactivity.');},15000);
  $('lock').addEventListener('click',()=>lock('Vault locked manually.'));

  async function refreshLocked(){try{const old=await readPack();$('confirm-pane').hidden=Boolean(old);$('open').textContent=old?'Unlock encrypted test vault':'Create encrypted test vault';$('export-locked').disabled=!old; if(old && !C.validateEnvelope(old))setMsg('Stored encrypted package failed validation. Do not overwrite.',true);}catch(e){statusError(e);}}
  function openView(){
    $('lock-pane').hidden=true;$('vault-pane').hidden=false;
    $('revision').textContent='Revision '+state.revision;state.last=Date.now();render();
  }
  $('open').addEventListener('click',async()=>{
    if(state.busy)return;state.busy=true;$('open').disabled=true;
    try{
      if(!globalThis.crypto?.subtle)throw Error('Web Crypto is unavailable. Use a secure modern browser.');
      const pass=$('pass').value;
      const stored=await readPack();
      if(stored){const result=await C.openPack(stored,pass);state.key=result.key;state.salt=result.salt;state.data=result.data;state.revision=stored.revision;state.lastEnvelope=stored;}
      else{if(pass!==$('confirm-pass').value)throw Error('Passphrases do not match.');
        const result=await C.create(pass);await compareAndSwap(result.envelope,null);
        state.key=result.key;state.salt=result.salt;state.data=result.data;state.revision=0;state.lastEnvelope=result.envelope;
      }
      $('pass').value='';$('confirm-pass').value='';openView();
    }catch(e){statusError(e);}finally{state.busy=false;$('open').disabled=false;}
  });
  async function mutate(action,detail,edit){
    if(!state.key||!state.data)throw Error('Unlock the encrypted workspace first.');
    if(state.busy)throw Error('Another save is underway.');
    state.busy=true;
    try{
      const heldKey=state.key;
      const fresh=structuredClone(state.data);
      const result=await edit(fresh);
      fresh.history.push({at:now(),action:action.slice(0,40),detail:String(detail).slice(0,240)});
      if(fresh.history.length>2000)fresh.history.splice(0,fresh.history.length-2000);
      C.validateData(fresh);
      const nextRev=state.revision+1;
      const envelope=await C.seal(fresh,state.key,state.salt,nextRev);
      await compareAndSwap(envelope,state.lastEnvelope);
      if(!state.key || state.key !== heldKey) return result; // The user locked while saving. Never re-expose plaintext.
      state.data=fresh;state.revision=nextRev;state.lastEnvelope=envelope;
      $('revision').textContent='Revision '+state.revision;
      touch();render();return result;
    }catch(e){if(/Another tab or restore/.test(e.message))lock('A conflicting change was detected. Reopen the vault before editing.');throw e;}
    finally{state.busy=false;}
  }
  function selected(){const c=state.data?.cases.find(x=>x.id===state.selected);if(!c)throw Error('Choose or create a case first.');return c;}
  function selectedIn(data){const c=data.cases.find(x=>x.id===state.selected);if(!c)throw Error('Choose a case first.');return c;}
  $('add-case').addEventListener('click',async()=>{
    try{const name=V('case-name');if(name.length<3||name.length>150)throw Error('Enter a case name between 3 and 150 characters.');
      const id=uuid();await mutate('case-created',name,d=>{d.cases.push({id,name,createdAt:now(),events:[],foia:[],files:[]});});
      state.selected=id;$('case-name').value='';render();
    }catch(e){statusError(e);}
  });
  $('case-select').addEventListener('change',()=>{state.selected=$('case-select').value;render();});
  $('event-form').addEventListener('submit',async e=>{e.preventDefault();try{selected();const title=V('event-title'),body=V('event-body'),date=V('event-date');if(!title||!body)throw Error('Enter both an event title and description.');
    await mutate('event-added',title,d=>selectedIn(d).events.push({id:uuid(),at:now(),eventDate:date,title,body}));
    $('event-title').value='';$('event-body').value='';$('event-date').value='';
  }catch(err){statusError(err);}});
  $('foia-form').addEventListener('submit',async e=>{e.preventDefault();try{selected();const agency=V('foia-agency'),description=V('foia-description'),status=V('foia-status');if(!agency||!description)throw Error('Enter agency and requested records.');
    await mutate('foia-entry-added',agency,d=>selectedIn(d).foia.push({id:uuid(),agency,description,status,at:now()}));
    $('foia-agency').value='';$('foia-description').value='';
  }catch(err){statusError(err);}});
  $('attachment-file').addEventListener('change',async e=>{
    const file=e.target.files?.[0];e.target.value='';if(!file)return;
    try{selected();const f=await C.fileRecord(file);
      const total=state.data.cases.reduce((sum,c)=>sum+c.files.reduce((a,x)=>a+x.size,0),0);
      if(total+f.size>C.MAX_FILE_TOTAL_BYTES)throw Error('Vault total file limit exceeded (6 MiB).');
      await mutate('file-added',f.name,d=>selectedIn(d).files.push(f));
      setMsg('Test attachment encrypted and fingerprinted. Download an encrypted backup.');
    }catch(err){statusError(err);}
  });
  function render(){
    if(!state.data)return;
    $('case-count').textContent=state.data.cases.length+' case(s)';
    const select=$('case-select');select.replaceChildren();
    const prompt=el('option','Select a case');prompt.value='';select.append(prompt);
    for(const c of state.data.cases){const opt=el('option',c.name);opt.value=c.id;select.append(opt);}
    if(!state.data.cases.some(c=>c.id===state.selected))state.selected='';
    select.value=state.selected;
    const c=state.data.cases.find(x=>x.id===state.selected);
    const eventBox=$('events'),foiaBox=$('foias'),fileBox=$('attachments'),hist=$('history');
    for(const x of [eventBox,foiaBox,fileBox,hist,$('case-metrics')])clear(x);
    $('current-case').textContent=c?c.name:'Select a case first';
    $('case-summary').textContent=c?'Created '+safeDate(c.createdAt)+' · local test data only.':'Create a fictional case to begin.';
    if(c){
      for(const [n,text] of [[c.events.length,'Events'],[c.foia.length,'FOIA entries'],[c.files.length,'Attachments']])$('case-metrics').append(el('span',n+' '+text,'metric'));
      for(const e of [...c.events].reverse().slice(0,50)){
        const row=el('div',undefined,'item');row.append(el('strong',e.title),el('small',(e.eventDate||'Undated event')+' · saved '+safeDate(e.at)),el('p',e.body));eventBox.append(row);
      }
      for(const f of [...c.foia].reverse().slice(0,50)){
        const row=el('div',undefined,'item');row.append(el('strong',f.agency),el('small',f.status+' · '+safeDate(f.at)),el('p',f.description));foiaBox.append(row);
      }
      for(const f of c.files){
        const row=el('div',undefined,'item');row.append(el('strong',f.name),el('small',`${f.size.toLocaleString()} bytes · SHA-256: ${f.sha256}`));
        const button=el('button','Verify fingerprint and download','secondary');button.type='button';
        button.addEventListener('click',async()=>{try{const bytes=C.fromB64(f.data),got=await C.digest(bytes);if(got!==f.sha256)throw Error('Attachment fingerprint mismatch. Download blocked.');download(f.name,bytes,'application/octet-stream');bytes.fill(0);}catch(e){statusError(e);}});
        row.append(button);fileBox.append(row);
      }
    }
    for(const h of [...state.data.history].reverse().slice(0,60)){
      const row=el('div',undefined,'item');row.append(el('strong',h.action),el('small',safeDate(h.at)),el('p',h.detail));hist.append(row);
    }
    for(const [x,msg] of [[eventBox,'No events in this case.'],[foiaBox,'No FOIA records in this case.'],[fileBox,'No sample attachments in this case.'],[hist,'No local changes recorded.']])if(!x.children.length)x.append(el('p',msg,'minor'));
  }
  async function exportPack(){
    const envelope=await readPack();if(!C.validateEnvelope(envelope))throw Error('No valid encrypted package is saved.');
    if(state.key){await C.decryptPack(envelope,state.key);}
    const text=JSON.stringify(envelope,null,2);
    download(`THE_SHIELD_ENCRYPTED_TEST_${new Date().toISOString().slice(0,10)}.shieldvault`,text,'application/json');
    setMsg('Encrypted backup downloaded. Save more than one copy and keep the passphrase separate.');
  }
  $('export').addEventListener('click',()=>exportPack().catch(statusError));
  $('export-locked').addEventListener('click',()=>exportPack().catch(statusError));
  $('delete-local').addEventListener('click',async()=>{
    try{
      const existing=await readPack();if(!existing)throw Error('No local vault exists to delete.');
      const typed=prompt('This permanently deletes the local encrypted browser copy. Export a backup first if needed. Type DELETE to confirm:');
      if(typed!=='DELETE')return;
      const database=await db();
      await new Promise((resolve,reject)=>{
        const tx=database.transaction('packs','readwrite');let failed=null;
        const req=tx.objectStore('packs').get('primary');
        req.onsuccess=()=>{if(!C.sameStoredSnapshot(req.result||null,existing)){failed=Error('Vault changed in another tab. Try again.');tx.abort();return;}tx.objectStore('packs').delete('primary');};
        req.onerror=()=>{failed=Error('Cannot read stored vault.');tx.abort();};
        tx.oncomplete=()=>resolve();tx.onabort=()=>reject(failed||tx.error||Error('Delete failed.'));
      });
      lock('Encrypted browser copy deleted. Previously exported backups are unaffected.');await refreshLocked();
    }catch(e){statusError(e);}
  });
  // The file chooser never performs a destructive action by itself.
  // Separate the encrypted file selection from explicit authentication / restore.
  let pendingBackupFile=null, restoreBusy=false;
  $('backup-file').addEventListener('change',e=>{
    const chosen=e.target.files?.[0]||null;
    pendingBackupFile=chosen && chosen.size<=14500000 ? chosen : null;
    $('restore-selected').disabled=!pendingBackupFile;
    if(chosen && !pendingBackupFile) setMsg('Encrypted backup is too large for this test restore.',true);
    else if(pendingBackupFile) setMsg('Encrypted backup selected. Enter its passphrase, then choose Verify and restore. No local data has been changed.');
    else setMsg('No encrypted backup selected.');
  });
  $('restore-selected').addEventListener('click',async()=>{
    if(restoreBusy||!pendingBackupFile)return;
    restoreBusy=true;$('restore-selected').disabled=true;
    try{
      const pass=$('pass').value;
      if(!pass)throw Error('Enter the backup passphrase, then select Verify and restore.');
      const envelope=JSON.parse(await pendingBackupFile.text());
      if(!C.validateEnvelope(envelope))throw Error('Not a valid THE SHIELD encrypted package.');
      const opened=await C.openPack(envelope,pass); // Authenticate FIRST, before touching stored data.
      const existing=await readPack();
      if(existing&&!confirm('Replace the entire existing encrypted TEST vault? First export a separate backup of the current vault. This is irreversible without a previous backup.'))return;
      // Preserve monotonic revision even if intentionally restoring an older backup.
      const baseRev=existing?existing.revision:-1;
      const next=await C.seal(opened.data,opened.key,opened.salt,baseRev+1);
      await compareAndSwap(next,existing,true);
      pendingBackupFile=null;$('backup-file').value='';
      lock('Verified encrypted backup restored. Unlock again with the backup passphrase.');
      await refreshLocked();
    }catch(err){statusError(err);}
    finally{restoreBusy=false;$('restore-selected').disabled=!pendingBackupFile;}
  });
  if(!globalThis.crypto?.subtle||!globalThis.indexedDB){setMsg('This browser is missing required secure local storage or Web Crypto.',true);$('open').disabled=true;}
  else refreshLocked();
})();
