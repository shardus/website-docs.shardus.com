# setup

Shardus requires you to implement all the necessary SDK functions to be set up with your specific dApp. By using the `setup` function exposed by Shardus, you can configure how you validate and mutate the state of your application. The following methods (required if denoted by an asterisk) can be passed into `shardus.setup`.

---

`* = required`

* [apply](./apply)*
* [calculateAccountHash](./calculateAccountHash)*
* [canDebugDropTx](./canDebugDropTx)
* [close](./close)*
* [crack](./crack)*
* [dataSummaryInit](./dataSummaryInit)
* [dataSummaryUpdate](./dataSummaryUpdate)
* [deleteAccountData](./deleteAccountData)*
* [deleteLocalAccountData](./deleteLocalAccountData)*
* [getAccountData](./getAccountData)*
* [getAccountDataByList](./getAccountDataByList)*
* [getAccountDataByRange](./getAccountDataByRange)*
* [getAccountDebugValue](./getAccountDebugValue)
* [getAccountTimestamp](./getAccountTimestamp)
* [getJoinData](./getJoinData)
* `getKeyFromTransaction` (deprecated - please use `crack()` instead)
* [getRelevantData](./getRelevantData)*
* [getStateID](./getStateID)
* [getTimestampAndHashFromAccount](./getTimestampAndHashFromAccount)
* [getTimestampfromTransaction](./getTimestampfromTransaction)*
* [resetAccountData](./resetAccountData)*
* [setAccountData](./setAccountData)*
* [sync](./sync)
* [txPreCrackData](./txPreCrackData)
* [txSummaryUpdate](./txSummaryUpdate)
* [transactionReceiptFail](./transactionReceiptFail)
* [transactionReceiptPass](./transactionReceiptPass)
* [updateAccountFull](./updateAccountFull)*
* [updateAccountPartial](./updateAccountPartial)*
* [validate](./validate)*
* [validateJoinRequest](./validateJoinRequest)
* `validateTxnFields` (deprecated - please use `validate()` instead)

---
