import Callout from 'nextra-theme-docs/callout'

# transactionReceiptPass

This function is not required to be implemented by the app developer for internal use by Shardus. It will generate appData metadata for the applied transaction. It takes in 2 parameters:

- `timestampedTx` - the timestamped transaction
- `wrappedStates` - The object generated from the keys sent in from the `crack` function (a wrapped version of all the account states)
- `applyResponse` - The response object generated from the `apply` function

<Callout emoji="💡" type="default">

The example below shows an example implementation.

</Callout>

```javascript
transactionReceiptPass(timestampedTx: any, wrappedStates: { [id: string]: WrappedAccount }, applyResponse: ShardusTypes.ApplyResponse) {
    let { tx } = timestampedTx
    let txId: string
    if (!tx.sign) {
      txId = crypto.hashObj(tx)
    } else {
      txId = crypto.hashObj(tx, true) // compute from tx
    }
    if(transactions[tx.type].transactionReceiptPass) transactions[tx.type].transactionReceiptPass(tx, txId, wrappedStates, dapp, applyResponse)

  }
```