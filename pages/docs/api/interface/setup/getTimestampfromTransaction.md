# getTimestampfromTransaction

This function is required to be implemented by the app developer for internal use by Shardus. This function will get the timestamp from the `tx` parameter. If it cannot, then it will return `0`. It takes in 1 parameter:

- `tx` - the transaction

```javascript
getTimestampFromTransaction(tx: any) {
    return tx.timestamp ? tx.timestamp : 0
  }
```