# applyResponseAddChangedAccount

`applyResponseAddChangedAccount` is used internally by Shardus to set the appReceiptData and appReceiptDataHash fields in the resultObject. The function takes in five parameters:

- `resultObject` - a `ShardusTypes.ApplyResponse` object generated from the `apply` function.
- `accountId` - the account ID
- `account` - a ShardusTypes.WrappedResponse object
- `txId` -  the transaction ID
- `txTimestamp` -  the transaction timestamp


```ts
applyResponseAddChangedAccount(
    resultObject: ShardusTypes.ApplyResponse,
    accountId: string,
    account: ShardusTypes.WrappedResponse,
    txId: string,
    txTimestamp: number
  ) {
    resultObject.accountWrites.push({
      accountId,
      data: account,
      txId,
      timestamp: txTimestamp,
    })
  }
```