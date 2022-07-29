# deleteAccountData

This function is required to be implemented by the app developer for internal use by Shardus. It takes in 1 parameter:

- `addressList` - an array of account addresses

> Implement this function by deleting the account data for the all account IDs that match those passed in by `addressList`:

```ts
deleteAccountData(addressList: string[]) {
    addressList.forEach(address => delete accounts[address]);
}
```
