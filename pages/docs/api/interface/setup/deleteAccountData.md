# deleteAccountData

This function is required to be implemented by the app developer for internal use by shardus. It takes in 1 parameter.

1. `addressList` An array of account addresses

> Implement this function by deleting the account data for the all account id's that match those passed in by `addressList`

```javascript
deleteAccountData(addressList) {
  for (const address of addressList) {
    delete accounts[address]
  }
}
```
