# calculateAccountHash

This function is required to be implemented by the app developer for internal use by shardus. It takes in 1 parameter.

1. `accountData` the account data

> Use the `crypto` module to hash the accountData that is passed in and return the resulting hash

```javascript
calculateAccountHash (accountData) {
  return crypto.hashObj(accountData)
}
```
