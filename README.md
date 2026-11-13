# THE SHIELD — Public Michigan FOIA Desk Pilot

This repository powers [THE SHIELD's public website](https://the-shield-public-preview.onrender.com/) and [FOIA Desk](https://the-shield-public-preview.onrender.com/desk.html).

## What is actually released
- Free, browser-only Michigan FOIA request, disclosure-denial appeal, fee-dispute and follow-up drafting.
- Copy, edit, print and download a letter. No automatic filing.
- Optional encrypted *test-only* browser workspace (PBKDF2-SHA256 + AES-GCM, IndexedDB, browser-held key, encrypted export/restore).
- Fictional case demo and educational source links.

## What is **NOT** released
- No production evidence repository, cloud syncing, AI document ingestion, login, payment checkout or legal advice.
- No security audit, CJIS certification, attorney review of every output, or forensic preservation guarantee.
- **Do not enter actual confidential evidence, privileged material, sensitive personnel records, or CJIS information into the encrypted test workspace.**

## Privacy
No analytics SDKs, external AI endpoints, or outbound application API calls are in the FOIA Desk source. Draft form values remain in the browser. Browser download and copy actions produce unencrypted text. The host may log ordinary website access metadata. See [privacy notice](https://the-shield-public-preview.onrender.com/privacy.html).

## Release controls
Do not enable Stripe checkout or public real-evidence uploads without: independent security assessment, complete terms and privacy policy, lawyer-validated legal content and deadlines, authenticated data access controls, disaster recovery and restore tests, incident response, and tax/consumer-subscription compliance review.

## Source visibility and permissions

**This repository is publicly readable but has no open-source license.** Its publication is not permission to freely reuse, resell, distribute or create derivatives of any protectable source material. GitHub's Terms allow users to view and fork public repositories; copyright exceptions and ownership of particular human-authored or AI-assisted contributions may vary. The underlying idea and general features are not protected simply because they appear in this repository.

The public website, Michigan FOIA pilot and blank starter kit are free to access and use as provided. No commercial software rights or rights to THE SHIELD brand are granted by this README. Brand availability and any trademark rights have not been legally cleared.

**Security/release boundary:** Never commit credentials, private operational plans, identifiable case records, regulated data or proprietary future features to this repository. The review-only `security-vault-lab` branch is also public. Future confidential product development should move to a separately controlled private repository; switching repositories does not undo prior public disclosures. The vault remains forbidden for real sensitive data pending independent review.

## Deployment
Render static site from GitHub `main`, publish path `./`, build command `echo 'Static preview: no build required'`. The HTML includes restrictive CSP meta tags. **Meta CSP does not substitute for HTTP security headers** such as frame-ancestors; validate and configure host response headers before handling sensitive data.

## Sources
Michigan FOIA: [MCL 15.233](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-233), [15.235](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-235), [15.240](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-240), [15.240a](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-240a).

Version: functional pilot, 2026-11-11.
