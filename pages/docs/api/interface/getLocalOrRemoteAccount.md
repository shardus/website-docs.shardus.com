import Callout from 'nextra-theme-docs/callout'

# getLocalOrRemoteAccount

`getLocalOrRemoteAccount` is an essential method to query account information when developing with Shardus. Sharded networks take the application state and split it between many shards, each of which could vary in size depending on the network configuration. This means that when some node gets a request for data, it cannot simply rely on the data being stored locally. Instead it needs to check _whether_ it has the data locally and, if so, return it; otherwise, it will need to send a request to a node in the shard that does have the data locally. All this complexity is handled by utilizing `getLocalOrRemoteAccount`.

<Callout emoji="💡" type="warning">

You should use this function in all of your API routes that return data.

</Callout>

```ts
dapp.registerExternalGet(
  'issues',
  async (req, res): Promise<void> => {
    const network = await dapp.getLocalOrRemoteAccount(networkAccount)
    try {
      const issues = []
      for (let i = 1; i <= network.data.issue; i++) {
        const issue = await dapp.getLocalOrRemoteAccount(crypto.hash(`issue-${i}`))
        if (issue && issue.data) {
          issues.push(issue.data)
        }
      }
      res.json({ issues })
    } catch (error) {
      dapp.log(error)
      res.json({ error })
    }
  },
)
```

