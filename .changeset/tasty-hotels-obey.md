---
'@1001-digital/resolve-metadata': patch
---

Add `isResolvableUri` type guard and fix redundant path segments in protocol URIs (`ipfs://ipfs/…` → `ipfs://…`, `ipns://ipns/…` → `ipns://…`).
