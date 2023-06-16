import Callout from "nextra-theme-docs/callout"

# Coin App

This guide will show you how to create the most basic type of decentralized application using Shardus from scratch.

## Final Code

The final code for this app is available on GitLab, here: [gitlab.com/shardus/applications/coin-app-template](https://gitlab.com/shardus/applications/coin-app-template).

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
npm install deepmerge axios vorpal
# OR:
yarn add @shardus/core
yarn add @shardus/crypto-utils
yarn add deepmerge axios vorpal
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

Make sure you are using the Node `18.16.0`. If you are using a different node version than `18.16.0` you'll receive an error message that looks something like this when you run your application:

</Callout>

```sh
Error: Cannot find module '/home/user/code/shardus/applications/chat-app/node_modules/sqlite3/lib/binding/node-v72-linux-x64/node_sqlite3.node'
```

> If you get this error, you need to remove your `node_modules` folder and your package lockfile. Then, run `nvm use 18.16.0` and finally `npm install` (OR `yarn install`).

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

Paste the code below into your `start.js` file

```javascript
const execa = require('execa');

const archiverPath = require.resolve('@shardus/archiver');
const monitorPath = require.resolve('@shardus/monitor-server');

async function main() {
  try {
    await execa('yarpm', `run pm2 start --no-autorestart ${archiverPath}`.split(' '), { stdio: [0, 1, 2] });
    await execa('yarpm', `run pm2 start --no-autorestart ${monitorPath}`.split(' '), { stdio: [0, 1, 2] });
    console.log('\x1b[33m%s\x1b[0m', 'View network monitor at: '); // Yellow
    console.log('http://localhost:\x1b[32m%s\x1b[0m', '3000', '\n'); // Green
  } catch (e) {
    console.log(e);
  }
}
main();
```

Paste the code below into your `stop.js` file

```javascript
const execa = require('execa');

async function main() {
  try {
    await execa('yarpm', 'run pm2 stop all'.split(' '), { stdio: [0, 1, 2] });
    await execa('yarpm', 'run pm2 kill'.split(' '), { stdio: [0, 1, 2] });
  } catch (e) {
    console.log(e);
  }
}
main();
```

Paste the code below into your `clean.js` file

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

### Add `scripts` to package.json

Add `start`, `stop`, `clean`, and `restart` scripts to the scripts field in your `package.json` file like so:

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

## Setup Configuration

In your app's root directory, create a `config.json` file where our shardus [configuration parameters](../api/configuration/README) will go:

```sh
touch config.json
```

Paste the following code into `config.json`

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

You can learn more about the `shardus configuration` parameters [Here](../api/configuration)

</Callout>

## Create Server

In your app's root directory, create a new file `index.js` where our server code will go

```sh
touch index.js
```

### Import modules

At the top of our `index.js` file, import the following modules

```javascript
const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const shardus = require('@shardus/core');
const crypto = require('@shardus/crypto-utils');
```

First, initialize the [crypto module](../tools/crypto-utils) we required by passing in `'69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc'` as an argument to its `init` constructor function. This is the hash key that shardus utilizes internally, and the one we'll be using for all the demo examples. This will initialize the cryptographic hashing functions you will be using soon.

```javascript
crypto.init('69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc');
```

Next, paste the following code under `crypto.init`

```javascript
let config = { server: { baseDir: './' } };

const overwriteMerge = (target, source, options) => source;

if (fs.existsSync(path.join(process.cwd(), 'config.json'))) {
  const fileConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
  config = merge(config, fileConfig, { arrayMerge: overwriteMerge });
}

if (process.env.BASE_DIR) {
  const baseDirFileConfig = JSON.parse(fs.readFileSync(path.join(process.env.BASE_DIR, 'config.json')));
  config = merge(config, baseDirFileConfig, { arrayMerge: overwriteMerge });
  config.server.baseDir = process.env.BASE_DIR;
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
  );
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
  );
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
  );
}
```

This will pull in your `config.json` and overwrite it with some additional variables to make it work when running a network of nodes. It also configures dev tools like the `archive-server` and `monitor-server`

Now initialize your dapp by passing in your config to shardus

```javascript
const dapp = shardus(config);
```

## Setup Database

Here we will create a database to host all of the accounts in our network. For the sake of this simple example, we will use an object in memory. Create a variable to store the accounts and a constructor function for creating accounts.

```javascript
let accounts = {};

```

## Setup API

Shardus provides a few methods for creating API routes. [registerExternalPost](../api/interface/registerExternalPost) and [registerExternalGet](../api/interface/registerExternalGet) will be used here to create an API we can fetch data from.

<Callout emoji="⚠️" type="warning">

It's up to _you_ to define your own routes for what data from the network can be queried

</Callout>

All Shardus applications will use a `POST` route for injecting transactions. Here is what that looks like:

```javascript
dapp.registerExternalPost('inject', async (req, res) => {
  try {
    const result = dapp.put(req.body);
    res.json({
      result,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
```

<Callout emoji="💡" type="default">

When we implement the client side of our application, we will submit transactions using a `POST` request to this `inject` route we created. Shardus uses the [put](../api/interface/put) method to inject the transaction data into the network.

</Callout>

Now create some `GET` request endpoints so we can query data from our accounts. In this example, we provide one route for getting a single account, and the other for all accounts.

```javascript
dapp.registerExternalGet('account/:id', async (req, res) => {
  const id = req.params['id'];
  const account = accounts[id] || null;
  res.json({ account });
});

dapp.registerExternalGet('accounts', async (req, res) => {
  res.json({ accounts });
});
```

## Setup Shardus

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
Start by implementing [validate](../api/interface/setup/validate) funcntion. The purpose of this function is to ensure certain requirements are met before allowing the transaction to get applied.

<Callout emoji="⚠️" type="warning">

It is the app developer's responsibility to ensure that the network is secure by validating each transaction thoroughly

</Callout>

For this application, we will be demonstrating a todo list network where user can create a todo list tied to specific user. For the simplicity of this guide each user will add, remove the list of another user.
```ts
  validate(tx: Transaction) {
    console.log('==> validate');
    if (
      tx.accountId === undefined ||
      typeof tx.timestamp !== 'number' ||
      tx.type === undefined
    ) {
      return {
        success: false,
        reason: 'Critical Attributes missing',
      };
    }

    switch (tx.type) {
      case 'remove_todo': {
        if (!Array.isArray(tx.todo)) {
          return {
            success: false,
            reason: 'Todo list must be an array',
          };
        }
        return {
          success: true,
          reason: '',
        };
      }
      case 'add_todo': {
        if (!Array.isArray(tx.todo)) {
          return {
            success: false,
            reason: 'Todo list must be an array',
          };
        }
        return {
          success: true,
          reason: '',
        };
      }
    }
  },
```

#### apply

[apply](../api/interface/setup/apply) is the function responsible for mutating your application state. This function is the only place where any change to the database (or the `accounts` object in this example) can occur. This is where we will use our `validateTransaction` helper function we created earlier. If the transaction that comes in passes our validation function, we can apply this transaction to the state of our application. Within `apply` we must return an `applyResponse` that we can get by calling `dapp.createApplyResponse(txId, tx.timestamp)`, passing in the transaction id (the hash of the transaction object passed into apply), and the timestamp field from the transaction object. Use the following code as an example of how to implement this function:

<Callout emoji="💡" type="default">

Here's a more in depth explanation of [createApplyResponse](../api/interface/createApplyResponse)

</Callout>

```javascript
  apply(tx, wrappedStates){
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
The [crack()](./api/interface/setup/crack) function is responsible for parsing the public keys of the accounts being affected from this transaction, 
and returning a result object that resembles this: 
```ts
{ 
  sourceKeys: [tx.from], 
  targetKeys: [tx.to], 
  allKeys: [tx.from, tx.to], timestamp: tx.timestamp 
}
```
The `sourceKeys` property should contain the public key of the account that initiated the transaction, 
and the `targetKeys` property should contain the public key(s) of the account(s) being targeted. 
`allKeys` should contain all the `sourceKeys` and `targetKeys`. Use the following code as an example of how to implement this function:

```js
  crack(tx){
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

For [deleteAccountData](../api/interface/setup/deleteAccountData), loop through the `addressList` passed in as an argument and delete the account in your database associated with each address. You can use the following code to accomplish this:

```javascript
deleteAccountData (addressList) {
  console.log('==> deleteAccountData')
  for (const address of addressList) {
    delete accounts[address]
  }
}
```

#### deleteLocalAccountData

The [deleteLocalAccountData](../api/interface/setup/deleteLocalAccountData) function is used to wipe everything in the database. Use the following code to implement this function:

```javascript
deleteLocalAccountData () {
  accounts = {}
}
```

#### setAccountData

After the `apply` function has done its duty, [setAccountData](../api/interface/setup/setAccountData) will update our `accounts` object using a list of account records that Shardus passes to this function. Use the following code to implement this function:

```javascript
  setAccountData(accountsToSet) {
    console.log('==> setAccountData');
    accountsToSet.forEach(account => (accounts[account.id] = account));
  },
```

#### getRelevantData

[getRelevantData](../api/interface/setup/getRelevantData) is where we can create accounts. Of course if the account already exists, all we have left to do is return a `wrappedResponse` that we can get by calling the [createWrappedResponse](../api/interface/createWrappedResponse) function exposed by shardus.

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

In more advanced applications, we will use multiple different account types. Shardus treats all data in the form of accounts, but these accounts can contain whatever data you want. Imagine a social networking application where you can write comments and posts. These types of data would exist on the network in the form of accounts, each with their own account id's, hashes, and timestamps. `getRelevantData` will be responsible for creating different accounts based on different transaction types.

</Callout>

#### getAccountData

The `getAccountData` function is used by shardus to fetch a range of account data from our application's database. It provides three arguments.
- `accountIdStart` - The minimum account id from the range of accounts to fetch
- `accountIdEnd` - The maximum account id from the range of accounts to fetch
- `maxRecords` - The maximum number of accounts to fetch from database 

To implement this, loop through all the accounts in our database and add them to a list of results starting from accounts with id greater than `accountStart` up to accounts with id less than `accountEnd`. Wrap each account by using `createWrappedResponse` before adding it to the list of results.

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
The `updateAccountFull` function is used to update an account in our application's database. It provides three arguments.

1. `wrappedState` - The wrapped data of the account to update
2. `localCache` - Your local application cache
3. `applyResponse` - The response object generated from the `apply` function

Grab the `accountId`, `accountCreated`, and `data` fields from `wrappedState` and put them into seperate variables. Create two more variables `hashBefore` and `hashAfter` of the account. `hashBefore` should be the current account hash, and `hashAfter` will be calculated using the crypto module. Then update the account hash using `hashAfter` and your database with the new account like so:

```js
  updateAccountFull(wrappedState, localCache, applyResponse) {
    console.log('==> updateAccountFull');
    const {accountId, accountCreated} = wrappedState;
    const updatedAccount = wrappedState.data as Account;

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

We dont really need to worry about [updateAccountPartial](../api/interface/setup/updateAccountPartial) for the sake of this application. Just use the following code which treats it the same as [updateAccountFull](../api/interface/setup/updateAccountFull):

```javascript
updateAccountPartial (wrappedData, localCache, applyResponse) {
  this.updateAccountFull(wrappedData, localCache, applyResponse)
}
```


#### getAccountDataByList
For implementing `getAccountDataByList`, Once again we need to use `createWrappedResponse`.

1. Loop throught the `addressList` passed in by shardus
2. Grab the account from our database associated with that address.
3. Wrap the account data using the `createWrappedResponse` function.
4. Add to a list of results that we return for shardus

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

[getAccountDataByRange](../api/interface/setup/getAccountDataByRange) will look almost identical to [getAccountData](../api/interface/setup/getAccountData). The only difference in this function is that we add another range filter that looks for accounts with timestamp fields between the arguments `dateStart` and `dateEnd`. This is what it looks like:


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

As the name suggests, [calculateAccountHash](../api/interface/setup/calculateAccountHash) is responsible for returning a new hash from the `account` that is passed in as an argument. We can easily do this using our [crypto module](../tools/crypto-utils) we imported earlier. First, reset the account hash to an empty `string` so that we know the hash will only change if the data from some other field on the `account` changed. Use the following code for implementing this function:

```javascript
calculateAccountHash(account) {
  return crypto.hashObj(account)
}
```

#### resetAccountData

Shardus may need to restore previous account records to the node's database, and in order to do that we provide `shardus.setup` with a function called [resetAccountData](../api/interface/setup/resetAccountData).

<Callout emoji="💡" type="default">

All we need to do here is loop through the `accountBackupCopies` passed into the function. Grab the account from our database using the same backup copy id, and set the account we grabbed from the copy.

</Callout>

Here's a working example of how this can be done:

```javascript
resetAccountData(accountBackupCopies) {
  for (const recordData of accountBackupCopies) {
    const accountData = recordData.data
    accounts[accountData.id] = {...accountData}
  }
}
```

#### close

[close](../api/interface/setup/close) tells Shardus what to do on server shutdown or stop. Treat this as a callback function that gets triggered when a node shuts down. For the sake of this application, use the following to implement `close`.

```javascript
close () {
  console.log('Shutting down...')
}
```

## Start the App

Below the `setup` interface we just configured, call these two additional methods [registerExceptionHandler](../api/interface/registerExceptionHandler), and [start](../api/interface/start) in order to start the server:

```javascript
// Registers the handler for errors
dapp.registerExceptionHandler();
// Starts the server
dapp.start();
```

That's just about it regarding how to setup a decentralized network using Shardus. Play around by adding more transaction types to your application and remember the `setup` functions that will need modification when doing so.

<Callout emoji="💡" type="default">

> _THESE_

```javascript
crack(tx) {}
apply (tx, wrappedStates) {}
getKeyFromTransaction (tx) {}
getRelevantData (accountId, tx) {}
```

</Callout>

## Create CLI

We are going to be creating a `CLI` in order to interact with our server because it's _much_ faster than building a frontend.

<Callout emoji="🚨" type="error">

You _could_ use something like [Postman](https://www.postman.com/) and hit the inject endpoint with different transaction types for this example application if you wanted to since we aren't signing transactions yet. We will start signing transactions in our next [chat application](./chat-app-template) example.

</Callout>

### Import Modules

We are going to be using `fs`, `path`, `vorpal`, `axios`, and `@shardus/crypto-utils` as our external dependencies for the CLI. First create `client.js` in the root directory of your project:

```sh
touch client.js
```

Now use the following code to load in all the dependencies at the top of your new file:

```javascript
const fs = require('fs');
const { resolve } = require('path');
const vorpal = require('vorpal')();
const crypto = require('@shardus/crypto-utils');
const stringify = require('fast-stable-stringify');
const axios = require('axios');

// Using this to hash name's for wallet id's
crypto.init('69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc');
```

### Creating our wallet file

We need a way to create and save wallet info in a file so that we can interact with different accounts and send tokens back and forth. We'll use `wallet.json` as the place to store this data. We will try to require the `wallet.json` file right after initializing the [crypto](../tools/crypto-utils) module. If we run into any errors, or if `wallet.json` doesn't exist yet, let's create it. Use the code below to setup your `wallet.json` file:

```javascript
const walletFile = resolve('./wallet.json');
let walletEntries = {};

const saveEntries = (entries, file) => {
  const stringifiedEntries = JSON.stringify(entries, null, 2);
  fs.writeFileSync(file, stringifiedEntries);
};

try {
  walletEntries = require(walletFile);
} catch (e) {
  saveEntries(walletEntries, walletFile);
  console.log(`Created wallet file '${walletFile}'.`);
}
```

### Creating wallet entries

let's create a function called `createAccount` by utilizing our `crypto` module. All we need to do is return an object with a public and private keypair that we can get from calling `generateKeypair` on the `crypto` module:

```javascript
function createAccount(keys = crypto.generateKeypair()) {
  return {
    address: keys.publicKey,
    keys,
  };
}
```

Next up, we'll create the function to write an entry to the wallet file using the `createAccount` function to generate the keypair:

```javascript
// Creates an account with a keypair and adds it to the clients walletFile
function createEntry(name, id) {
  const account = createAccount();
  if (typeof id === 'undefined' || id === null) {
    id = crypto.hash(name);
  }
  account.id = id;
  walletEntries[name] = account;
  saveEntries(walletEntries, walletFile);
  return account;
}
```

### Setting up our host for transactions

Create two variables `USER` and `HOST` for simplifying the vorpal commands we are about to create like this:

```javascript
let USER;
let HOST = process.argv[2] || 'localhost:9001';
console.log(`Loaded wallet entries from '${walletFile}'.`);
console.log(`Using ${HOST} as coin-app node for queries and transactions.`);
```

### Create _API_ helper methods

Create two functions:

1. `injectTx`: We'll use this for sending the transaction to the network
2. `getAccountData`: We'll use for querying account data

```javascript
async function injectTx(tx) {
  try {
    const res = await axios.post(`http://${HOST}/inject`, tx);
    return res.data;
  } catch (err) {
    return err.message;
  }
}

async function getAccountData(id) {
  try {
    // If we pass in an id, get the account info for that id, otherwise get all the accounts
    const res = await axios.get(`http://${HOST}/${id ? 'account/' + id : 'accounts'}`);
    return res.data;
  } catch (err) {
    return err.message;
  }
}
```

### Create wallet commands

We need to create a few [vorpal](https://www.npmjs.com/package/vorpal) commands to help us create wallet entries. First lets deal with `wallet create <name>`, which will utilize `createEntry` and help us set our `USER` account for submitting transactions.

```javascript
// COMMAND TO CREATE A LOCAL WALLET KEYPAIR
vorpal.command('wallet create <name>', 'creates a wallet <name>').action(function(args, callback) {
  if (typeof walletEntries[args.name] !== 'undefined' && walletEntries[args.name] !== null) {
    return walletEntries[args.name];
  } else {
    const user = createEntry(args.name, args.id);
    return user;
  }
});
```

Now create a `wallet list [name]` command that will show us the wallet info for a named wallet we created, or all the wallet info we have if no `[name]` is passed as an argument:

```javascript
// COMMAND TO LIST ALL THE WALLET ENTRIES YOU HAVE LOCALLY
vorpal.command('wallet list [name]', 'lists wallet for [name]. Otherwise, lists all wallets').action(function(args, callback) {
  const wallet = walletEntries[args.name];
  if (typeof wallet !== 'undefined' && wallet !== null) {
    this.log(wallet);
  } else {
    this.log(walletEntries);
  }
  callback();
});
```

Next, create a `use <name>` command that quickly allows us to switch wallets for sending transactions:

```javascript
vorpal.command('use <name>', 'uses <name> wallet for transactions').action(function(args, callback) {
  USER = vorpal.execSync('wallet create ' + args.name);
  this.log('Now using wallet: ' + args.name);
  callback();
});
```

Now create a command to allow us to quickly set the host node for queries and transactions. By default, we set this to `localhost:9001` because that is usually the first node that becomes active in the network:

```javascript
// COMMAND TO SET THE HOST IP:PORT
vorpal.command('use host <host>', 'uses <host> as the node for queries and transactions').action(function(args, callback) {
  HOST = args.host;
  this.log(`Setting ${args.host} as node for queries and transactions.`);
  callback();
});
```

### Create commands for transactions

Using vorpal's prompt feature, we can prompt the user with questions to set the amounts we'll send with the transactions. Use the following code to implement your `create` and `transfer` transaction commands:

```javascript
// COMMAND TO CREATE TOKENS FOR USER
vorpal.command('create', 'submits a create transaction').action(async function(args, callback) {
  const answers = await this.prompt({
    type: 'number',
    name: 'amount',
    message: 'Enter number of tokens to create: ',
    default: 100,
    filter: (value) => parseInt(value),
  });
  const tx = {
    type: 'create',
    from: USER.address,
    to: USER.address,
    amount: answers.amount,
    timestamp: Date.now(),
  };
  injectTx(tx).then((res) => {
    this.log(res);
    callback();
  });
});

// COMMAND TO TRANSFER TOKENS FROM ONE ACCOUNT TO ANOTHER
vorpal.command('transfer', 'transfers tokens to another account').action(async function(_, callback) {
  const answers = await this.prompt([
    {
      type: 'input',
      name: 'target',
      message: 'Enter the target account: ',
    },
    {
      type: 'number',
      name: 'amount',
      message: 'How many tokens do you want to send: ',
      default: 50,
      filter: (value) => parseInt(value),
    },
  ]);
  const to = walletEntries[answers.target].address;
  if (!to) {
    this.log(`No wallet entry for ${answers.target}`);
    callback();
    return;
  }
  const tx = {
    type: 'transfer',
    from: USER.address,
    to: to,
    amount: answers.amount,
    timestamp: Date.now(),
  };
  injectTx(tx).then((res) => {
validateTransaction (tx) {}
validateTxnFields(tx) {}
validateTransaction (tx) {}
validateTxnFields(tx) {}
    this.log(res);
    callback();
  });
});
```

<Callout emoji="🚨" type="error">

Every transaction we send to Shardus needs to have a `timestamp` field associated with it. Make sure you set the current time as a `timestamp` field on every transaction you send to the network.

</Callout>

### Create CLI command for querying data

Create a command to query account data by utilizing the `getAccountData` function we created earlier:

```javascript
vorpal
  .command('query [account]', 'Queries network data for the account associated with the given [wallet]. Otherwise, gets all network data.')
  .action(async function(args, callback) {
    let address;
    if (args.account !== undefined) address = walletEntries[args.account].address;
    this.log(`Querying network for ${address ? args.account : 'all data'} `);
    const data = await getAccountData(address);
    this.log(data);
    callback();
  });
```

### Create an initialization command

Use this command for prompting the user to create a wallet when they run the CLI. This makes using the CLI very fluid and easy:

```javascript
vorpal.command('init', 'sets the user wallet if it exists, else creates it').action(function(_, callback) {
  this.prompt(
    {
      type: 'input',
      name: 'user',
      message: 'Enter wallet name: ',
    },
    (result) => {
      callback(null, vorpal.execSync('wallet create ' + result.user));
    }
  );
});
```

### Show the CLI delimiter

`vorpal` requires you to call the `delimiter` and `show` methods at the end of the file in order to start things off. We're also going to execute the `init` command we created in the last step in order to initialize our `USER` variable:

```javascript
vorpal.delimiter('>').show(); // Displays ">" for the delimiter
vorpal.exec('init').then((res) => (USER = res)); // Set's USER variable
```

## Interact

Now that everything has been setup to run a Shardus network, try some things out, interact by sending transactions and querying data.

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

> Create your instances folder for 3 nodes and start the network

```sh
shardus create 3
```

> Stop the network

```sh
shardus stop
```

> Clean the logs from the last network run

```sh
shardus clean
```

> Restart a new network with existing configuration

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
>
Enter wallet name: test

> create
Enter number of tokens to create: 100
{
  result: { success: true, reason: 'Transaction queued, poll for results.' }
}

> query test
Querying network for test
{
  account: {
    id: '43ed1c999a5c8d2d669d69bb541e88b0e942b14b0e6a42300161bf2a48f39e7b',
    data: { balance: 100 },
    hash: '55e33e1884d89cc4c54e464a33c50a775a419eed935e7df93d418079536230af',
    timestamp: 1597885874784
  }
}

> use test2
Now using wallet: test2

> create
Enter number of tokens to create: 100
{
  result: { success: true, reason: 'Transaction queued, poll for results.' }
}

> transfer
Enter the target account: test
How many tokens do you want to send: 50
{
  result: { success: true, reason: 'Transaction queued, poll for results.' }
}

> query test
Querying network for test
{
  account: {
    id: '43ed1c999a5c8d2d669d69bb541e88b0e942b14b0e6a42300161bf2a48f39e7b',
    data: { balance: 150 },
    hash: '2e78ec33cad106d9659bea8957095c8d135439dbaf6915eeb2758a9e6f00d2a2',
    timestamp: 1597885910643
  }
}
```

## Experiment

> That's all you really need to know in order to start creating **amazing** **decentralized** applications with Shardus. **Play around**, add your own spin on a decentralized application. Let us know how it goes, what you liked, what you didn't like. We are always open to feedback. We hope you enjoy this new and evolving landscape and continue to learn more advanced concepts and features 😋
