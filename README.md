# Triton Dashboard

Public real-time dashboard for [Triton](https://github.com/gitterdel/triton), the autonomous BSC trading agent built for BNB HACK 2026.

**Live:** https://triton-dashboard.vercel.app

## How it works

```
[Triton agent (local)] ──POST /api/ingest (bearer token)──> [Vercel Blob] <──GET /api/state── [public page]
```

- `api/ingest.js` — authenticated endpoint; the agent pushes its full state (decisions with reasoning, portfolio, equity curve) after every tick
- `api/state.js` — public read endpoint
- `public/index.html` — zero-dependency terminal-style UI, refreshes every 5s

Deployed on Vercel with Blob storage. Env vars: `TRITON_INGEST_TOKEN` (write auth), `BLOB_READ_WRITE_TOKEN` (auto-set by the Blob store link).
