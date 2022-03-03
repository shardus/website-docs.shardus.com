import Callout from 'nextra-theme-docs/callout'

# set

`set` is a function that acts like an sudo version of [put](./put). Set is useful for initialization purposes, because it allows the first node in the network to bypass the usual security measures of the network. In other words, the transaction will go through even if the node submitting it is the only node in the network.

<Callout emoji="💡" type="default">

The [sync](./setup/sync) function is the best place to utilize `set`.

</Callout>

```ts
async function sync(): Promise<void> {
    if (dapp.p2p.isFirstSeed) {
        await _sleep(ONE_SECOND * 20)

        const nodeId = dapp.getNodeId()
        const address = dapp.getNode(nodeId).address
        const when = Date.now() + ONE_SECOND * 10

        dapp.setGlobal(
            networkAccount,
            {
                type: 'init_network',
                timestamp: when,
                network: networkAccount,
            },
            when,
            networkAccount,
        )

        dapp.log('GENERATED_NETWORK: ', nodeId)

        await _sleep(ONE_SECOND * 20)

        dapp.set({
            type: 'issue',
            network: networkAccount,
            nodeId,
            from: address,
            issue: crypto.hash(`issue-${1}`),
            proposal: crypto.hash(`issue-${1}-proposal-1`),
            timestamp: Date.now(),
        })

        dapp.set({
            type: 'dev_issue',
            network: networkAccount,
            nodeId,
            from: address,
            devIssue: crypto.hash(`dev-issue-${1}`),
            timestamp: Date.now(),
        })

        await _sleep(ONE_SECOND * 10)
    } else {
        while (!(await dapp.getLocalOrRemoteAccount(networkAccount))) {
            console.log('waiting..')
            await _sleep(1000)
        }
    }
}
```
