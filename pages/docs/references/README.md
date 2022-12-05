# List of Shardus-Application Interface Functions

### Functions Provided by Shardus

    - **Documented**

        - [setup](https://docs.shardus.com/docs/api/interface/setup/README)
        - [applyResponseAddState](https://docs.shardus.com/docs/api/interface/applyResponseAddState)
        - [constructor](https://docs.shardus.com/docs/api/interface/constructor)
        - [createApplyResponse](https://docs.shardus.com/docs/api/interface/createApplyResponse)
        - [getLocalOrRemoteAccount](https://docs.shardus.com/docs/api/interface/getLocalOrRemoteAccount)
        - [put](https://docs.shardus.com/docs/api/interface/put)
        - [registerExceptionHandler](https://docs.shardus.com/docs/api/interface/registerExceptionHandler)
        - [registerExternalGet](https://docs.shardus.com/docs/api/interface/registerExternalGet)
        - [registerExternalPost](https://docs.shardus.com/docs/api/interface/registerExternalPost)
        - [start](https://docs.shardus.com/docs/api/interface/start)
        - [getClosestNodes](https://docs.shardus.com/docs/api/interface/getClosestNodes)
        - [getLatestCycles](https://docs.shardus.com/docs/api/interface/getLatestCycles)
        - [getNode](https://docs.shardus.com/docs/api/interface/getNode)
        - [getNodeId](https://docs.shardus.com/docs/api/interface/getNodeId)
        - [getRemoteAccount](https://docs.shardus.com/docs/api/interface/getRemoteAccount)
        - [isFirstSeed](https://docs.shardus.com/docs/api/interface/isFirstSeed)
        - [log](https://docs.shardus.com/docs/api/interface/log)
        - [on](https://docs.shardus.com/docs/api/interface/on)
        - [set](https://docs.shardus.com/docs/api/interface/set)

    - **Undocumented**

        - applyResponseSetFailed
        - applyResponseAddReceiptData
        - applyResponseAddChangedAccount
        - syncAppData
        - getLogFlags
        - getCycleMarker
        - useAccountWrites
        - signAsNode
        - resetAppRelatedState
        - getLocalOrRemoteAccountQueueCount
        - getClosestNodesGlobal
        - isNodeInDistance
        - tryInvolveAccount
        - getConsenusGroupForAccount
        - getRandomConsensusNodeForAccount
        - isAccountRemote
        - createWrappedResponse
        - setPartialData
        - genericApplyPartialUpate
        - debugCommitAccountCopies
        - forwardAccounts
        - getDevPublicKey
        - isActive
        - shutdown
        - updateConfigChangeQueue

### Functions Implemented by the Application

***NOTE***: An asterisk (*) denotes that a function is required to be implemented

    - **Documented**
        - [apply](https://docs.shardus.com/docs/api/interface/setup/apply)*
        - `validateTxnFields` (deprecated - please use `validate()` instead)
        - [validate](https://docs.shardus.com/docs/api/interface/setup/validate)*
        - [calculateAccountHash](https://docs.shardus.com/docs/api/interface/setup/calculateAccountHash)*
        - [close](https://docs.shardus.com/docs/api/interface/setup/close)*
        - [deleteAccountData](https://docs.shardus.com/docs/api/interface/setup/deleteAccountData)*
        - [getAccountData](https://docs.shardus.com/docs/api/interface/setup/getAccountData)*
        - [getAccountDataByList](https://docs.shardus.com/docs/api/interface/setup/getAccountDataByList)*
        - [getAccountDataByRange](https://docs.shardus.com/docs/api/interface/setup/getAccountDataByRange)*
        - [getAccountDebugValue](https://docs.shardus.com/docs/api/interface/setup/getAccountDebugValue)
        - `getKeyFromTransaction` (deprecated - please use `crack()` instead)
        - [crack](https://docs.shardus.com/docs/api/interface/setup/crack)*
        - [getRelevantData](https://docs.shardus.com/docs/api/interface/setup/getRelevantData)*
        - [resetAccountData](https://docs.shardus.com/docs/api/interface/setup/resetAccountData)*
        - [setAccountData](https://docs.shardus.com/docs/api/interface/setup/setAccountData)*
        - [sync](https://docs.shardus.com/docs/api/interface/setup/sync)
        - [updateAccountFull](https://docs.shardus.com/docs/api/interface/setup/updateAccountFull)*
        - [updateAccountPartial](https://docs.shardus.com/docs/api/interface/setup/updateAccountPartial)*

    - Undocumented
        - getTimestampfromTransaction*
        - deleteLocalAccountData*
        - txPreCrackData
        - transactionReceiptPass
        - transactionReceiptFail
        - getStateID
        - dataSummaryInit
        - dataSummaryUpdate
        - txSummaryUpdate
        - getAccountTimestamp
        - getTimestampAndHashFromAccount
        - validateJoinRequest
        - getJoinData