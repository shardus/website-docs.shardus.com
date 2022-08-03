import Callout from "nextra-theme-docs/callout"

# Coin App

This guide will show you how to create the most basic type of decentralized application using Shardus from scratch.

## Final Code

The final code for this app is available on GitLab, [here](https://gitlab.com/shardus/applications/coin-app-template) (TypeScript [version](https://gitlab.com/shardus/applications/coin-app-ts)).

## Initialize Node Project

Start by initializing a new Node project:

```sh
npm init
# OR:
yarn init
```

### Install Dependencies

```sh
npm install @shardus/core
npm install @shardus/crypto-utils
npm install deepmerge got vorpal
# OR:
yarn add @shardus/core
yarn add @shardus/crypto-utils
yarn add deepmerge got vorpal
```

> Dev Dependencies

```sh
npm install -D @shardus/archiver
npm install -D @shardus/monitor-server
npm install -D cross-env execa pm2 shelljs yarpm
# OR:
yarn add -D @shardus/archiver
yarn add -D @shardus/monitor-server
yarn add -D cross-env execa pm2 shelljs yarpm
```

<Callout emoji="⚠️" type="warning">

Make sure you are using the Node `16.11.1`. If you are using a different node version than `16.11.1` you'll receive an error message that looks something like this when you run your application:

</Callout>

```sh
Error: Cannot find module '/home/user/code/shardus/applications/chat-app/node_modules/sqlite3/lib/binding/node-v72-linux-x64/node_sqlite3.node'
```

> If you get this error, you need to remove your `node_modules` folder and your package lockfile. Then, run `nvm use 16.11.1` and finally `npm install` (OR `yarn install`).

Your `package.json` file should look something like this now:

```json
{
  "name": "coin-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@shardus/core": "^2.5.2",
    "@shardus/crypto-utils": "^4.0.3",
    "deepmerge": "^4.2.2",
    "got": "^9.6.0",
    "vorpal": "^1.12.0"
  },
  "devDependencies": {
    "@shardus/archiver": "3.2.4",
    "@shardus/monitor-server": "2.0.3",
    "cross-env": "^5.2.0",
    "execa": "^1.0.0",
    "pm2": "^5.1.2",
    "shelljs": "^0.8.3",
    "yarpm": "^0.2.1"
  }
}
```

### Create scripts

Create a `scripts` directory in the root of your project. Create 3 script files that will help start, stop, and clean a single node network.

```sh
mkdir scripts && cd scripts
touch start.js stop.js clean.js
```

Put the code below into your `start.js` file:

```javascript
const execa = require('execa')

const archiverPath = require.resolve('@shardus/archiver')
const monitorPath = require.resolve('@shardus/monitor-server')

async function main() {
  try {
    await execa('yarpm', `run pm2 start --no-autorestart ${archiverPath}`.split(' '), { stdio: [0, 1, 2] })
    await execa('yarpm', `run pm2 start --no-autorestart ${monitorPath}`.split(' '), { stdio: [0, 1, 2] })
    console.log()
    console.log('\x1b[33m%s\x1b[0m', 'View network monitor at:') // Yellow
    console.log('  http://localhost:\x1b[32m%s\x1b[0m', '3000') // Green
    console.log()
  } catch (e) {
    console.log(e)
  }
}
main()
```

Put the code below into your `stop.js` file:

```javascript
const execa = require('execa')

async function main() {
  try {
    await execa('yarpm', 'run pm2 stop all'.split(' '), { stdio: [0, 1, 2] })
    await execa('yarpm', 'run pm2 kill'.split(' '), { stdio: [0, 1, 2] })
  } catch (e) {
    console.log(e)
  }
}
main()
```

Put the code below into your `clean.js` file:

```javascript
const {rm} = require('shelljs');

async function main() {
  try {
    rm(
      '-rf',
      './.pm2 ./db ./logs ./statistics.tsv ./archiver-db* ./archiver-logs ./monitor-logs ./db-old-*'.split(
        ' '
      )
    );
  } catch (e) {
    console.error(e);
  }
}
main();
```

### Add scripts to `package.json`

Add `start`, `stop`, `clean`, and `restart` scripts to the `scripts` field in your `package.json` file like so:

```json
{
  "scripts": {
    "pm2": "cross-env PM2_HOME='./.pm2' pm2",
    "start": "node scripts/start.js && node index.js",
    "stop": "node scripts/stop.js",
    "clean": "node scripts/clean.js",
    "restart": "node scripts/stop.js && node scripts/clean.js && node scripts/start.js && node index.js"
  }
}
```

## Set Up Configuration

In your app's root directory, create a `config.json` file where our Shardus [configuration parameters](../api/configuration/README) will go:

```sh
touch config.json
```

Put the following code into `config.json`.

<Callout emoji="⚠️" type="warning">

The configuration below is a special case for running a single node. When you wish to run a network of nodes, change the `nodesPerConsensusGroup` to something a bit higher like `5` or `10` and also change the `minNodesToAllowTxs` to something a bit more stable like `3` or `5`.

</Callout>

```json
{
  "server": {
    "p2p": {
      "minNodesToAllowTxs": 1
    },
    "sharding": {
      "nodesPerConsensusGroup": 1
    }
  }
}
```

<Callout emoji="💡" type="default">

You can learn more about the Shardus configuration parameters [here](../api/configuration/README).

</Callout>

## Create Server

In your app's root directory, create a new file `index.js` where our server code will go:

```sh
touch index.js
```

### Import modules

At the top of our `index.js` file, import the following modules:

```javascript
const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const shardus = require('@shardus/core');
const crypto = require('@shardus/crypto-utils');
```

First, initialize the [crypto module](../tools/crypto-utils) we required by passing in `69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc` as a `string` argument to its `init` constructor function. This is the hash key that Shardus utilizes internally, and the one we'll be using for all the demo examples. This will initialize the cryptographic hashing functions you will be using soon.

```javascript
crypto.init('69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc')
```

Next, put the following code under `crypto.init`.

```javascript
let config = { server: { baseDir: './' } }

const overwriteMerge = (target, source, options) => source

if (fs.existsSync(path.join(process.cwd(), 'config.json'))) {
  const fileConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')))
  config = merge(config, fileConfig, { arrayMerge: overwriteMerge })
}

if (process.env.BASE_DIR) {
  const baseDirFileConfig = JSON.parse(fs.readFileSync(path.join(process.env.BASE_DIR, 'config.json')))
  config = merge(config, baseDirFileConfig, { arrayMerge: overwriteMerge })
  config.server.baseDir = process.env.BASE_DIR
}

if (process.env.APP_SEEDLIST) {
  config = merge(
    config,
    {
      server: {
        p2p: {
          existingArchivers: [
            {
              ip: process.env.APP_SEEDLIST,
              port: 4000,
              publicKey: '758b1c119412298802cd28dbfa394cdfeecc4074492d60844cc192d632d84de3',
            },
          ],
        },
      },
    },
    { arrayMerge: overwriteMerge }
  )
}

if (process.env.APP_MONITOR) {
  config = merge(
    config,
    {
      server: {
        reporting: {
          recipient: `http://${process.env.APP_MONITOR}:3000/api`,
        },
      },
    },
    { arrayMerge: overwriteMerge }
  )
}

if (process.env.APP_IP) {
  config = merge(
    config,
    {
      server: {
        ip: {
          externalIp: process.env.APP_IP,
          internalIp: process.env.APP_IP,
        },
      },
    },
    { arrayMerge: overwriteMerge }
  )
}
```

This will pull in your `config.json` and overwrite it with some additional variables to make it work when running a network of nodes. It also configures dev tools like the `archive-server` and `monitor-server`.

Now initialize your dApp by passing in your config to Shardus:

```javascript
const dapp = shardus(config)
```

## Set Up Database

Here we will create a database to host all of the accounts in our network. For the sake of this simple example, we will use an object in memory. Create a variable to store the accounts and a constructor function for creating accounts.

```javascript
let accounts = {}

```

## Set Up API

Shardus provides a few methods for creating API routes. [registerExternalPost](../api/interface/registerExternalPost) and [registerExternalGet](../api/interface/registerExternalGet) will be used here to create an API we can fetch data from.

<Callout emoji="⚠️" type="warning">

It's up to _you_ to define your own routes for what data from the network can be queried

</Callout>

All Shardus applications will use a `POST` route for injecting transactions. Here is what that looks like:

```javascript
dapp.registerExternalPost('inject', async (req, res) => {
  try {
    const response = dapp.put(req.body)
    res.json(response)
  } catch (error) {
    res.json(error)
  }
})
```

<Callout emoji="💡" type="default">

When we implement the client side of our application, we will submit transactions using a `POST` request to this `inject` route we created. Shardus uses the [put](../api/interface/put) method to inject the transaction data into the network.

</Callout>

Now create some `GET` request endpoints so we can query data from our accounts. In this example, we provide one route for getting a single account, and the other for all accounts.

```javascript
dapp.registerExternalGet('account/:id', async (req, res) => {
  const id = req.params['id']
  const account = accounts[id]
  res.json(account)
});

dapp.registerExternalGet('accounts', async (req, res) => {
  res.json(accounts)
});
```

## Set Up Shardus

Now it's time to implement the `setup` functions we pass into Shardus. Paste the following code below the API routes you created. We will discuss and implement each of these one by one.

```javascript
dapp.setup({
  validate(tx) {},
  apply(tx, wrappedAccounts) {},
  crack(tx){},
  setAccountData(accountToSet) {},
  resetAccountData(accountBackupCopies) {},
  deleteAccountData(addressList) {},
  deleteLocalAccountData() {},
  getRelevantData(accountId, tx) {},
  getAccountDataByRange(accountStart, accountEnd, tsStart, tsEnd, maxRecords) {},
  getAccountDataByList(addressList) {},
  getAccountData(accountStart, accountEnd, maxRecords) {},
  updateAccountFull(wrappedData, localCache, applyResponse) {},
  updateAccountPartial(wrappedData, localCache, applyResponse) {},
  calculateAccountHash(account) {},
  close() {},
});
```
#### validate
Start by implementing the [validate](../api/interface/setup/validate) function. The purpose of this function is to ensure certain requirements are met before allowing the transaction to get applied.

<Callout emoji="⚠️" type="warning">

It is the app developer's responsibility to ensure that the network is secure by validating each transaction thoroughly

</Callout>

For this application, we will be demonstrating a simplistic payment network where users can create tokens out of thin air and send them to each other.  Use the following code as an example of how to implement this function.
```ts
  validate(tx) {
    // Validate tx fields here
    let success = true
    let reason = ''
    const txnTimestamp = tx.timestamp

    if (typeof tx.type !== 'string') {
      success = false
      reason = '"type" must be a string.'
      throw new Error(reason)
    }
    if (typeof tx.from !== 'string') {
      success = false
      reason = '"from" must be a string.'
      throw new Error(reason)
    }
    if (typeof tx.to !== 'string') {
      success = false
      reason = '"to" must be a string.'
      throw new Error(reason)
    }
    if (typeof tx.amount !== 'number') {
      success = false
      reason = '"amount" must be a number.'
      throw new Error(reason)
    }
    if (typeof tx.timestamp !== 'number') {
      success = false
      reason = '"timestamp" must be a number.'
      throw new Error(reason)
    }

    return {
      success,
      reason,
      txnTimestamp,
    }
  },
```
<Callout emoji="⚠️" type="warning">

In more complex examples, you'll want to add more granular conditional flow so that you only validate fields in a transaction specific to that transaction type.

</Callout>

#### apply

[apply()](../api/interface/setup/apply) is the function responsible for mutating your application state. This function is the only place where any change to the database (or the `accounts` object, in this example) can occur. If the transaction that comes in passes our validation, we can apply this transaction to the state of our application. Within `apply` we must return an `applyResponse` that we can get by calling `dapp.createApplyResponse(txId, tx.timestamp)`, passing in the transaction ID (the hash of the transaction object passed into `apply`) and the timestamp field from the transaction object. Use the following code as an example of how to implement this function:

<Callout emoji="💡" type="default">

Here's a more in depth explanation of [createApplyResponse](../api/interface/createApplyResponse)

</Callout>

```javascript
  apply(tx, wrappedStates) {
    const txId = crypto.hashObj(tx)
    const txTimestamp = tx.timestamp

    console.log('DBG', 'attempting to applytx', txId, '...')
    const applyResponse = dapp.createApplyResponse(txId, txTimestamp)

    // Apply the tx
    switch (tx.type) {
      case 'create': {
        // Get the to account
        const to = wrappedStates[tx.to].data
        if (typeof to === 'undefined' || to === null) {
          throw new Error(`account '${tx.to}' missing. tx: ${JSON.stringify(tx)}`)
        }
        // Increment the to accounts balance
        to.data.balance += tx.amount
        // Update the to accounts timestamp
        to.timestamp = txTimestamp
        console.log('DBG', 'applied create tx', txId, accounts[tx.to])
        break
      }
      case 'transfer': {
        // Get the from and to accounts
        const from = wrappedStates[tx.from].data
        if (typeof from === 'undefined' || from === null) {
          throw new Error(`from account '${tx.to}' missing. tx: ${JSON.stringify(tx)}`)
        }
        const to = wrappedStates[tx.to].data
        if (typeof to === 'undefined' || to === null) {
          throw new Error(`to account '${tx.to}' missing. tx: ${JSON.stringify(tx)}`)
        }
        // Decrement the from accounts balance
        from.data.balance -= tx.amount
        // Increment the to accounts balance
        to.data.balance += tx.amount
        // Update the from accounts timestamp
        from.timestamp = txTimestamp
        // Update the to accounts timestamp
        to.timestamp = txTimestamp
        console.log('DBG', 'applied transfer tx', txId, accounts[tx.from], accounts[tx.to])
        break
      }
    }
    return applyResponse
  },
```

#### crack
The [crack](./api/interface/setup/crack) function is responsible for parsing the public keys of the accounts being affected by this transaction
and returns a `result` object that resembles this:
```ts
{
  sourceKeys: [tx.from],
  targetKeys: [tx.to],
  allKeys: [tx.from, tx.to],
  timestamp: tx.timestamp
}
```
The `sourceKeys` property should contain the public key of the account that initiated the transaction,
and the `targetKeys` property should contain the public key(s) of the account(s) being targeted.
`allKeys` should contain all the `sourceKeys` and `targetKeys`. Use the following code as an example of how to implement this function:

```js
  crack(tx) {
    const keys = {
      sourceKeys: [],
      targetKeys: [],
      allKeys: [],
      timestamp: tx.timestamp,
    }
    switch (tx.type) {
      case 'create':
        keys.targetKeys = [tx.to]
        keys.sourceKeys = [tx.to]
        break
      case 'transfer':
        keys.targetKeys = [tx.to]
        keys.sourceKeys = [tx.from]
        break
    }
    keys.allKeys = [...keys.sourceKeys, ...keys.targetKeys]
    return {
      id: crypto.hashObj(tx),
      timestamp: tx.timestamp,
      keys: keys
    }
  },
```

#### deleteAccountData

For [deleteAccountData()](../api/interface/setup/deleteAccountData), loop through the `addressList` passed in as an argument and delete the account in your database associated with each address. You can use the following code to accomplish this:

```javascript
  deleteAccountData(addressList) {
    console.log('==> deleteAccountData');
    addressList.forEach(address => delete accounts[address]);
  },
```

#### deleteLocalAccountData

The [deleteLocalAccountData](../api/interface/setup/deleteLocalAccountData) function is used to wipe everything in the database. Use the following code to implement this function:

```javascript
  deleteLocalAccountData() {
    console.log('==> deleteLocalAccountData');
    accounts = {};
  }
```

#### setAccountData

After the `apply` function has done its duty, [setAccountData()](../api/interface/setup/setAccountData) will update our `accounts` object using a list of account records that Shardus passes to this function. Use the following code to implement this function:

```javascript
  setAccountData(accountsToSet) {
    console.log('==> setAccountData');
    accountsToSet.forEach(account => (accounts[account.id] = account));
  },
```

#### getRelevantData

[getRelevantData()](../api/interface/setup/getRelevantData) is where we can create accounts. Of course, if the account already exists, all we have left to do is return a `wrappedResponse` that we can get by calling the [createWrappedResponse](../api/interface/createWrappedResponse) function exposed by Shardus.

The following demonstrates an implementation of `getRelevantData` that will work for this basic application.

```javascript
  getRelevantData(accountId, tx) {
    console.log('==> getRelevantData');
    let account = accounts[accountId];
    let accountCreated = false;

    if (!account) {
      account = {
        id: accountId,
        timestamp: tx.timestamp,
        data: { balance: 0 }
      };
      accountCreated = true;
    }
    return dapp.createWrappedResponse(
      accountId,
      accountCreated,
      crypto.hashObj(account),
      account.timestamp,
      account
    );
  },
```

<Callout emoji="💡" type="default">

In more advanced applications, we will use multiple different account types. Shardus treats all data in the form of accounts, but these accounts can contain whatever data you want. Imagine a social networking application where you can write comments and posts. These types of data would exist on the network in the form of accounts, each with their own account IDs, hashes, and timestamps. `getRelevantData` will be responsible for creating different accounts based on different transaction types.

</Callout>

#### getAccountData

The [getAccountData](../api/interface/setup/getAccountData) function is used by Shardus to fetch a range of account data from our application's database. It provides three arguments.
- `accountIdStart` - The minimum account ID from the range of accounts to fetch
- `accountIdEnd` - The maximum account ID from the range of accounts to fetch
- `maxRecords` - The maximum number of accounts to fetch from the database

To implement this, loop through all the accounts in our database and add them to a list of results if their ID is between `accountIdStart` and `accountIdEnd`. Wrap each account by using [createWrappedResponse()](./api/interface/createWrappedResponse) before adding it to the list of results.

```js
  getAccountData(accountIdStart, accountIdEnd, maxRecords) {
    console.log('==> getAccountData');
    const wrappedAccounts = [];
    const start = parseInt(accountIdStart, 16);
    const end = parseInt(accountIdEnd, 16);

    for (const account of Object.values(accounts)) {
      const parsedAccountId = parseInt(account.id, 16);
      if (parsedAccountId < start || parsedAccountId > end) continue;

      const wacc = dapp.createWrappedResponse(
        account.id,
        false,
        crypto.hashObj(account),
        account.timestamp,
        account
      );

      wrappedAccounts.push(wacc);

      if (wrappedAccounts.length >= maxRecords) return wrappedAccounts;
    }
    return wrappedAccounts;
  },
```

#### updateAccountFull
The [updateAccountFull](../api/interface/setup/updateAccountFull) function is used to update an account in our application's database. It provides three arguments.

- `wrappedState` - the wrapped data of the account to update
- `localCache` - your local application cache
- `applyResponse` - the response object generated from the `apply` function

Grab the `accountId`, `accountCreated`, and `data` fields from `wrappedState` and put them into separate variables. Create two more variables, `hashBefore` and `hashAfter`: `hashBefore` should be the account's current hash, and `hashAfter` will be calculated using the `crypto` module. Then update the account hash using `hashAfter` and your database with the new account like so:

```js
  updateAccountFull(wrappedState, localCache, applyResponse) {
    console.log('==> updateAccountFull');
    const {accountId, accountCreated} = wrappedState;
    const updatedAccount = wrappedState.data;

    const hashBefore = accounts[accountId]
      ? crypto.hashObj(accounts[accountId])
      : '';

    const hashAfter = crypto.hashObj(updatedAccount);

    accounts[accountId] = updatedAccount;

    dapp.applyResponseAddState(
      applyResponse,
      updatedAccount,
      localCache,
      accountId,
      applyResponse.txId,
      applyResponse.txTimestamp,
      hashBefore,
      hashAfter,
      accountCreated
    );
  },
```
#### updateAccountPartial

We don't really need to worry about [updateAccountPartial()](../api/interface/setup/updateAccountPartial) for the sake of this application. Just use the following code which treats it the same as [updateAccountFull()](../api/interface/setup/updateAccountFull):

```javascript
updateAccountPartial (wrappedData, localCache, applyResponse) {
  console.log('==> updateAccountPartial');
  this.updateAccountFull(wrappedData, localCache, applyResponse);
}
```


#### getAccountDataByList
To implement [getAccountDataByList()](../api/interface/setup/getAccountDataByList), once again we need to use [createWrappedResponse()](../api/interface/createWrappedResponse).

1. Loop through the `addressList` passed in by Shardus.
2. Grab the account from our database associated with that address.
3. Wrap the account data using the `createWrappedResponse` function.
4. Add to a list of results that we return for Shardus.

```js

  getAccountDataByList(addressList) {
    console.log('==> getAccountDataByList');
    const wrappedAccounts = [];

    for (const address of addressList) {
      const account = accounts[address];

      if (!account) continue;

      const wacc = dapp.createWrappedResponse(
        account.id,
        false,
        crypto.hashObj(account),
        account.timestamp,
        account
      );
      wrappedAccounts.push(wacc);
    }
  },
```
#### getAccountDataByRange

[getAccountDataByRange()](../api/interface/setup/getAccountDataByRange) will look almost identical to [getAccountData](../api/interface/setup/getAccountData). The only difference in this function is that we add another range filter that looks for accounts with `timestamp` fields between the arguments `dateStart` and `dateEnd`. This is what it looks like:


```javascript
  getAccountDataByRange(
    accountStart,
    accountEnd,
    dateStart,
    dateEnd,
    maxRecords
  ) {
    console.log('==> getAccountDataByRange');
    const wrappedAccounts = [];

    const start = parseInt(accountStart, 16);
    const end = parseInt(accountEnd, 16);

    for (const account of Object.values(accounts)) {
      // Skip if not in account id range
      const id = parseInt(account.id, 16);
      if (id < start || id > end) continue;

      // Skip if not in timestamp range
      const timestamp = account.timestamp;
      if (timestamp < dateStart || timestamp > dateEnd) continue;

      const wrappedAccount = dapp.createWrappedResponse(
        account.id,
        false,
        crypto.hashObj(account),
        account.timestamp,
        account
      );

      wrappedAccounts.push(wrappedAccount);

      // Return results early if maxRecords reached
      if (wrappedAccounts.length >= maxRecords) return wrappedAccounts;
    }

    return wrappedAccounts;
  },
```

#### calculateAccountHash

As the name suggests, [calculateAccountHash()](../api/interface/setup/calculateAccountHash) is responsible for returning a new hash from the `account` that is passed in as an argument. We can easily do this using our [crypto](../tools/crypto-utils) module that we imported earlier. Use the following code to implement this function:

```javascript
calculateAccountHash(account) {
  console.log('==> calculateAccountHash');
  return crypto.hashObj(account);
}
```

#### resetAccountData

Shardus may need to restore previous account records to the node's database and, in order to do that, we provide `shardus.setup` with a function called [resetAccountData()](../api/interface/setup/resetAccountData).

<Callout emoji="💡" type="default">

All we need to do here is loop through the `accountBackupCopies` passed into the function. Grab the account from our database using the same backup copy ID, and set the account we grabbed from the copy.

</Callout>

Here's a working example of how this can be done:

```javascript
  resetAccountData(accountBackupCopies) {
    for (const recordData of accountBackupCopies) {
      const accountData = recordData.data
      accounts[accountData.id] = {...accountData}
    }
  },
```

#### close

[close()](../api/interface/setup/close) tells Shardus what to do on server shutdown or stop. Treat this as a callback function that gets triggered when a node shuts down. For the sake of this application, use the following to implement `close`.

```javascript
  close() {
    console.log('Shutting down...');
  },
```

## Start the App

Below the `setup` interface we just configured, call these two additional methods, [registerExceptionHandler()](../api/interface/registerExceptionHandler) and [start()](../api/interface/start), in order to start the server:

```javascript
// Registers the handler for errors
dapp.registerExceptionHandler();
// Starts the server
dapp.start();
```

That's just about it regarding how to setup a decentralized network using Shardus. Play around by adding more transaction types to your application and remember the `setup` functions that will need modification when doing so.

<Callout emoji="💡" type="default">

> _(these ones)_

```javascript
crack(tx) {}
apply (tx, wrappedStates) {}
getRelevantData (accountId, tx) {}
```

</Callout>

## Create CLI

We are going to be creating a `CLI` in order to interact with our server because it's _much_ faster than building a frontend.

<Callout emoji="🚨" type="error">

You _could_ use something like [Postman](https://www.postman.com/) and hit the inject endpoint with different transaction types for this example application, if you wanted to, since we aren't signing transactions yet. We will start signing transactions in our next [chat application](./chat-app-template) example.

</Callout>

### Import Modules

We are going to be using `fs`, `path`, `vorpal`, `got`, and `@shardus/crypto-utils` as our external dependencies for the CLI. First create `client.js` in the root directory of your project:

```sh
touch client.js
```

Now use the following code to load in all the dependencies at the top of your new file:

```javascript
const fs = require('fs')
const { resolve } = require('path')
const vorpal = require('vorpal')()
const got = require('got')
const crypto = require('@shardus/crypto-utils')

// Using this to hash names for wallet IDs
crypto.init('69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc')
```

### Creating our wallet file

We need a way to create and save wallet info in a file so that we can interact with different accounts and send tokens back and forth. We'll use `wallet.json` as the place to store this data. We will try to require the `wallet.json` file right after initializing the [crypto](../tools/crypto-utils) module. If we run into any errors, or if `wallet.json` doesn't exist yet, let's create it. Use the code below to set up your `wallet.json` file:

```javascript
const walletFile = resolve('./wallet.json')
let walletEntries = {}

try {
  walletEntries = require(walletFile)
} catch (e) {
  saveEntries(walletEntries, walletFile)
  console.log(`Created wallet file '${walletFile}'.`)
}
```

### Creating wallet entries

Let's create the functions needed to write an entry to the wallet file:

```javascript
function saveEntries (entries, file) {
  const stringifiedEntries = JSON.stringify(entries, null, 2)
  fs.writeFileSync(file, stringifiedEntries)
}

function createEntry (name, id) {
  if (typeof id === 'undefined' || id === null) {
    id = crypto.hash(name)
  }
  walletEntries[name] = String(id)
  saveEntries(walletEntries, walletFile)
  return id
}

console.log(`Loaded wallet entries from '${walletFile}'.`);
```

### Setting up our host for transactions

Create a variable, `host`, and several functions for simplifying the `vorpal` commands we are about to create like this:

```javascript
let host = process.argv[2] || 'localhost:9001'

function getInjectUrl () { return `http://${host}/inject` }
function getAccountsUrl () { return `http://${host}/accounts` }
function getAccountUrl (id) return `http://${host}/account/${id}` }

console.log(`Using ${host} as coin-app node for queries and transactions.`)
```

### Create API helper methods

Create three functions:

- `postJSON` - this is a wrapper around `got`, an HTTP request library, used in the next function
- `injectTx` - we'll use this for sending the transaction to the network
- `getAccountData` - we'll use this for querying account data

```javascript
async function postJSON (url, obj) {
  const response = await got(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  return response.body
}

async function injectTx (tx = {}) {
  tx = Object.assign({
    type: 'create',
    from: 'noone',
    to: 'someone',
    amount: 1,
    timestamp: Date.now()
  }, tx)
  try {
    const res = await postJSON(getInjectUrl(), tx)
    return res
  } catch (err) {
    return err.message
  }
}

async function getAccountData (id) {
  try {
    // If we pass in an id, get the account info for that id, otherwise get all the accounts
    const res = await got(typeof id !== 'undefined' && id !== null ? getAccountUrl(id) : getAccountsUrl())
    return res.body
  } catch (err) {
    return err.message
  }
}
```

### Create wallet commands

We need to create a few [vorpal](https://www.npmjs.com/package/vorpal) commands to help us create wallet entries. First, let's deal with `wallet create <name> [id]`, which will utilize `createEntry` to create a wallet.

```javascript
vorpal
  .command('wallet create <name> [id]', 'Creates a wallet with the given <name> and [id]. Makes [id] = hash(<name>) if [id] is not given.')
  .action(function (args, callback) {
    if (typeof walletEntries[args.name] !== 'undefined' && walletEntries[args.name] !== null) {
      this.log(`Walled named '${args.name} already exists.`)
      callback()
      return
    }
    const id = createEntry(args.name, args.id)
    this.log(`Created wallet '${args.name}': '${id}'.`)
    callback()
  })
```

Now create a `wallet list [name]` command that will show us the wallet info for a named wallet we created, or all the wallet info we have, if no `name` is passed as an argument:

```javascript
// COMMAND TO LIST ALL THE WALLET ENTRIES YOU HAVE LOCALLY
vorpal
  .command('wallet list [name]', 'Lists wallet for the given [name]. Otherwise, lists all wallets.')
  .action(function(args, callback) {
    let wallet = walletEntries[args.name]
    if (typeof wallet !== 'undefined' && wallet !== null) {
      this.log(`${JSON.stringify(wallet, null, 2)}`)
    } else {
      this.log(`${JSON.stringify(walletEntries, null, 2)}`)
    }
    callback()
  })
```

Next, create a `use <host>` command to allow us to quickly set the host node for queries and transactions. By default, we set this to `localhost:9001`, because that is usually the first node that becomes active in the network:

```javascript
// COMMAND TO SET THE HOST IP:PORT
vorpal
  .command('use <host>', 'Uses the given <host> as the coin-app node for queries and transactions.')
  .action(function(args, callback) {
    host = args.host
    this.log('Set ${args.host} as coin-app node for transactions.`)
    callback()
  })
```

### Create commands for transactions

Here, we create the commands used for transactions. Use the following code to implement your `tokens create` and `transfer` transaction commands, which can also create new wallets, if necessary:

```javascript
// COMMAND TO CREATE TOKENS FOR USER
vorpal
  .command('tokens create <amount> <to>', 'Creates <amount> tokens for the <to> wallet.')
  .action(function (args, callback) {
    let toId = walletEntries[args.to]
    if (typeof toId === 'undefined' || toId === null) {
      toId = createEntry(args.to)
      this.log(`Created wallet '${args.to}': '${toId}'.`)
    }
    injectTx({ type: 'create', from: '0'.repeat(32), to: toId, amount: args.amount }).then((res) => {
      this.log(res)
      callback()
    })
  })

// COMMAND TO TRANSFER TOKENS FROM ONE ACCOUNT TO ANOTHER
vorpal
  .command('tokens transfer <amount> <from> <to>', 'Transfers <amount> tokens from the <from> wallet to the <to> wallet.')
  .action(function (args, callback) {
    const fromId = walletEntries[args.from]
    if (typeof fromId === 'undefined' || fromId === null) {
      this.log(`Wallet '${args.from}' does not exist.`)
      this.callback()
    }
    let toId = walletEntries[args.to]
    if (typeof toId === 'undefined' || toId === null) {
      toId = createEntry(args.to)
      this.log(`Created wallet '${args.to}': '${toId}'.`)
    }
    injectTx({ type: 'transfer', from: fromId, to: toId, amount: args.amount }).then((res) => {
      this.log(res);
      callback();
    })
  })
```

### Create CLI command for querying data

Create a command to query account data by utilizing the `getAccountData` function we created earlier:

```javascript
vorpal
  .command('query [account]', 'Queries network data for the account associated with the given [wallet]. Otherwise, gets all network data.')
  .action(function (args, callback) {
    const accountId = walletEntries[args.account]
    this.log(`Querying network for ${accountId ?`'${args.account}' wallet data` : 'all data'}:`)
    getAccountData(accountId).then(res => {
      try {
        const parsed = JSON.parse(res)
        res = JSON.stringify(parsed, null, 2)
      } catch (err) {
        this.log('Response is not a JSON object')
      } finally {
        this.log(res)
        callback()
      }
    })
  })
```

### Show the CLI delimiter

`vorpal` requires you to call the `delimiter` and `show` methods at the end of the file in order to start things off:

```javascript
vorpal
  .delimiter('client$')
  .show()
```

## Interact

Now that everything has been set up to run a Shardus network, try some things out: interact by sending transactions and querying data.

### Server interaction (Single node)

> Start your server like this:

```sh
npm run start
# OR: yarn start
```

> When you wish to stop the server:

```sh
npm run stop
# OR: yarn stop
```

> When you wish to clean the logs:

```sh
npm run clean
# OR: yarn clean
```

> When you wish to clean the logs and restart the server:

```sh
npm run restart
# OR: yarn restart
```

### Server Interaction (Network of nodes)

> Create your instances folder for 3 nodes and start the network:

```sh
shardus create 3
```

> Stop the network:

```sh
shardus stop
```

> Clean the logs from the last network run:

```sh
shardus clean
```

> Restart a new network with the existing configuration:

```sh
shardus start
```

### CLI interaction

Start up the client by running:

```bash
node client.js
```

Interact with the network by trying out the commands you just implemented:

```sh
Created wallet file '/home/user/Code/shardus/applications/coin-app/wallet.json'.
Loaded wallet entries from '/home/user/Code/shardus/applications/coin-app/wallet.json'.
Using localhost:9001 as coin-app node for queries and transactions.

client$ wallet create test
Created wallet 'test': '8dd0703d47ddc3fbca22e7a6fe56a43ee130b48d00f251d4a15efac3a60976c6'.

client$ tokens create 100 test
{"success":true,"reason":"Transaction queued, poll for results."}

client$ query test
Querying network for 'test' wallet data:
{
  "id": "8dd0703d47ddc3fbca22e7a6fe56a43ee130b48d00f251d4a15efac3a60976c6",
  "timestamp": 1659523433489,
  "data": {
    "balance": 100
  }
}

client$ tokens create 100 test2
Created wallet 'test2': '0e2e88d8c86b2903311585d2e15f27339fcd16d6a59aeba28bf5775919370660'.
{"success":true,"reason":"Transaction queued, poll for results."}

client$ tokens transfer 50 test2 test
{"success":true,"reason":"Transaction queued, poll for results."}

client$ query test
Querying network for 'test' wallet data:
{
  "id": "8dd0703d47ddc3fbca22e7a6fe56a43ee130b48d00f251d4a15efac3a60976c6",
  "timestamp": 1659523640462,
  "data": {
    "balance": 150
  }
}
```

## Experiment

> That's all you really need to know in order to start creating **amazing** **decentralized** applications with Shardus. **Play around**, add your own spin on a decentralized application. Let us know how it goes, what you liked, what you didn't like. We are always open to feedback. We hope you enjoy this new and evolving landscape and continue to learn more advanced concepts and features 😋
