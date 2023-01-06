# applyResponseAddReceiptData

`applyResponseAddReceiptData` is used internally by Shardus to set the appReceiptData and appReceiptDataHash fields in the resultObject. The function takes in three parameters:

- `resultObject` - a `ShardusTypes.ApplyResponse` object generated from the `apply` function.
- `appReceiptData` - 
- `appReceiptDataHash` - 


```ts
applyResponseAddReceiptData(
    resultObject: ShardusTypes.ApplyResponse,
    appReceiptData: any,
    appReceiptDataHash: string
  ) {
    resultObject.appReceiptData = appReceiptData
    resultObject.appReceiptDataHash = appReceiptDataHash
  }
```