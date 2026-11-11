# THE SHIELD — Case Vault Security Review Candidate

**Status: DEVELOPMENT TEST LAB ONLY. NO REAL EVIDENCE.**

**Date:** 2026-11-11  
**Review owner:** External qualified application security tester required. No external audit has been commissioned or completed.

## Scope and trust boundaries

This candidate is a static web application with no user account, server database, third-party SDK, analytics, automatic cloud sync, API access, AI endpoint, or Stripe checkout. The browser performs all cryptographic operations. It stores *encrypted* JSON envelopes in the local browser's IndexedDB (origin-scoped). Only the passphrase holder can usually decrypt the pack, subject to limitations below. Encrypted `.shieldvault` downloads can be copied into a chosen Google Drive, OneDrive, Dropbox, or iCloud Drive folder **manually**.

It is expressly **not** for: litigation documents, law enforcement databases, CJIS information, internal confidential personnel records, attorney-client privileged material, protected health information, evidence with chain-of-custody requirements, classified or military-controlled records, or records subject to employer possession/retention rules.

## Implemented controls

1. **At-rest encryption:** Web Crypto AES-256-GCM with fresh random 96-bit IV on every save; 128-bit authentication tag. Encryption keys derived using PBKDF2-HMAC-SHA256, fixed 650,000 iterations, random 128-bit salt, and a 16-character minimum passphrase. Cryptographic metadata and revision counter are bound to ciphertext by AES-GCM AAD. No plaintext note, attachment bytes, passphrase, or derived `CryptoKey` is intentionally written to IndexedDB, a server, or localStorage. The derived key is nonextractable.
2. **Multi-tab conflicts:** IndexedDB readwrite transactions atomically compare the current stored revision before writing. If another tab saved first, the stale tab refuses to write and locks. This prevents normal accidental lost updates but not malicious local database manipulation.
3. **User-owned encrypted backups:** `.shieldvault` export; backup import requires passphrase-based *authenticated decryption before replacing any stored data*. Explicit confirmation is required to replace a pack; backup restoration advances the local revision. Delete requires typing `DELETE` and affects only the local browser's copy.
4. **Attachment control:** only small test `.pdf`, `.txt`, `.eml`, `.png`, `.jpg/.jpeg` files (max 2 MiB each / 6 MiB total), with basic magic-header checks for PDF/PNG/JPEG. Files are handled as opaque bytes and are never previewed or executed. SHA-256 fingerprints are verified when opening a pack and when downloading a sample attachment.
5. **XSS minimization:** output uses `textContent`, not `innerHTML`. No dynamic script insertion, external JS/CSS, analytics, network APIs, frame elements, or HTML rendering of untrusted text. Restrictive CSP `<meta>` is included. All public-page event listeners are in local scripts.
6. **Session exposure:** key and decrypted state are held in tab memory only. The vault auto-locks after five minutes' inactivity and when the document is hidden or the page unloads. This does not guarantee wiping JavaScript/browser memory or defeating an active compromised device.
7. **Version and input validation:** strict encryption version, KDF iteration count, IV/salt length, pack size, schema, file counts and hashes checked before accepting stored data.

## Important security limitations and threat scenarios

- **This is NOT zero-knowledge production assurance.** The operator controlling the origin can change future JavaScript code delivered to a browser. Malicious or compromised deployment scripts, malicious browser extensions, and compromised devices could access plaintext or the key while unlocked. A CSP is defense-in-depth, not a guarantee.
- **Browser storage can vanish.** Users can clear it, browsers can evict data, devices can fail, private browsing may discard it, and browser upgrades can disrupt storage. Encrypted backups must be exported manually and tested on another device. No recovery service is implemented; a lost passphrase means permanently lost plaintext.
- **Not an evidentiary chain of custody.** The SHA-256 fingerprints and local history detect some alterations, but they do not independently establish origin, authenticity, creator identity, trusted timestamps, complete retention, or legal admissibility. Anyone with passphrase and enough technical skill can construct a wholly new valid pack. A hash is not a digital signature or court certification.
- **Not proven to prevent concurrency loss in every environment.** The transaction design should be tested under real simultaneous-tab behavior in Chromium, Firefox, Safari iOS and Safari desktop before approval. Long-running encryption and mobile page suspension need dedicated failure-mode tests.
- **Browser/DOM memory:** form fields, strings, downloaded files, browser clipboard, print spools, and in-memory decrypted objects can remain exposed outside encrypted IndexedDB. JavaScript memory cannot be reliably erased. Avoid shared computers.
- **Cloud uploads are manual.** No OAuth integration with iCloud Drive, Google Drive, Dropbox, or OneDrive; any cloud provider may read filenames, size, location and transfer metadata, even if the encrypted package contents are inaccessible.
- **No remote authentication, identity, enterprise policies, enterprise retention, audit-log notarization, malware scanning, file provenance, legal hold, deletion propagation, or access grants.**
- **No penetration testing, external code review or legal validation.** Security code and checks cannot substitute for independent review.

## Release gates — must all pass before production evidence handling

- [ ] Commission independent penetration test and code review from qualified third party and remediate all critical/high findings; publish scope, date and remediation status.
- [ ] Threat model and design review including supply chain compromise, same-origin scripts, rollback and storage tampering, concurrent writes, backup theft, browser extension risk, malicious file inputs, XSS, cross-site scripting, CSP and client-side key handling.
- [ ] Deploy on a **dedicated production origin**, separate from marketing/demo pages; configure and verify HTTP response security headers including a real `Content-Security-Policy` with `frame-ancestors`, `Strict-Transport-Security`, `X-Content-Type-Options` and `Referrer-Policy`.
- [ ] Run integration tests in current Chrome, Firefox, Safari desktop, Safari iOS, and Android Chrome: new/create/unlock/lock, multi-tab conflict, suspend/resume, storage quota, intentional clear, import/export and corruption recovery.
- [ ] Validate backup and restore on at least two different devices, plus disaster recovery and data loss simulations.
- [ ] Formalize account security, provider access, passphrase and recovery policy, consent, retention/deletion, incident response and audit logging before a multi-user subscription service launches.
- [ ] Lawyer reviews policies for relevant personnel records, FOIA, employment-related legal advice disclaimers, and state-by-state requirements.
- [ ] Compliance review for any protected agency information, CJIS-controlled data or other regulated records; this lab does not grant permission to store such materials.
- [ ] Test billing using Stripe test mode, verified webhooks and entitlement control, tax, consumer cancellation and privacy terms before enabling live subscription prices.

## Tests run by the developer

`node --test tests/crypto.test.cjs` (5 passing unit tests): authenticated encryption and key/IV behavior; wrong-password rejection; AAD tamper rejection; malformed metadata rejection; attachment roundtrip; fingerprint mismatch detection; unsupported/mislabeled file rejection.

`python tests/test_static.py` (passed): HTML ID bindings, strict inline CSP presence, script source restrictions, dangerous API scan, visible warnings. `node --check shield-crypto.js` and `node --check vault.js` pass.

**Not tested successfully in this environment:** end-to-end browser interactions, mobile Safari/Android, load testing, stress testing, real concurrent browser tabs, third-party penetration testing. Browser navigation to local pages was blocked by the execution environment's administrator policy. The tests prove limited behaviors, not general security.

## Supporting primary references

- [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [MDN Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)