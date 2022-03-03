import Callout from 'nextra-theme-docs/callout'

# Transactions

Transactions within Shardus resemble a request to change the state of the network in one way or another. There are 2 types of transactions:

1. User Transactions: transactions initiated by user accounts within the network
2. Node Transactions: transactions initiated by nodes within the network

## User Transaction Example


<Callout emoji="💡" type="default">

The most basic transaction a user would initiate is a `transfer` transaction, or sending coins to another account

</Callout>

```ts
const tx = {
    type: 'transfer', // the type of transaction being submited
    from: USER.address, // publicKey or address of the user submitting the transaction
    to: '0'.repeat(64), // publicKey or address of the target account receiving the transaction
    amount: answers.amount, // amount of coins to send to the target
    timestamp: Date.now(), // timestamp of the transaction
}
```

## Node Transaction Example

<Callout emoji="💡" type="default">

The most basic transaction a node would initiate is a `node_reward` transaction (A request to get paid for running a node on the network for a period of time)

</Callout>

```ts
const tx = {
    type: 'node_reward', // the type of transaction being submited
    nodeId: nodeId, // nodeId of the node submitting the transaction
    from: address, // publicKey of the node submitting the transaction
    to: payAddress, // address of the account receiving the payment reward
    timestamp: Date.now(), // timestamp of the transaction
}
```

