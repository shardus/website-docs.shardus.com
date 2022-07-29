import Callout from 'nextra-theme-docs/callout'

# isFirstSeed

`isFirstSeed` is a `boolean` property on the main Shardus object. This property is `true` for the first node that joins the network and `false` for everyone else. This property is useful mainly for initialization purposes. If you need to inject transactions or run specific code blocks at the start of the network, you should use this property to determine the node that will execute the logic. Otherwise, there is no differentiation and all the nodes will try to execute the same transactions.

<Callout emoji="💡" type="default">

Another use for this property is to give the first node extra time to wait before all the network functionality is up and running.

</Callout>

```ts
  dapp.on(
    'active',
    async (): Promise<NodeJS.Timeout> => {
      if (dapp.p2p.isFirstSeed) {
        await _sleep(ONE_SECOND * cycleDuration * 2)
      }
      lastReward = Date.now()
      return setTimeout(networkMaintenance, cycleInterval)
    },
  )
```

