# deleteLocalAccountData

`deleteLocalAccountData` is used internally by Shardus for a data repair algorithm in case some nodes lose data that they needed. To implement this method, simply set `accounts` to a blank array.

```ts
deleteLocalAccountData(): void {
    accounts = {};
}
```
