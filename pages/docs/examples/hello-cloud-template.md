import Callout from "nextra-theme-docs/callout"

# Hello Cloud

Hello Cloud is a simple dapp designed to help you learn the fundamentals of
shardus. The function of the dapp is simple: allow the user to set some small
state into the network (as a number) and then read that state back.

If you went through the [quickstart guide](/docs/installation/quickstart), you
will already have been introduced to the Hello Cloud dapp.

## Installation

First, clone and install the repo:

```sh
git clone git@gitlab.com:shardus/applications/hello-cloud.git
cd hello-cloud
npm install
```

## Investigation

Head on into the repo and open up `index.ts`. This is where you'll find all the
real juicy goods. This repo has been made to be self explanatory - you'll find
detailed explanation of all the ins and outs right there within the code.

## Explanation

Below you'll find more high level explanations. Once you finish reading
through both the code and the below, you should have enough understanding of shardus
to start developing your own dapps.

### The Types

The most important type you'll find is the `Account` type. This type represents
the way we store our data. This type will change the most from dapp to dapp.

```ts
type Account = {
  id: HexString
  timestamp: TimeStamp // represents last update time
  state: number
}
```

The `id` and `timestamp` fields will be universal across dapps, however the
`state` field is totally up to us here in Hello Cloud. This is where we keep
the number we're saving into the cloud. If we were developing a dapp that, say,
tracked Koala Bear movement (for no particular reason at all), maybe instead of
a `state` key, we'd have something more like
`{ id, timestamp, name: string, age: number, lastSeenLocation: GeoPoint }` or something
like that.

---

We save our accounts into an object keyed with the accoundId. This is a convenient
way to hold on to accounts when using an in memory representation like this and we'll
find it across many shardus dapps. If we were saving into a database instead, we
could add an index on accountId for fast lookups.

```ts
type Accounts = {
  [accountId: HexString]: Account
}
```

<Callout emoji="💡" type="default">

Every node in a shard has the same collection of `Account`s, which it saves locally.
Nodes in other shards will have a different collection of `Account`s.

</Callout>

### The Setup

Most of the real application logic goes into the `shardus.setup({...})` call.
Pay particular attention to the `apply(...)` and the `updateAccountFull(...)` functions.

#### apply

```ts
apply(tx: Transaction, dataAccounts: WrappedAccounts) {
  dataAccounts[tx.accountId].data.state = tx.state
  const txId = hashTx(tx)
  return shardus.createApplyResponse(txId, tx.timestamp)
},
```

The network has agreed upon some state via its internal consensus protocols.
The job of `apply` is to mutate that state based on an incoming transaction.
Every node in a shard will compute this mutation and return it to the other
nodes. If a majority of nodes' `apply`s return the same new state, that state
will become the new state in the network.

Take a look at this first line: `dataAccounts[tx.accountId].data.state = tx.state`.
We're mutating `dataAccounts`, which is the the original state the network has
before this transaction came in. This is how we tell the network the result
of the the transaction.

#### updateAccountFull

```ts
updateAccountFull(wrappedState, localCache: Account, applyResponse) {
  const { accountId, accountCreated } = wrappedState
  const updatedAccount = wrappedState.data as Account

  const hashBefore = accounts[accountId] ? hashAccount(accounts[accountId]) : '' // Can't pass in undefined
  const hashAfter  = hashAccount(updatedAccount)

  // Update our local state
  accounts[accountId] = updatedAccount

  // See more: https://shardus.gitlab.io/docs/developer/api/interface/applyResponseAddState.html
  shardus.applyResponseAddState(
    applyResponse,
    updatedAccount,
    localCache,
    accountId,
    applyResponse.txId,
    applyResponse.txTimestamp,
    hashBefore,
    hashAfter,
    accountCreated
  )
},
```

Once the nodes in the network have agreed upon what the new state should be by
reaching consensus on their `apply` results, each node needs to update its internal
representation of the state. It's in this function we do that, particularly
in the line `accounts[accountId] = updatedAccount`.

## Exploration

> We've covered some of the most important bits in here, but there is more going on in the code.
> We highly encourage you to read through the code in the Hello Cloud dapp, and in the next
> apps you'll find here in the examples guide, until you reach the level of grokking you desire.
