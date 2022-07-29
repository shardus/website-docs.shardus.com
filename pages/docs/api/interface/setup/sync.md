import Callout from 'nextra-theme-docs/callout'

# sync

`sync` is used internally by Shardus in the event that a node needs specific application data before it can begin validating transactions. We found the need for this functionality while developing [Liberdus](../../../examples/liberdus). Because of the dynamic global network parameters that Liberdus uses, nodes are required to have this data available to them before they can begin validating transactions. However, this data exists within an account on the network so it's not available as a part of the normal syncing process. `sync` is optional, and is used to ensure a node has synchronized required network data before it starts validating transactions (in other words, becomes _active_). It can also be useful for generating transactions before other nodes join the network, like an initialization step.

## Liberdus `sync` example

<Callout emoji="💡" type="default">

This is how we needed to implement the `sync` function for Liberdus.

</Callout>

> We first needed a way to initialize the account that would hold the global network parameter data, so we used [setGlobal](../setGlobal) to create a global account. This only needs to be done once, so we make sure that only the first node in the network is able to execute this code path by using [isFirstSeed](../isFirstSeed). After creating the global account, we wait for 20 seconds (to ensure that the previous `setGlobal` transaction is applied); then, we kick things off by having this first node generate `issue`s for the proposal phase of the network cycle as well. For every node other than the first, we simply need to ensure that it's able to grab the data it needs using [getLocalOrRemoteAccount](../getLocalOrRemoteAccount).

```ts
// HELPER METHOD TO WAIT
async function _sleep(ms = 0): Promise<NodeJS.Timeout> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const networkAccount = '0'.repeat(64)

async function sync() {
    if (dapp.isFirstSeed) {
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
    } else {
        while (!(await dapp.getLocalOrRemoteAccount(networkAccount))) {
            console.log("Couldn't get network parameters... Trying again in 1 second")
            await _sleep(1000)
        }
    }
}
```

