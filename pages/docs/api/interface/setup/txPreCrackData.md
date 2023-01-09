import Callout from 'nextra-theme-docs/callout'

# txPreCrackData

This function is not required to be implemented by the app developer for internal use by Shardus. It will generate appData metadata for the applied transaction. It takes in 2 parameters:

- `timestampedTx` - the timestamped transaction
- `appData` - an object containing the dapp's data

<Callout emoji="💡" type="default">

The code below shows where to implement this method in an app.

</Callout>

```javascript
shardus.setup({
    /**
    * Defining other functions
    * ...
    */
    async txPreCrackData(timestampedTx, appData) {
        /* function definition */
    }
    /**
    * Defining other functions
    * ...
    */
})
```