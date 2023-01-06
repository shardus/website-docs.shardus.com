# List of Shardus-Application Interface Functions

### Functions Provided by Shardus

    - [applyResponseAddChangedAccount](https://docs.shardus.com/docs/api/interface/applyResponseAddChangedAccount)
    - [applyResponseAddReceiptData](https://docs.shardus.com/docs/api/interface/applyResponseAddReceiptData)
    - [applyResponseAddState](https://docs.shardus.com/docs/api/interface/applyResponseAddState)
    - [applyResponseSetFailed](https://docs.shardus.com/docs/api/interface/applyResponseSetFailed)
    - [constructor](https://docs.shardus.com/docs/api/interface/constructor)
    - [createApplyResponse](https://docs.shardus.com/docs/api/interface/createApplyResponse)
    - [createWrappedResponse](https://docs.shardus.com/docs/api/interface/createWrappedResponse)
    - [debugCommitAccountCopies](https://docs.shardus.com/docs/api/interface/debugCommitAccountCopies)
    - [forwardAccounts](https://docs.shardus.com/docs/api/interface/forwardAccounts)
    - [genericApplyPartialUpdate](https://docs.shardus.com/docs/api/interface/genericApplyPartialUpdate)
    - [getClosestNodes](https://docs.shardus.com/docs/api/interface/getClosestNodes)
    - [getClosestNodesGlobal](https://docs.shardus.com/docs/api/interface/getClosestNodesGlobal)
    - [getConsenusGroupForAccount](https://docs.shardus.com/docs/api/interface/getConsenusGroupForAccount)
    - [getCycleMarker](https://docs.shardus.com/docs/api/interface/getCycleMarker)
    - [getDebugModeMiddleware](https://docs.shardus.com/docs/api/interface/getDebugModeMiddleware)
    - [getDevPublicKey](https://docs.shardus.com/docs/api/interface/getDevPublicKey)
    - [getLatestCycles](https://docs.shardus.com/docs/api/interface/getLatestCycles)
    - [getLocalOrRemoteAccount](https://docs.shardus.com/docs/api/interface/getLocalOrRemoteAccount)
    - [getLocalOrRemoteAccountQueueCount](https://docs.shardus.com/docs/api/interface/getLocalOrRemoteAccountQueueCount)
    - [getLocalOrRemoteCachedAppData](https://docs.shardus.com/docs/api/interface/getLocalOrRemoteCachedAppData)
    - [getLogFlags](https://docs.shardus.com/docs/api/interface/getLogFlags)
    - [getNode](https://docs.shardus.com/docs/api/interface/getNode)
    - [getNodeId](https://docs.shardus.com/docs/api/interface/getNodeId)
    - [getRandomConsensusNodeForAccount](https://docs.shardus.com/docs/api/interface/getRandomConsensusNodeForAccount)
    - [getRemoteAccount](https://docs.shardus.com/docs/api/interface/getRemoteAccount)
    - [isAccountRemote](https://docs.shardus.com/docs/api/interface/isAccountRemote)
    - [isActive](https://docs.shardus.com/docs/api/interface/isActive)
    - [isFirstSeed](https://docs.shardus.com/docs/api/interface/isFirstSeed)
    - [isNodeInDistance](https://docs.shardus.com/docs/api/interface/isNodeInDistance)
    - [log](https://docs.shardus.com/docs/api/interface/log)
    - [monitorEvent](https://docs.shardus.com/docs/api/interface/monitorEvent)
    - [on](https://docs.shardus.com/docs/api/interface/on)
    - [patchObject](https://docs.shardus.com/docs/api/interface/patchObject)
    - [put](https://docs.shardus.com/docs/api/interface/put)
    - [registerCacheTopic](https://docs.shardus.com/docs/api/interface/registerCacheTopic)
    - [registerExceptionHandler](https://docs.shardus.com/docs/api/interface/registerExceptionHandler)
    - [registerExternalGet](https://docs.shardus.com/docs/api/interface/registerExternalGet)
    - [registerExternalPost](https://docs.shardus.com/docs/api/interface/registerExternalPost)
    - [resetAppRelatedState](https://docs.shardus.com/docs/api/interface/resetAppRelatedState)
    - [sendCorrespondingCachedAppData](https://docs.shardus.com/docs/api/interface/sendCorrespondingCachedAppData)
    - [set](https://docs.shardus.com/docs/api/interface/set)
    - [setGlobal](https://docs.shardus.com/docs/api/interface/setGlobal)
    - [setPartialData](https://docs.shardus.com/docs/api/interface/setPartialData)
    - [shardus_fatal](https://docs.shardus.com/docs/api/interface/shardus_fatal)
    - [shutdown](https://docs.shardus.com/docs/api/interface/shutdown)
    - [signAsNode](https://docs.shardus.com/docs/api/interface/signAsNode)
    - [start](https://docs.shardus.com/docs/api/interface/start)
    - [syncAppData](https://docs.shardus.com/docs/api/interface/syncAppData)
    - [tryInvolveAccount](https://docs.shardus.com/docs/api/interface/tryInvolveAccount)
    - [updateConfigChangeQueue](https://docs.shardus.com/docs/api/interface/updateConfigChangeQueue)
    - [useAccountWrites](https://docs.shardus.com/docs/api/interface/useAccountWrites)

### Functions Implemented by the Application

***NOTE***: An asterisk (*) denotes that a function is required to be implemented


    - [apply](https://docs.shardus.com/docs/api/interface/setup/apply)*
    - [calculateAccountHash](https://docs.shardus.com/docs/api/interface/setup/calculateAccountHash)*
    - [canDebugDropTx](https://docs.shardus.com/docs/api/interface/setup/canDebugDropTx)
    - [close](https://docs.shardus.com/docs/api/interface/setup/close)*
    - [crack](https://docs.shardus.com/docs/api/interface/setup/crack)*
    - [dataSummaryInit](https://docs.shardus.com/docs/api/interface/setup/dataSummaryInit)
    - [dataSummaryUpdate](https://docs.shardus.com/docs/api/interface/setup/dataSummaryUpdate)
    - [deleteAccountData](https://docs.shardus.com/docs/api/interface/setup/deleteAccountData)*
    - [deleteLocalAccountData](https://docs.shardus.com/docs/api/interface/setup/deleteLocalAccountData)*
    - [getAccountData](https://docs.shardus.com/docs/api/interface/setup/getAccountData)*
    - [getAccountDataByList](https://docs.shardus.com/docs/api/interface/setup/getAccountDataByList)*
    - [getAccountDataByRange](https://docs.shardus.com/docs/api/interface/setup/getAccountDataByRange)*
    - [getAccountDebugValue](https://docs.shardus.com/docs/api/interface/setup/getAccountDebugValue)
    - [getAccountTimestamp](https://docs.shardus.com/docs/api/interface/setup/getAccountTimestamp)
    - [getJoinData](https://docs.shardus.com/docs/api/interface/setup/getJoinData)
    - [getRelevantData](https://docs.shardus.com/docs/api/interface/setup/getRelevantData)*
    - [getStateID](https://docs.shardus.com/docs/api/interface/setup/getStateID)
    - [getTimestampAndHashFromAccount](https://docs.shardus.com/docs/api/interface/setup/getTimestampAndHashFromAccount)
    - [getTimestampfromTransaction](https://docs.shardus.com/docs/api/interface/setup/getTimestampfromTransaction)*
    - [resetAccountData](https://docs.shardus.com/docs/api/interface/setup/resetAccountData)*
    - [setAccountData](https://docs.shardus.com/docs/api/interface/setup/setAccountData)*
    - [sync](https://docs.shardus.com/docs/api/interface/setup/sync)
    - [txPreCrackData](https://docs.shardus.com/docs/api/interface/setup/txPreCrackData)
    - [txSummaryUpdate](https://docs.shardus.com/docs/api/interface/setup/txSummaryUpdate)
    - [transactionReceiptFail](https://docs.shardus.com/docs/api/interface/setup/transactionReceiptFail)
    - [transactionReceiptPass](https://docs.shardus.com/docs/api/interface/setup/transactionReceiptPass)
    - [updateAccountFull](https://docs.shardus.com/docs/api/interface/setup/updateAccountFull)*
    - [updateAccountPartial](https://docs.shardus.com/docs/api/interface/setup/updateAccountPartial)*
    - [validate](https://docs.shardus.com/docs/api/interface/setup/validate)*
    - [validateJoinRequest](https://docs.shardus.com/docs/api/interface/setup/validateJoinRequest)
