# txSummaryUpdate

This function is not required to be implemented by the app developer for internal use by Shardus. It takes in 3 parameters:

- `blob` - a dapp definable object that is used to aggregate statistics in a sharded network
- `tx` - a transaction
- `wrappedStates` - The object generated from the keys sent in from the `crack` function (a wrapped version of all the account states)

<Callout emoji="💡" type="default">

The code below shows an example implementation.

</Callout>

```javascript
txSummaryUpdate(blob, tx, wrappedStates) {
    if (blob.initialized == null) {
      blob.initialized = true
      blob.txByType = {}
      blob.totalTx = 0
    }

    if (blob.txByType[tx.type] == null) {
      blob.txByType[tx.type] = 0
    }
    blob.txByType[tx.type]++
    blob.totalTx++
  }
```