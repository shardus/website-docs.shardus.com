# resetAccountData

This function is required to be implemented by the app developer for internal use by shardus. It takes in 1 parameter.

1. `accountBackupCopies` the previous state for the account data

If a node is a minority in the network and attempts to update an account that the majority has not, this function will allow the node to reset the updated data to a state that's consistent with the rest of the network, allowing it to stay in sync.

> Loop over the list of passed in account copy data and reset those account to a previous state

```javascript
resetAccountData(accountBackupCopies) {
  for (let recordData of accountBackupCopies) {
    accounts[recordData.id] = recordData
  }
}
```
