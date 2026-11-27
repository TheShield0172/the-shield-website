// Run: node --test tests/nationwide.test.cjs (Node 18+; no dependencies)
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'nationwide.js'),'utf8');
const html=fs.readFileSync(path.join(root,'nationwide.html'),'utf8');
const expected='Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming'.split('|');
function element(){return {children:[],style:{},listeners:{},value:'',textContent:'',hidden:false,setAttribute(k,v){this[k]=v},appendChild(n){this.children.push(n);return n},insertBefore(n){return this.appendChild(n)},replaceChildren(){this.children=[]},addEventListener(k,f){this.listeners[k]=f},scrollIntoView(){},dispatch(k){this.listeners[k]()}}}
test('syntax and all 50 real selection handlers',()=>{
 const script=new vm.Script(js);
 const select=html.match(/<select\b[^>]*id="state"[^>]*>([\s\S]*?)<\/select>/);
 assert.ok(select,'state select missing');
 const options=[...select[1].matchAll(/<option(?:\s[^>]*)?>([^<]*)<\/option>/g)].map(m=>m[1]).filter(x=>expected.includes(x));
 assert.deepEqual(options,expected);
 const ids=Object.fromEntries(['state','state-note','state-resources','state-heading','state-intro','request-template','download-template','print-template','guide-link'].map(k=>[k,element()]));
 script.runInNewContext({document:{getElementById:k=>ids[k],createElement:element}});
 const panel=ids['state-resources'], verified=panel.children.find(n=>n.id==='verified-state');
 assert.ok(verified);
 for(const name of options){
  ids.state.value=name;ids.state.dispatch('change');
  assert.equal(panel.hidden,false,name);
  assert.ok(ids['state-heading'].textContent.startsWith(name+' —'),name);
  assert.ok(ids['request-template'].textContent.includes(name.toUpperCase()),name);
  assert.equal(ids['guide-link'].href,'https://www.rcfp.org/open-government-guide/'+name.toLowerCase().replace(/\s+/g,'-')+'/');
  assert.equal(verified.hidden,false,name+' missing profile');
  assert.ok(verified.children.some(n=>typeof n.href==='string'&&n.href.startsWith('https://')),name+' missing links');
 }
 ids.state.value='';ids.state.dispatch('change');assert.equal(panel.hidden,true);
});
