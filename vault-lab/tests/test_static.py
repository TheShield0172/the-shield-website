from pathlib import Path
from bs4 import BeautifulSoup
import re
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
js=(root/'vault.js').read_text()
crypto=(root/'shield-crypto.js').read_text()
css=(root/'vault.css').read_text()
soup=BeautifulSoup(html,'html.parser')
assert soup.find('meta',{'http-equiv':'Content-Security-Policy'}) is not None
csp=soup.find('meta',{'http-equiv':'Content-Security-Policy'})['content']
for rule in ["default-src 'none'", "script-src 'self'", "connect-src 'none'", "form-action 'none'"]:
 assert rule in csp,rule
assert len(soup.select('script[src]'))==2
assert {s['src'] for s in soup.select('script[src]')}=={'shield-crypto.js','vault.js'}
assert not soup.select('[onclick], [onload], [onerror]')
assert not soup.select('iframe')
assert 'test' in soup.title.text.lower() or 'review' in soup.title.text.lower()
ids={tag['id'] for tag in soup.select('[id]')}
assert len(ids)==len(soup.select('[id]')),'Duplicate DOM IDs'
used=set(re.findall(r"\$\('([^']+)'\)",js))
assert not(used-ids), 'Unbound HTML IDs: '+str(sorted(used-ids))
for token in ['innerHTML','outerHTML','eval(', 'document.write','XMLHttpRequest','sendBeacon(', 'fetch(', 'localStorage.setItem']:
 assert token not in js+'\n'+crypto, f'Dangerous or unplanned browser API: {token}'
for token in ['test', 'independent', 'not', 'evidence']:
 assert token.lower() in soup.get_text().lower()
assert len(css)>1000
print('PASS: HTML IDs, external scripts, CSP, dangerous API scan, warnings and assets')
