import Callout from 'nextra-theme-docs/callout'

# registerExternalGet

`registerExternalGet` is used for registering API routes in your application. As the name suggests, it's used to register GET requests. This function takes two parameters:

1. `route` is a `string` representing the route of the request.
2. `handler` is the `callback` function that will be executed when a request comes in that matches the route.

```ts
dapp.registerExternalGet(
  'network/parameters',
  async (req, res): Promise<void> => {
    try {
      const account = await dapp.getLocalOrRemoteAccount(networkAccount)
      const network: NetworkAccount = account.data
      res.json({
        parameters: {
          current: network.current,
          next: network.next,
          developerFund: network.developerFund,
          nextDeveloperFund: network.nextDeveloperFund,
          windows: network.windows,
          devWindows: network.devWindows,
          nextWindows: network.nextWindows,
          nextDevWindows: network.nextDevWindows,
          issue: network.issue,
          devIssue: network.devIssue,
        },
      })
    } catch (error) {
      dapp.log(error)
      res.json({ error })
    }
  },
)
```

<Callout emoji="💡" type="default">

Get used to using and understanding [getLocalOrRemoteAccount](./getLocalOrRemoteAccount). This method will need to be utilized in the majority of your API routes because of the way sharding works with `shardus`

</Callout>
