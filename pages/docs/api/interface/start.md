# start

`start` is the function that will start a Shardus network after everything is all set up. Do not call this until everything from [setup](./setup) has been implemented and your [API](../main-concepts/../../main-concepts/development/api) has been registered. `setup` also needs to be called after [registerExceptionHandler](./registerExceptionHandler). This method takes in 1 parameter:

1. `exitProcOnFail` is a `boolean` that will exit the program if an error occurs. The default behavior is to restart the node if an error occurs.

```ts
(async () => {
    await dapp.start(true)
    dapp.log('network started...')
})
```
