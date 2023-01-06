# dataSummaryUpdate

This function is not required to be implemented by the app developer for internal use by Shardus. It takes in 2 parameters:

- `blob` - a dapp definable object that is used to aggregate statistics in a sharded network
- `accountDataBefore` - the account's data before a transaction
- `accountDataAfter` - the account's data after a transaction

<Callout emoji="💡" type="default">

The code below shows where the method should be defined in an example implementation. The internal workings of the function are up to the developer.

</Callout>

```javascript
dapp.setup({
    /**
    * Defining other functions
    * ...
    */
    dataSummaryUpdate(blob, accountDataBefore, accountDataAfter) {
        /* function definition */
    }
    /**
    * Defining other functions
    * ...
    */
})
```