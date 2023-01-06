# validateJoinRequest

This function is not required to be implemented by the app developer for internal use by Shardus. It makes sure a joining node provides the necessary join data and is using the correct app version, and it takes in 1 parameter:

- `data` - a join request

<Callout emoji="💡" type="default">

The code below shows where to implement this method in an app.

</Callout>

```javascript
shardus.setup({
    /**
    * Defining other functions
    * ...
    */
    validateJoinRequest(data: any) {
        /* function definition */
    }
    /**
    * Defining other functions
    * ...
    */
})
```