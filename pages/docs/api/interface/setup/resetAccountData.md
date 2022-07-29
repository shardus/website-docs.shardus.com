# resetAccountData

This function is required to be implemented by the app developer for internal use by Shardus. It takes in 1 parameter.

- `accountBackupCopies` - the previous state for the account data

If a node is in a minority in the network and attempts to update an account that the majority has not, this function will allow the node to reset the updated data to a state that's consistent with the rest of the network, allowing it to stay in sync.

> Loop over the passed in list of account data and reset those accounts to a previous state:

```javascript
resetAccountData(accountBackupCopies) {
  for (const recordData of accountBackupCopies) {
    const accountData = recordData.data
    accounts[accountData.id] = {...accountData}
  }
}
```
