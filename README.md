# THE SHIELD — Public Michigan FOIA Desk Pilot

This repository powers [THE SHIELD's public website](https://the-shield-public-preview.onrender.com/) and [FOIA Desk](https://the-shield-public-preview.onrender.com/desk.html).

## Tester links — use the deployed Render host

- **Public test site:** https://the-shield-public-preview.onrender.com/
- **Free FOIA Desk:** https://the-shield-public-preview.onrender.com/desk.html
- **No-login feedback:** https://the-shield-public-preview.onrender.com/feedback.html

**Do not distribute `https://theshield0172.github.io/the-shield-website/` as a test link.** That GitHub Pages URL is not the documented deployment. Before inviting testers, open the live Render URLs in a private browser window and confirm they respond; a repository link or successful source commit alone does not establish deployment availability. The free Render host may need to wake from inactivity. Only fictional/nonconfidential test inputs are permitted.

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

## Customer policy documents (prelaunch only)

The public [Policy Center](https://the-shield-public-preview.onrender.com/legal.html) links to:
- [Proposed Subscription, Renewal & Cancellation Policy](https://the-shield-public-preview.onrender.com/subscriptions.html)
- [Proposed Refund & Payment Correction Policy](https://the-shield-public-preview.onrender.com/refunds.html)
- [Proposed Terms of Use](https://the-shield-public-preview.onrender.com/terms.html)
- [Acceptable Use and Legal Disclaimer](https://the-shield-public-preview.onrender.com/use-policy.html)
- [Current Free-Pilot Privacy Notice](https://the-shield-public-preview.onrender.com/privacy.html)

These pages are **not active paid customer contracts** and have not been independently cleared by legal counsel. No merchant identity, verified private support or cancellation channel, account service, paid processing, or independently reviewed evidence vault is yet in place. Until all are implemented and reviewed, **never enable live checkout or imply purchase rights exist**.

## No-login suggestion form — live and owner-confirmed delivery

The mobile-friendly [Feedback page](https://the-shield-public-preview.onrender.com/feedback.html) accepts brief general feature suggestions without a GitHub account, required name/email, payment or file uploads. The owner supplied the public endpoint `https://formspree.io/f/mdegepdb` on November 16, 2026, and it is configured in `feedback-config.js`. This identifier is not a secret; never commit the recipient's private address, password or API key.

**Delivery acceptance checklist:**
- [x] Build responsive form, privacy notice, consent acknowledgment and anti-spam honeypot
- [x] Configure exact owner-provided Formspree HTTPS endpoint
- [x] Test anonymous submission behavior in Chrome using mocked successful and failed Formspree responses
- [x] Submit one **fictional test** suggestion to the real endpoint after public deployment; owner reported successful delivery on November 16, 2026
- [x] Owner confirmed receipt in the Outlook receiving inbox on November 16, 2026
- [x] Confirm Formspree email delivery works for a real fictional form submission (recipient confirmation)
- [ ] Confirm the no-cost Formspree allowance remains sufficient; do not upgrade without permission

**Security and retention:** Only explicit user-initiated submissions contact Formspree. The static website does not itself persist or email feedback. Formspree handles responses and technical anti-spam metadata under its privacy policy. Never submit actual employment disputes, protected records, passwords, court evidence, or agency data. The free service's limits and archive-retention schedule can change and should be reviewed periodically.

**Demand assessment:** Group responses by features and willingness to test; exclude internal test messages. Anonymous submissions are suggestions, not unique verified customers or purchases. The November 25 demand review should consider responses if recipient access is available.

## Source visibility and permissions

**This repository is publicly readable but has no open-source license.** Its publication is not permission to freely reuse, resell, distribute or create derivatives of any protectable source material. GitHub's Terms allow users to view and fork public repositories; copyright exceptions and ownership of particular human-authored or AI-assisted contributions may vary. The underlying idea and general features are not protected simply because they appear in this repository.

The public website, Michigan FOIA pilot and blank starter kit are free to access and use as provided. No commercial software rights or rights to THE SHIELD brand are granted by this README. Brand availability and any trademark rights have not been legally cleared.

**Security/release boundary:** Never commit credentials, private operational plans, identifiable case records, regulated data or proprietary future features to this repository. The review-only `security-vault-lab` branch is also public. Future confidential product development should move to a separately controlled private repository; switching repositories does not undo prior public disclosures. The vault remains forbidden for real sensitive data pending independent review.

## Deployment
Render static site from GitHub `main`, publish path `./`, build command `echo 'Static preview: no build required'`. The HTML includes restrictive CSP meta tags. **Meta CSP does not substitute for HTTP security headers** such as frame-ancestors; validate and configure host response headers before handling sensitive data.

## Sources
Michigan FOIA: [MCL 15.233](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-233), [15.235](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-235), [15.240](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-240), [15.240a](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-240a).

Version: functional pilot, 2026-11-11.
