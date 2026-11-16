'use strict';
/* Anonymous survey: only explicitly entered fields are sent to Formspree
   after the form owner supplies a verified free Formspree endpoint.
   No tracking, API secrets, personal data collection by our static site.
*/
(function(root){
  const VALID_ENDPOINT=/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]{5,40}$/;
  function allowedEndpoint(value){
    return typeof value==='string'&&VALID_ENDPOINT.test(value.trim());
  }
  async function postFeedback(endpoint,data,fetcher){
    if(!allowedEndpoint(endpoint))throw Error('The feedback inbox is not connected.');
    const res=await fetcher(endpoint,{
      method:'POST',body:data,
      headers:{Accept:'application/json'},
      mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'
    });
    // Formspree free tier returns a standard 429 on rate limiting.
    if(res.status===429)throw Error('We are receiving too many suggestions right now. Please try again a little later.');
    if(!res.ok)throw Error('Your suggestion was not delivered. Please try again shortly.');
    return true;
  }
  if(typeof module==='object'&&module.exports)module.exports={allowedEndpoint,postFeedback};
  if(!root.document)return;
  const form=root.document.getElementById('feedback-form');
  if(!form)return;
  const connection=root.document.getElementById('feedback-connection');
  const fields=root.document.getElementById('feedback-fields');
  const button=root.document.getElementById('feedback-submit');
  const status=root.document.getElementById('feedback-result');
  const suggestion=root.document.getElementById('suggestion');
  const counter=root.document.getElementById('character-count');
  const endpoint=typeof root.SHIELD_FEEDBACK_ENDPOINT==='string'?root.SHIELD_FEEDBACK_ENDPOINT.trim():'';
  const active=allowedEndpoint(endpoint);
  fields.disabled=!active;
  button.disabled=!active;
  connection.classList.add(active?'ready':'pending');
  connection.textContent=active
    ?'Feedback is open. Submit without an account or payment.'
    :'Feedback collection is being connected. This form is a preview and cannot send submissions yet. Please check back soon.';
  const count=()=>{counter.textContent=suggestion.value.length+' / 750';};
  suggestion.addEventListener('input',count);count();
  function show(message,error){
    status.hidden=false;status.classList.toggle('error',!!error);status.textContent=message;
  }
  let busy=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(busy)return;
    if(!active){show('Submission is not connected yet; nothing has been sent.',true);return;}
    if(!form.checkValidity()){form.reportValidity();return;}
    if(suggestion.value.trim().length<8){show('Please add a short, general suggestion (at least eight characters).',true);suggestion.focus();return;}
    if(form.elements.namedItem('_gotcha')?.value){
      // Honeypot: drop obvious bot submissions. No external request.
      form.reset();count();show('Thanks for your interest.');return;
    }
    busy=true;button.disabled=true;button.textContent='Sending…';
    status.hidden=true;
    try{
      const data=new FormData(form);
      // Only permit a fixed survey field allowlist; never collect a file.
      for(const key of [...data.keys()])if(!['field','tool_tried','priority','suggestion','paid_interest','email','consent','_gotcha','_subject','source'].includes(key))data.delete(key);
      await postFeedback(endpoint,data,root.fetch.bind(root));
      form.reset();count();fields.disabled=true;
      show('Thank you! Your suggestion was submitted successfully. We appreciate your help shaping THE SHIELD.',false);
    }catch(err){
      show(err?.message||'The suggestion could not be sent. Please try again.',true);
    }finally{
      busy=false;button.textContent='Send my feedback';
      if(!fields.disabled)button.disabled=false;
    }
  });
})(typeof window==='object'?window:globalThis);
