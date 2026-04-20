---
'@1001-digital/resolve-metadata': patch
---

Delegate URI normalization to `@1001-digital/normalize-dweb-url`. `normalizeUri` and `isResolvableUri` are now re-exported from that package, and gain handling for embedded gateway URIs like `ipfs://https://gateway.../ipfs/<cid>`.
