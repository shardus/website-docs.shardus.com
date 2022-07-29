import Callout from 'nextra-theme-docs/callout'

# put

`put` is the function that nodes will use to inject transactions into the network. It takes the transaction data as its argument and Shardus handles all of the internal peer-to-peer gossip communication between the nodes to record the transaction.

<Callout emoji="💡" type="default">

You need some sort of `/inject` endpoint for clients to send POST requests to nodes. Always use [registerExternalPost](./registerExternalPost) to create this endpoint for your application.

</Callout>

```ts
// API
dapp.registerExternalPost(
  'inject',
  async (req, res): Promise<void> => {
    try {
      const result = dapp.put(req.body)
      res.json({ result })
    } catch (error) {
      dapp.log(error)
      res.json({ error })
    }
  },
)
```

