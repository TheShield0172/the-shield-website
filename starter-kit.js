'use strict';
/* Print blank template only. No data collection, APIs or analytics. */
(() => {
  const button=document.getElementById('print-kit');
  if (!button) return;
  button.addEventListener('click',()=>window.print());
})();