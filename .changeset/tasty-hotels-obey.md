---
'@1001-digital/resolve-metadata': patch
---

Fix redundant path segments in protocol URIs (`ipfs://ipfs/…` → `ipfs://…`, `ipns://ipns/…` → `ipns://…`).
