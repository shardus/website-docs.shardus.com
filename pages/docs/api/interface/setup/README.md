# setup

Shardus requires you to implement all the necessary SDK functions to be setup with your specific dapp. By using the `setup` function exposed by shardus, you can configure how you validate and mutate the state of your application. The following methods `(denoted by an asterisk)` are required to be passed into `shardus.setup`.

---

`* = required`

* [apply](./apply)*
* [calculateAccountHash](./calculateAccountHash)*
* [canDebugDropTx](./canDebugDropTx)
* [close](./close)*
* [deleteAccountData](./deleteAccountData)*
* [getAccountData](./getAccountData)*
* [getAccountDataByList](./getAccountDataByList)*
* [getAccountDataByRange](./getAccountDataByRange)*
* [getAccountDebugValue](./getAccountDebugValue)
* [getKeyFromTransaction](./getKeyFromTransaction)*
* [getRelevantData](./getRelevantData)*
* [resetAccountData](./resetAccountData)*
* [setAccountData](./setAccountData)*
* [sync](./sync)
* [updateAccountFull](./updateAccountFull)*
* [updateAccountPartial](./updateAccountPartial)*
* [validateTxnFields](./validateTxnFields)*

---
