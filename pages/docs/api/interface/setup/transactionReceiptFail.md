import Callout from 'nextra-theme-docs/callout'

# transactionReceiptFail

This function is not required to be implemented by the app developer for internal use by Shardus. It will generate appData metadata for the applied transaction. It takes in 2 parameters:

- `inTx` - the transaction
- `wrappedStates` - The object generated from the keys sent in from the `crack` function (a wrapped version of all the account states)
- `applyResponse` - The response object generated from the `apply` function

<Callout emoji="💡" type="default">

The code below shows where to implement this method in an app.

</Callout>

```javascript
shardus.setup({
    /**
    * Defining other functions
    * ...
    */
    async transactionReceiptFail(inTx, wrappedStates, applyResponse) {
        /* function definition */
    }
    /**
    * Defining other functions
    * ...
    */
})
```