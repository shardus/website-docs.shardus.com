import Callout from 'nextra-theme-docs/callout'

# Interface

The Shardus API provides you with a few essential methods required to configure a Shardus network. You can see the required methods here:

---

- [applyResponseAddState](./applyResponseAddState)
- [constructor](./constructor)
- [createApplyResponse](./createApplyResponse)
- [createWrappedResponse](./createWrappedResponse)
- [getLocalOrRemoteAccount](./getLocalOrRemoteAccount) (required for nontrivial dapps)
- [isFirstSeed](./isFirstSeed.md) (required for nontrivial dapps)
- [put](./put)
- [registerExceptionHandler](./registerExceptionHandler)
- [registerExternalGet](./registerExternalGet) (required if dapp doesn't provide its own http interface)
- [registerExternalPost](./registerExternalPost) (required if dapp doesn't provide its own http interface)
- [setup](./setup/README)
- [start](./start)

---

<Callout emoji="💡" type="default">

Although not required for a network to function, these functions can aid you when developing with more specific functionality in mind.

</Callout>

- [applyResponseAddChangedAccount](./applyResponseAddChangedAccount)
- [applyResponseAddReceiptData](./applyResponseAddReceiptData)
- [applyResponseSetFailed](./applyResponseSetFailed)
- [debugCommitAccountCopies](./debugCommitAccountCopies)
- [forwardAccounts](./forwardAccounts)
- [genericApplyPartialUpdate](./genericApplyPartialUpdate)
- [getClosestNodes](./getClosestNodes)
- [getClosestNodesGlobal](./getClosestNodesGlobal)
- [getConsenusGroupForAccount](./getConsenusGroupForAccount)
- [getCycleMarker](./getCycleMarker)
- [getDebugModeMiddleware](./getDebugModeMiddleware)
- [getDevPublicKey](./getDevPublicKey)
- [getLatestCycles](./getLatestCycles)
- [getLocalOrRemoteAccountQueueCount](./getLocalOrRemoteAccountQueueCount)
- [getLocalOrRemoteCachedAppData](./getLocalOrRemoteCachedAppData)
- [getLogFlags](./getLogFlags)
- [getNode](./getNode)
- [getNodeId](./getNodeId)
- [getRandomConsensusNodeForAccount](./getRandomConsensusNodeForAccount)
- [getRemoteAccount](./getRemoteAccount)
- [isAccountRemote](./isAccountRemote)
- [isActive](./isActive)
- [isNodeInDistance](./isNodeInDistance)
- [log](./log)
- [monitorEvent](./monitorEvent)
- [on](./on)
- [patchObject](./patchObject)
- [registerCacheTopic](./registerCacheTopic)
- [resetAppRelatedState](./resetAppRelatedState)
- [sendCorrespondingCachedAppData](./sendCorrespondingCachedAppData)
- [set](./set)
- [setGlobal](./setGlobal)
- [setPartialData](./setPartialData)
- [shardus_fatal](./shardus_fatal)
- [shutdown](./shutdown)
- [signAsNode](./signAsNode)
- [syncAppData](./syncAppData)
- [tryInvolveAccount](./tryInvolveAccount)
- [updateConfigChangeQueue](./updateConfigChangeQueue)
- [useAccountWrites](./useAccountWrites)

---
