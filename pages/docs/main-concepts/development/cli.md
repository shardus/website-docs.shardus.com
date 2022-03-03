import Callout from 'nextra-theme-docs/callout'

# CLI

Developing server side code requires a lot of testing. Each user transaction should be automated in such a way that enables you to test each transaction with ease. We use the npm library [vorpal](https://www.npmjs.com/package/vorpal) to create CLI commands that can be used in automated testing scripts.

## Initialization

Below are some helpful packages we recommend using for creating a CLI. [fs](https://nodejs.org/api/fs.html), [path](https://nodejs.org/api/path.html), [vorpal](https://www.npmjs.com/package/vorpal), [shardus-crypto-utils](https://gitlab.com/shardus/shardus-crypto-utils), [axios](https://www.npmjs.com/package/axios).

```ts
const fs = require('fs')
const { resolve } = require('path')
const path = require('path')
const vorpal = require('vorpal')()
const crypto = require('shardus-crypto-utils')
const stringify = require('fast-stable-stringify')
const axios = require('axios')
// Initialize the crypto module using the same hash-key as you do in the server side code
crypto.init('69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc')
```

## Setup

Setting up the CLI requires loading wallet data, defining the host server and archive-server, implementing helper functions for creating accounts, getting seed nodes, and injecting transactions.

```ts
let USER
let HOST = process.argv[2] || 'localhost:9001'
const ARCHIVESERVER = process.argv[3] || 'localhost:4000'
const network = '0'.repeat(64)
const walletFile = resolve('./wallet.json')
let walletEntries = {}

console.log(`Using ${HOST} as node for queries and transactions.`)

try {
  walletEntries = require(walletFile)
} catch (e) {
  saveEntries(walletEntries, walletFile)
  console.log(`Created wallet file '${walletFile}'.`)
}

console.log(`Loaded wallet entries from '${walletFile}'.`)

function saveEntries(entries, file) {
  const stringifiedEntries = JSON.stringify(entries, null, 2)
  fs.writeFileSync(file, stringifiedEntries)
}

function createAccount(keys = crypto.generateKeypair()) {
  return {
    address: keys.publicKey,
    keys,
  }
}

function createAccounts(num) {
  const accounts = new Array(num).fill().map(account => createAccount())
  return accounts
}

async function getSeedNodes() {
  const result = await axios.get(`http://${ARCHIVESERVER}/nodelist`) // await utils.getJson(`${glob.seedNode}/nodelist`)

  let seedNodes = []
  const nodelist = result.data.nodeList
  if (nodelist !== null) {
    // Filter out all non-active nodes. dont filter yet no one will say active.
    // nodelist = nodelist.filter(node => node.status ? node.status === 'active' : false)
    seedNodes = nodelist
  }
  return seedNodes
}

async function injectTx(tx) {
  try {
    const res = await axios.post(`http://${HOST}/inject`, tx)
    return res.data
  } catch (err) {
    return err.message
  }
}

```

## Commands

There are 2 commands that we can have vorpal execute at the start of the program before we start injecting transactions. `init` is a command that lets you start the CLI using the wallet of your choice, and `wallet create <name>` can create another named wallet, or return it's data if it already exists. It's also nice to have a command to switch hosts (shardus node you are sending requests to)

```ts
// Command to start the CLI with a named wallet
vorpal.command('init', 'sets the user wallet if it exists, else creates it').action(function(_, callback) {
  this.prompt(
    {
      type: 'input',
      name: 'user',
      message: 'Enter wallet name: ',
    },
    result => {
      callback(null, vorpal.execSync('wallet create ' + result.user))
    },
  )
})

// COMMAND TO CREATE A LOCAL WALLET KEYPAIR
vorpal.command('wallet create <name>', 'creates a wallet <name>').action(function(args, callback) {
  if (typeof walletEntries[args.name] !== 'undefined' && walletEntries[args.name] !== null) {
    return walletEntries[args.name]
  } else {
    const user = createEntry(args.name, args.id)
    return user
  }
})

// COMMAND TO SET THE HOST IP:PORT
vorpal.command('use host <host>', 'uses <host> as the node for queries and transactions').action(function(args, callback) {
  HOST = args.host
  this.log(`Set ${args.host} as coin-app node for transactions.`)
  callback()
})

```

## Transactions

<Callout emoji="💡" type="default">

Here's an example of a `transaction` command for sending a verification code to validate your email address.

</Callout>

```ts
vorpal.command('verify', 'verifies your email address').action(async function(_, callback) {
  const answer = await this.prompt({
    type: 'input',
    name: 'code',
    message: 'Enter the verification code sent to your email address: ',
    validate: result => {
      result = result.split` `.join``
      if (typeof result === 'string' && result.length === 6) {
        return true
      } else {
        return 'You need to provide the 6 digit code'
      }
    },
  })
  const tx = {
    type: 'verify',
    from: USER.address,
    code: answer.code,
    timestamp: Date.now(),
  }
  crypto.signObj(tx, USER.keys.secretKey, USER.keys.publicKey)
  injectTx(tx).then(res => {
    this.log(res)
    callback()
  })
})
```

First we wait for a prompt to be filled out by the user, then we create a transaction of the type `verify` and include our wallet address, the code from the prompt, and the current time using `Date.now()`. Now sign the transaction and use the `injectTx` helper function to submit the transaction to the network.

## Start

End the file by calling the following commands to setup the CLI delimiter, and our USER data with the `init` command.

```ts
vorpal.delimiter('>').show()
vorpal.exec('init').then(res => (USER = res))
```

> By now you __should__ be up and running and easily create more transaction commands for everything the app needs.
