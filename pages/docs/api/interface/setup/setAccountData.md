# setAccountData

`setAccountData` is used internally by Shardus to set account data from a list of `accountRecords` passed in as an argument to this function. Implement this function by looping through the `accountRecords` list and set the account data in your database to the account corresponding to each element of `accountRecords`.

```ts
function setAccountData(accountRecords) {
    for (const account of accountRecords) {
        accounts[account.id] = account
    }
}
```
