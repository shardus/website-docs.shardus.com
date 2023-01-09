import Callout from 'nextra-theme-docs/callout'

# getJoinData

This function is not required to be implemented by the app developer for internal use by Shardus. It takes in no parameters

<Callout emoji="💡" type="default">

The code below shows an example implementation.

</Callout>

```javascript
shardus.setup({
    /**
    * Defining other functions
    * ...
    */
    getJoinData() {
        const joinData = {
        version,
        }
        return joinData
    }
    /**
    * Defining other functions
    * ...
    */
})
```