# on

`on` is a function used to register handlers for node status events. There are 3 separate events available to register callbacks for:

- `joining` - event triggered when the node submits a join request to the network
- `syncing` - event triggered when the node joins the network and enters the syncing phase
- `active` - event triggered when the node has completed syncing and begins validating transactions

```ts
dapp.on('joining', () => {
    console.log('WE ARE JOINING')
})

dapp.on('syncing', () => {
    console.log('WE ARE SYNCING')
})

dapp.on('active', () => {
    console.log('WE ARE ACTIVE')
})
```
