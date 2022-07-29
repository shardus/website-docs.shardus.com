# canDebugDropTx

This function is used internally by Shardus for testing and debugging purposes. It takes in a transaction and returns a boolean indicating whether the transaction should be dropped by the network. In a production application, this function should always return `false`:

```ts
function canDebugDropTx(tx) {
    return false
}
```

However, it's useful for stress testing and debugging purposes, because you can individually select certain transaction types that might be prone to dropping and develop with that intention in mind.

```ts
function canDebugDropTx(tx) {
    if (tx.type === 'drop_me') {
        return true
    }
    return false
}
```
