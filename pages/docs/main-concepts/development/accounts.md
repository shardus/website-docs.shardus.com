import Callout from 'nextra-theme-docs/callout'

# Accounts

Every state change within a Shardus network affects account data in one form or another. There are no set restrictions on what constitutes account data, and it is up to the developer to decide what accounts can have data associated with things like a user or node account.

A `user account` is an account that represents a user's account data within the network.

<Callout emoji="💡" type="default">

User accounts can have data associated with things like a user's balance and transactions.
An example of a user account data:

</Callout>

```ts
interface UserAccount {
    id: string
    data: {
        balance: number
        toll: number
        chats: object
        friends: object
        stake?: number
        transactions: object[]
    }
    alias: string | null
    emailHash: string | null
    verified: string | boolean
    lastMaintenance: number
    claimedSnapshot: boolean
    timestamp: number
    hash: string
}

const account: UserAccount = {
    id: accountId,
    data: {
        balance: 5000,
        toll: 1,
        chats: {},
        friends: {},
        transactions: [],
    },
    alias: null,
    emailHash: null,
    verified: false,
    hash: '',
    claimedSnapshot: false,
    lastMaintenance: timestamp,
    timestamp: 0,
}
```

A `node account` is an account that represents a node's account data within the network.

<Callout emoji="💡" type="default">

Node accounts can have data associated with things like a node's balance and the last mining reward timestamp.

</Callout>

```ts
interface NodeAccount {
    id: string
    balance: number
    nodeRewardTime: number
    hash: string
    timestamp: number
}

const account: NodeAccount = {
    id: accountId,
    balance: 0,
    nodeRewardTime: 0,
    hash: '',
    timestamp: 0,
}
```

<Callout emoji="⚠️" type="warning">

Any account you create needs to have at least 3 properties.

- `id`
- `hash`
- `timestamp`

Anything else will be up to the developer. Accounts can store any type of data they want. Changing the state of account data will require the account timestamp to be updated and the hash to be updated. Accounts should always have an ID as well, so they can be queried easily. If we were to build a social networking application, each "post" would exist as a new account with at least these three properties.

For example:

</Callout>

```ts
interface Post {
    id: string
    hash: string
    timestamp: number
    title: string
    description: string
    comments: string[]
    owner: string
    upVotes: number
    downVotes: number
}

// Creating the post
const post: Post = {
    // Make a hashing system for the post id's so we can easily query post(n)
    id: crypto.hash(`${USER.address}-post-${USER.posts + 1}`),// Increment the post before hashing
    hash: '',
    timestamp: Date.now(),
    title: 'TEST',
    desciption: 'This is an example of creating a new post for a social media dapp',
    comments: [], // Storage for a list of comments on the post
    owner: 'owner',
    upVotes: 0,
    downVotes: 0
}
```
