# updateAccountPartial

`updateAccountPartial` is used internally by Shardus when only a partial update of account information is necessary. Currently, this is being used the same as [updateAccountFull](./updateAccountFull).

```ts
function updateAccountPartial(wrappedData, localCache, applyResponse) {
    updateAccountFull(wrappedData, localCache, applyResponse)
}
```
