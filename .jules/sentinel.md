## 2026-02-12 - [PII Leak in Status Endpoints]
**Vulnerability:** Newsletter subscription status API (`GET /api/newsletter/subscribe`) was returning the full user subscription object, including sensitive preferences like categories and frequency.
**Learning:** Publicly accessible "status check" endpoints (e.g., "is this user/email X?") often inadvertently return more data than necessary for the UI to function, leading to unintended information leakage.
**Prevention:** Always implement data minimization on status check endpoints. Return only the minimum boolean or enum state required by the client.
