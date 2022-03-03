# applyResponseAddState

`applyResponseAddState` is used internally by Shardus when applying the results from [updateAccountFull](./setup/updateAccountFull). This is what `applyResponseAddState` does internally within Shardus.

```ts
function applyResponseAddState(
    resultObject,
    accountData,
    localCache,
    accountId,
    txId,
    txTimestamp,
    stateBefore,
    stateAfter,
    accountCreated
) {
    const state = { accountId, txId, txTimestamp, stateBefore, stateAfter }
    if (accountCreated) {
        state.stateBefore = allZeroes64
    }
    resultObject.stateTableResults.push(state)
    resultObject.accountData.push({
        accountId,
        data: accountData,
        txId,
        timestamp: txTimestamp,
        hash: stateAfter,
        localCache,
    })
}
```
