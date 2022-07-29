# calculateAccountHash

This function is required to be implemented by the app developer for internal use by Shardus. It takes in 1 parameter:

- `accountData` - the account data

> Use the [crypto](../../../tools/crypto-utils) module to hash the account data that is passed in and return the resulting hash:

```javascript
calculateAccountHash (accountData) {
  return crypto.hashObj(accountData)
}
```
