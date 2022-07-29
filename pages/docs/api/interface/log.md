import Callout from 'nextra-theme-docs/callout'

# log

`log` can be used for logging to a file in the `instances/instance-n/logs/app.log` file of each node. We often find it useful to categorize log entries with different files, and application logs should be grouped accordingly.

```ts
// NODE_REWARD TRANSACTION FUNCTION
function nodeReward(address: string, nodeId: string): void {
  const payAddress = address
  const tx = {
    type: 'node_reward',
    network: networkAccount,
    nodeId: nodeId,
    from: address,
    to: payAddress,
    timestamp: Date.now(),
  }
  dapp.put(tx)
  console.log('TX_DATA: ', tx)
  dapp.log('GENERATED_NODE_REWARD: ', nodeId)
}
```

<Callout emoji="💡" type="default">

You can also use `console.log()` instead of, or in conjunction with, `dapp.log()`. There will be separate files for both application logs (`app.log`) and console logs (`out.log`).

![logs](/img/log_files.png)

</Callout>
