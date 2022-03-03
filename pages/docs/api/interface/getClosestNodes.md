import Callout from 'nextra-theme-docs/callout'

# getClosestNodes

`getClosestNodes` is a useful function that returns a list of the closest nodeId's to the specified `hash`. The function takes in two parameters:

1. `hash` is a string that represents the hash from which to compare the nodeId's to.
2. `count` is a number that represents the number of nodeId's to return in the list.

<Callout emoji="💡" type="default">

This function can be **extremely** useful for when you need the network to automatically change the state in some way on it's own. This function allows you to grab the id's of the closest nodes to a given hash, so if you seemingly randomize the hash, you can have the network do things like randomly choose 1 node to submit a transaction. 

> We found this useful if you're building a *confirmation email transaction*. Since Shardus transactions get routed to shards and __there's always going to be more than 1 node per shard__, we need a way to have only 1 node actually send the verification email because we don't want to spam the user. For security reasons, it's better if this node is chosen at random as well.

</Callout>

---

This can be accomplished by using `getClosestNodes`. So imagine 5 nodes per shard, and destructuring the first (closest) item in the list. Then we can check to see if we are the closest and continue executing the code. The closest node must also gossip the hash of the verification number so that when the next validate transaction occurs, the other nodes will know what to verify with.

```ts
switch (tx.type) {
    case 'email': {
        const source: UserAccount = wrappedStates[tx.signedTx.from].data
        const nodeId = dapp.getNodeId()
        const { address } = dapp.getNode(nodeId)
        const [closest] = dapp.getClosestNodes(tx.signedTx.from, 5)
        if (nodeId === closest) {
            const baseNumber = 99999
            const randomNumber = Math.floor(Math.random() * 899999) + 1
            const verificationNumber = baseNumber + randomNumber

            axios.post('http://arimaa.com/mailAPI/index.cgi', {
                from: 'liberdus.verify',
                to: `${tx.email}`,
                subject: 'Verify your email for liberdus',
                message: `Please verify your email address by sending a "verify" transaction with the number: ${verificationNumber}`,
                secret: 'some-secret',
            })

            dapp.put({
                type: 'gossip_email_hash',
                nodeId,
                account: source.id,
                from: address,
                emailHash: tx.signedTx.emailHash,
                verified: crypto.hash(`${verificationNumber}`),
                timestamp: Date.now(),
            })
        }
        dapp.log('Applied email tx', source)
        break
    }
}
```

