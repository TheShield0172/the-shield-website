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

## Customer policy documents (prelaunch only)

The public [Policy Center](https://the-shield-public-preview.onrender.com/legal.html) links to:
- [Proposed Subscription, Renewal & Cancellation Policy](https://the-shield-public-preview.onrender.com/subscriptions.html)
- [Proposed Refund & Payment Correction Policy](https://the-shield-public-preview.onrender.com/refunds.html)
- [Proposed Terms of Use](https://the-shield-public-preview.onrender.com/terms.html)
- [Acceptable Use and Legal Disclaimer](https://the-shield-public-preview.onrender.com/use-policy.html)
- [Current Free-Pilot Privacy Notice](https://the-shield-public-preview.onrender.com/privacy.html)

These pages are **not active paid customer contracts** and have not been independently cleared by legal counsel. No merchant identity, verified private support or cancellation channel, account service, paid processing, or independently reviewed evidence vault is yet in place. Until all are implemented and reviewed, **never enable live checkout or imply purchase rights exist**.

## No-login suggestion form (awaiting free inbox connection)

The mobile-friendly [Feedback page](https://the-shield-public-preview.onrender.com/feedback.html) is designed for visitors to submit general feature suggestions without a GitHub login or required name/email. The **button is disabled by default** until a real, verified receiving form is configured, so visitors never see a false success screen.

**One-time $0 Formspree configuration required by the owner:**

1. Create a free Formspree account at https://formspree.io/ and verify the email address for a receiving inbox the owner controls. The free plan currently allows up to 50 submissions per month and keeps a 30-day archive; it is not unlimited.
2. Create a form named `THE SHIELD Suggestions`. Enable email delivery. When available, restrict submissions to `the-shield-public-preview.onrender.com`, use default spam controls, and do **not** enable file uploads, payments, webhooks or paid upgrades.
3. Copy only the **public endpoint** shown by Formspree, like `https://formspree.io/f/abcdefgh`. **Do not share an API key, personal email address, password or billing information.**
4. Place that endpoint between the quotes in `feedback-config.js` (`window.SHIELD_FEEDBACK_ENDPOINT = '...';`). The endpoint is a public form identifier, not a secret. The client only accepts an exact `https://formspree.io/f/<form_id>` endpoint.
5. Run `node --test tests/feedback.test.cjs`, deploy the public site, then send one fictional test suggestion. **Only call the form operational after a real submission was accepted and its notification arrived.**
6. Update the feedback setup and privacy notice from pending to active once delivery has been verified. Never claim unique testers or purchase intent from anonymous responses alone.

The website's security policy permits outbound requests only to Formspree from this client-side flow. Visitors' suggestions and optional email go to Formspree; THE SHIELD's static website does not store the response. Do not collect real case details, confidential employment information, evidence, financial data or other restricted records.

The user's scheduled demand review can inspect receiving-mailbox notifications after configuration. Note that Formspree's free form-submissions API is not available; email notifications are the practical free workflow.

## Source visibility and permissions

**This repository is publicly readable but has no open-source license.** Its publication is not permission to freely reuse, resell, distribute or create derivatives of any protectable source material. GitHub's Terms allow users to view and fork public repositories; copyright exceptions and ownership of particular human-authored or AI-assisted contributions may vary. The underlying idea and general features are not protected simply because they appear in this repository.

The public website, Michigan FOIA pilot and blank starter kit are free to access and use as provided. No commercial software rights or rights to THE SHIELD brand are granted by this README. Brand availability and any trademark rights have not been legally cleared.

**Security/release boundary:** Never commit credentials, private operational plans, identifiable case records, regulated data or proprietary future features to this repository. The review-only `security-vault-lab` branch is also public. Future confidential product development should move to a separately controlled private repository; switching repositories does not undo prior public disclosures. The vault remains forbidden for real sensitive data pending independent review.

## Deployment
Render static site from GitHub `main`, publish path `./`, build command `echo 'Static preview: no build required'`. The HTML includes restrictive CSP meta tags. **Meta CSP does not substitute for HTTP security headers** such as frame-ancestors; validate and configure host response headers before handling sensitive data.

## Sources
Michigan FOIA: [MCL 15.233](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-233), [15.235](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-235), [15.240](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-240), [15.240a](https://legislature.mi.gov/Laws/MCL?objectName=mcl-15-240a).

Version: functional pilot, 2026-11-11.
