# createApplyResponse

`createApplyResponse` is a function that needs to be called before applying any transaction. It is meant to be called within the [apply](./setup/apply) function of [setup](./setup). The function takes 2 parameters:

1. `txId` is a `string` representing the hash of the transaction to be applied
2. `timestamp` is a `number` representing the timestamp of the transaction.

```ts
let txId: string
if (!tx.sign) {
    txId = crypto.hashObj(tx)
} else {
    txId = crypto.hashObj(tx, true) // compute from tx
}
const applyResponse = dapp.createApplyResponse(txId, tx.timestamp)

/**
 * Logic for the transaction types in the apply function
 * ...
 * ...
 */

return applyResponse
```

`createApplyResponse` will be used to tell Shardus that the tx has been applied.
