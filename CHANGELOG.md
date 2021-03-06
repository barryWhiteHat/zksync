# zkSync changelog

### zksync.js 0.6.0 
- Upgrade ethers to ^5.0.0 

### zkSync

- Server: Robustness of the fee ticker's API interacting module was increased. [#786]
- Server: A possibility to get an Ethereum tx hash for withdrawal operation was added. [#751]
- Prover: Bug with delay between receiving a job and starting sending heartbeats was fixed. [7a82dba](https://github.com/matter-labs/zksync/commit/7a82dba)
- Server: Blocks that contain withdraw operations are sealed faster. [bab346b](https://github.com/matter-labs/zksync/commit/bab346b)
- Server: Added support for non-standard Ethereum signatures. [da0670e](https://github.com/matter-labs/zksync/commit/da0670e)
- Server: `eth_sender` module now can be disabled. [f9642e9](https://github.com/matter-labs/zksync/commit/f9642e9)
- Server: Transfer to zero address (0x00..00) is now forbidden in zkSync. [b3c72cd](https://github.com/matter-labs/zksync/commit/b3c72cd)
- Server: WebSocket server now uses more threads for handling incoming requests. [3a77363](https://github.com/matter-labs/zksync/commit/3a77363)

### zksync.js

- Support of WalletConnect was added. [16dd987](https://github.com/matter-labs/zksync/commit/16dd987)

### Explorer

- A link to the wallet was added to the explorer. [14424a6](https://github.com/matter-labs/zksync/commit/14424a6)
- Fixed bug with accessing non-existent blocks in explorer. [e8ca026](https://github.com/matter-labs/zksync/commit/e8ca026)

### Contracts v2 (20.07.2020)

- Added event denoting information about pending and completed withdrawals. [bb0d1bd](https://github.com/matter-labs/zksync/commit/bb0d1bd)
- Added support for tokens that aren't fully compatible with ERC20. [c088328](https://github.com/matter-labs/zksync/commit/c088328)
- Block revert interval is changed to 0 hours. [c088328](https://github.com/matter-labs/zksync/commit/c088328)
- Redundant priority request check is removed from contract upgrade logic. [c088328](https://github.com/matter-labs/zksync/commit/c088328)
- `PRIORITY_EXPRIRATION_PERIOD` is reduced to 3 days. [c12ab40](https://github.com/matter-labs/zksync/commit/c12ab40)
- `UPGRADE_NOTICE_PERIOD` is increased to 8 days. [c12ab40](https://github.com/matter-labs/zksync/commit/c12ab40)


## zkSync 1.0 (18.06.2020)

Changes prior to the 1.0 release are not presented in this changelog.
