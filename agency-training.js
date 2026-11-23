"use strict";
/* A small, no-login lead-intake form. Never processes candidate or incident data.
   Reuses the owner-verified Formspree feedback endpoint, with a distinct source tag.
   Formspree free tier does NOT include autoresponder emails.
*/
(function(root){
  const VALID_ENDPOINT=/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{5,40}$/;
  function allowedEndpoint(value){return typeof value==="string"&&VALID_ENDPOINT.test(value.trim());}
  function buildData(form){
    const data=new FormData(form);
    const allowed=new Set(["agency","contact_name","email","track","training_goal","group_size","budget","training_needs","contact_consent","_gotcha","_subject","source"]);
    for(const name of [...data.keys()])if(!allowed.has(name))data.delete(name);
    return data;
  }
  async function postInquiry(endpoint,data,fetcher){
    if(!allowedEndpoint(endpoint))throw Error("The agency inbox is not connected.");
    const response=await fetcher(endpoint,{method:"POST",body:data,headers:{Accept:"application/json"},mode:"cors",credentials:"omit",cache:"no-store",referrerPolicy:"no-referrer"});
    if(response.status===429)throw Error("The inquiry inbox is receiving too many submissions. Please try later.");
    if(!response.ok)throw Error("Your inquiry could not be delivered. Please try again.");
    return true;
  }
  if(typeof module==="object"&&module.exports)module.exports={allowedEndpoint,postInquiry,buildData};
  if(!root.document)return;
  const form=root.document.getElementById("agency-form");if(!form)return;
  const fieldset=root.document.getElementById("agency-fields");
  const submit=root.document.getElementById("agency-submit");
  const connection=root.document.getElementById("agency-connection");
  const result=root.document.getElementById("agency-result");
  const endpoint=typeof root.SHIELD_FEEDBACK_ENDPOINT==="string"?root.SHIELD_FEEDBACK_ENDPOINT.trim():"";
  const active=allowedEndpoint(endpoint);
  fieldset.disabled=!active;submit.disabled=!active;
  connection.textContent=active?"Agency inquiry form available. No account or payment required.":"The inquiry inbox is not configured, so this form cannot accept submissions yet.";
  let busy=false;
  function show(message,error){result.hidden=false;result.classList.toggle("error",!!error);result.textContent=message;}
  form.addEventListener("submit",async function(event){
    event.preventDefault();
    if(busy)return;
    if(!active){show("No submission was sent: the agency inquiry inbox is not configured.",true);return;}
    if(!form.checkValidity()){form.reportValidity();return;}
    if(form.elements.namedItem("_gotcha")?.value){form.reset();show("Thank you for your interest.",false);return;}
    busy=true;submit.disabled=true;submit.textContent="Sending…";result.hidden=true;
    try{
      const data=buildData(form);
      await postInquiry(endpoint,data,root.fetch.bind(root));
      form.reset();
      show("Thank you. Your agency training inquiry has been submitted. We may email you to discuss potential pilot development; no service has been purchased.",false);
    }catch(error){show(error?.message||"The inquiry was not delivered.",true);}
    finally{busy=false;submit.disabled=!active;submit.textContent="Send agency inquiry";}
  });
})(typeof window==="object"?window:globalThis);
