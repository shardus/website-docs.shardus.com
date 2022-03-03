# deleteAccountData

`deleteAccountData` is used internally by Shardus for a data repair algorithm in case some nodes lose data that they needed. To implement this method, simply loop over the `addressList` passed in as an argument to the function and delete the account associated with each address from your database.

```ts
// Dummy "in-memory" database
const accounts = {}

deleteAccountData(addressList: string[]): void {
    for (const address of addressList) {
        delete accounts[address]
    }
}
```
