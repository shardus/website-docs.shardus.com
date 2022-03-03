# canDebugDropTx

This function is used internally by Shardus for testing and debugging purposes. It takes in a transaction and expects this function to return a boolean indicating whether the transaction should be dropped by the network. In a production application, this function should always return false like so.

```ts
function canDebugDropTx(tx) {
    return false
}
```

However, it's useful for stress testing and debugging purposes because you can individually select certain transaction types that might be prone to dropping and developing with that intention in mind.

```ts
function canDebugDropTx(tx) {
    if (tx.type === 'drop_me') {
        return true
    }
    return false
}
```
