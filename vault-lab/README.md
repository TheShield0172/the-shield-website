# THE SHIELD — Encrypted Case Vault Test Lab

A functional, local-first **security-review candidate** for fictional employee documentation workflows. **Not approved for storing real evidence.**

## Run locally

The code is ordinary HTML, CSS and JavaScript. Serve the directory through a local development HTTP server:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080` in a modern browser. You can also deploy the directory to a **dedicated origin** for test-only use; never share an origin with sensitive production apps. Safari mobile limitations may apply.

## Use only fictional test data

1. Create a unique 16+ character test passphrase. Do **not** reuse a real password.
2. Create a fictional case, add sample notes/FOIA tracker entries and small fictional attachments.
3. Use **Download encrypted backup** to save a `.shieldvault` file to an independently controlled folder, including a cloud-synced folder if desired.
4. Try locking/unlocking, deliberate wrong passphrase rejection, backup restoration after export, cross-tab collision tests, and manual local deletion.
5. If you want to report a bug, report *reproduction steps with fictional data only*. Do not send encrypted or plaintext personal records to a public issue tracker.

## Architecture at a glance

- `index.html` — UI and warnings
- `vault.css` — responsive desktop/mobile styles
- `shield-crypto.js` — auditable Web Crypto encryption/schema/file code (no dependencies)
- `vault.js` — browser IndexedDB, concurrency control, encrypted operations, case/tracker workflow
- `tests/crypto.test.cjs` — Node 22+ cryptography tests
- `tests/test_static.py` — HTML/CSP/source/static checks (requires `beautifulsoup4`)
- `SECURITY_REVIEW.md` — threat model, limitations, and required independent review gates

## Operational limitations

The vault keeps encrypted data in the browser's IndexedDB and key/plaintext in memory only while unlocked; it has no server backend. Browser data is not guaranteed to survive, and backups are manual. **An encrypted pack is not an independently authenticated evidence chain or a substitute for existing legal retention obligations.** A qualified third-party audit must happen before anyone stores sensitive materials.