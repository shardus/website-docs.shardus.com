import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Getting Start
The goal of this section is to give you brief introduction to shardus by building a decentralized todo list app using shardus. We will start by setting up a tech stack on your machine.

The repository for this guide can be seen [here](https://gitlab.com/shardus/applications/d-todo-list)

## Prerequsites

<Callout emoji="!" type="warning">
Skip this entire step if you successfully followed [quickstart](./quickstart) section 
</Callout>

We need a set of tools with specific versions to successfully use `@shardus/core`. This tech stack include following.

- Node version 16.11.1
- Python3.9 (or latest)
- Rust

### Configuring node version
It is generally recommend to use `nvm` for node version management to anyone serious about nodejs development. Otherwise developers may need to install specific node version mannually. 

`nvm` tool allow you to switch quickly between different node versions.

To install `nvm` check [here](https://github.com/nvm-sh/nvm).

After installing nvm on the machine, developers may then be able to switch to specific `nvm` version by doing `nvm install 16.11.1` and `nvm use 16.11.1`.


### Configuring python3
Installing python on unix machine is fairly straight forward.

<Callout emoji="!" type="warning">
Skip this entire step if you successfully followed [quickstart](./quickstart) section 
</Callout>

For example to install python3 on arch linux:
```bash
sudo pacman -Sy python3.9
```
On Ubuntu:
```bash
sudo apt-get install python3.9
```
The exact command would differs from one linux system to another depending on what package management tools is being setup on the machine.

For windows users this would include downloading python binaries for windows and installing it. Same goes for mac systems.

### Configuring rust

<Callout emoji="!" type="warning">
Skip this entire step if you successfully followed [quickstart](./quickstart) section 
</Callout>

When installation of shardus core, npm compile rust libraries on the fly. Though in future we would make this go away by shipping with binaries eliminating rust having to be installed on developers machines'.

But until then, install rust by following instruction from [here](https://www.rust-lang.org/tools/install). Once you have `rustup` setup on your machine do -

```bash
rustup install stable
``` 

```bash
rustup default stable
```
For other systems see [this](https://forge.rust-lang.org/infra/other-installation-methods.html)

### Switch node version
Make sure using the correct node version by doing 
```
nvm use 16.11.1
```

## Let's start the project
Now that you have satisfied prerequsites for shardus tech stack you can now start nodejs project by doing the followings.

Create `package.json` by doing 
```
npm init
```

### Install required global packages
To install node-gyp, please do 
```bash
npm i -g node-gyp
```
To install shardus-cli please do
```bash
npm i -g shardus
```
### Install local packages
To install required packages to develop do -
```bash
npm install @shardus/core@2.5.3
npm install @shardus/crypto-utils@4.0.4
npm install got@9.6.0
npm install pm2@5.2.0
npm install vorpal@1.12.0
```
And do - 
```bash
npm install -D @shardus/archiver@3.2.4
npm install -D @shardus/monitor-server@2.0.3
npm install -D cross-env@7.0.3
npm install -D shelljs@0.8.5
npm install -D ts-node@10.7.0
npm install -D typescript@4.0.3
npm install -D yarpm@1.1.1
```
### Configuring npm scripts
Now that we have all we need let's develop the dapp. We will start by creating npm scripts. To do that let's create a folder call `scripts` inside the root directory.
We will create 3 major scripts for the project call `start.js` `stop.js` `clean.js` each would do what it said.

#### start.js
Populate the content of `/scripts/start.js` with following.
```js
const archiverPath = require.resolve('@shardus/archiver')
const monitorPath = require.resolve('@shardus/monitor-server')
const shell = require('shelljs')

console.log('archiverPath, monitorPath:', archiverPath, monitorPath)

async function main () {
  try {
    shell.exec(`yarpm run pm2 start --no-autorestart ${archiverPath}`)
    shell.exec(`yarpm run pm2 start --no-autorestart ${monitorPath}` )
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
This script initiate pm2 to start `archiver` and `monitor-server`. 
Archiver servers stored the full data of entire network where a node in a network would only store a fraction of it.
Monitor servers basically let up monitor the nodes coming in, joining, syncing or failing !!!.

#### stop.js
Populate the content of `/scripts/stop.js` with following.
```js
const shell = require('shelljs')

async function main () {
  try {
    shell.exec('yarpm run pm2 stop all')
    shell.exec('yarpm run pm2 kill')
  } catch (e) {
    console.log(e)
  }
}
main()
```
This script stop the process that `start.js` initiated.

#### clean.js
Populate the content of `/scripts/clean.js` with following.
```js
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
This script clean the residual files and folders left by `archiver` and `monitor-server`.

#### package.json
Lastly let's configure `package.json` to run our scripts. Populate `scripts` section of `package.json` with following.
```json
  "scripts": {
    "pm2": "cross-env PM2_HOME='./.pm2' pm2",
    "start": "node ./scripts/start.js && ts-node ./src/index.ts",
    "stop": "node ./scripts/stop.js",
    "clean": "node ./scripts/clean.js",
    "client": "ts-node ./src/client.ts",
    "test": "echo \"Error: no test specified\" && exit 1",
    "compile": "tsc"
  },
```
And configure main file to `./build/index.js`.

Your `package.json` should look like this
```json
{
  "name": "d-todo-list",
  "version": "1.0.0",
  "description": "A decentralized todo list app built on top of shardus to demostrate shardus",
  "main": "./build/index.js",
  "scripts": {
    "pm2": "cross-env PM2_HOME='./.pm2' pm2",
    "start": "node ./scripts/start.js && ts-node ./src/index.ts",
    "stop": "node ./scripts/stop.js",
    "clean": "node ./scripts/clean.js",
    "client": "ts-node ./src/client.ts",
    "test": "echo \"Error: no test specified\" && exit 1",
    "compile": "tsc"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@shardus/core": "2.5.3",
    "@shardus/crypto-utils": "4.0.4",
    "got": "9.6.0",
    "pm2": "5.2.0",
    "vorpal": "1.12.0"
  },
  "devDependencies": {
    "@shardus/archiver": "3.2.4",
    "@shardus/monitor-server": "2.0.3",
    "cross-env": "7.0.3",
    "shelljs": "0.8.5",
    "ts-node": "10.7.0",
    "typescript": "^4.0.3",
    "yarpm": "1.1.1"
  }
}
```
### tsconfig.json
This doesn't need to be exact, if you know what you're doing do whatever you feel like it, just make sure `outDir` is `build`.
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "build",
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmitOnError": false,
    "esModuleInterop": true,
    "resolveJsonModule" :true,
    "noImplicitReturns": false,
    "typeRoots": [
      "node_modules/@types"
    ]
  },
  "include": [
    "src/index.ts",
    "src/client.ts"
  ],
  "exclude": [
    "./node_modules"
  ]
}
```
### Adding application layer on top of shardus 
Create a folder named `src` inside root directory of our project and put `index.ts` inside it.

#### Import modules
At the top of our `/src/index.ts` file, import the following module
```ts
import {shardusFactory} from '@shardus/core';
import * as crypto from '@shardus/crypto-utils';
```
#### Seeding cryptographic functions
Let's initiate the cryptographic helper functions by providing 32-byte hex. More on `@shardus/crypto-utils` [here](tools/crypto-utils).
```ts
crypto.init('69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc');
```
#### Shardus configuration
Shardus have a set of configurations that you need to pass into `shardusFactory` to initialize shardus.
This configuration here tells the shardus the value of minimum node require to allow transaction is 1.

<Callout emoji="!" type="warning">
Setting `minNodesToAllowTxs` to `1` is insecure for productions. Depending on node joining mechanism you want to implement for your network, this value may varies.
</Callout>

```ts
const config = {
  server: {
    p2p: {
      minNodesToAllowTxs: 1,
    },
  },
};
```

Now that we have configuration ready let's initiate shardus by doing -
```ts
const dapp = shardusFactory(config);
```
#### Declaring Types
An account is a frame of data in a series of data called accounts. Or simply states.

Transaction is an act or request that result in change of state/account within the network.

```ts
type Account = {
  username: string;
  todo: string[];
  id: string;
  timestamp: number;
};

type Accounts = {
  [accountId: string]: Account;
};

type Transaction = {
  type: string;
  accountId?: string;
  username?: string;
  todo?: string[];
  timestamp: number;
};

type WrappedAccount = {
  data: Account;
  timestamp: number;
  stateId: string;
  accountId: string;
};

type WrappedAccounts = {
  [accountId: string]: WrappedAccount;
};
```
#### Database
For the simplicity of this guide we'll use a variable to act as our database to hold the accounts.
```ts
let accounts: Accounts = {}; // this is our database
```
#### Creating rest api endpoints
Shardus provides a few methods for creating API routes. 
[registerExternalPost](./api/interface/registerExternalPost) 
and [registerExternalGet](./api/interface/registerExternalGet) will be used here to create an API we can fetch data from.

We will have 3 rest api endpoints. 

`/inject` post request endpoint to inject transaction.

`/list/:id` get request endpoint to retrieve todo list of a user by providing its id. ID here simply is a hash of the username.

`/accounts` get request endpoint to retrieve entire database (our in-memory object) so you could have some insights on structure of `accounts`.

```ts
dapp.registerExternalPost('inject', (req, res) => {
  try {
    const response = dapp.put(req.body);
    res.json(response);
  } catch (e) {
    res.json(e);
  }
});
dapp.registerExternalGet('list/:id', (req, res) => {
  try {
    const id = req.params['id'];
    res.json(accounts[id]);
  } catch (e) {
    res.json(e);
  }
});
dapp.registerExternalGet('accounts', (req, res) => {
  try {
    res.json(accounts);
  } catch (e) {
    res.json(e);
  }
});
```
#### Shardus setup function
Shardus takes a set of setup [functions](./api/interface/setup/README) that require dapp developer to implement. They look like this.
```ts
dapp.setup({
  validate(tx) {},
  apply(tx, wrappedAccounts) {},
  crack(tx){},
  setAccountData(accountRecords) {},
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
We are now at most important part of this guide which is to implement these setup functions forming the application layer.

#### validate()
Start by implementing [validate](./api/interface/setup/validate) funcntion. The purpose of this function is to ensure certain requirements are met before allowing the transaction to get applied.

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

#### apply()
[apply()](./api/interface/setup/apply)is the function responsible for mutating your application state. 
This function is the only place where any change to the database (or the accounts object in this example) can occur. 
This is where we will use our `validate()` helper function we created earlier. 
If the transaction that comes in passes our validation function, we can apply this transaction to the state of our application. 
Within apply we must return an applyResponse that we can get by calling `dapp.createApplyResponse(txId, tx.timestamp)`, 
passing in the transaction id (the hash of the transaction object passed into apply), and the `timestamp` field from the transaction object. Use the following code as an example of how to implement this function:

<Callout emoji="💡" type="default">

Here's a more in depth explanation of [createApplyResponse](./api/interface/createApplyResponse)

</Callout>

```ts
  apply(tx: Transaction, wrappedAccounts: WrappedAccounts) {
    console.log('==> apply');
    switch (tx.type) {
      case 'add_todo': {
        const oldList = wrappedAccounts[tx.accountId].data.todo;
        wrappedAccounts[tx.accountId].data.todo = [...oldList, ...tx.todo];
        break;
      }
      case 'remove_todo': {
        const oldList = wrappedAccounts[tx.accountId].data.todo;

        // remove the lists
        tx.todo.map(el => {
          wrappedAccounts[tx.accountId].data.todo = oldList.filter(
            todo => todo === el
          );
        });
        break;
      }
    }
    return dapp.createApplyResponse(crypto.hashObj(tx), tx.timestamp);
  },
```

#### crack()
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

```ts
  crack(tx: Transaction) {
    console.log('==> crack');
    return {
      id: crypto.hashObj(tx),
      timestamp: tx.timestamp,
      keys: {
        sourceKeys: [tx.accountId],
        targetKeys: [tx.accountId],
        allKeys: [tx.accountId],
        timestamp: tx.timestamp,
      },
    };
  },
```
#### setAccountData()
After the `apply` function has doesn its duty [setAccountData](./api/interface/setup/setAccountData) will update our accounts object using a list of account records that shardus passes to this func.
Use the following code to implement this function.
```ts
  setAccountData(accountsToSet: Account[]) {
    console.log('==> setAccountData');
    accountsToSet.forEach(account => (accounts[account.id] = account));
  },
```

#### resetAccountData()
Shardus may need to restore previous account records to the node's database, and in order to do that we provide `shadus.setup` with a function called
[resetAccountData()](./api/interface/setup/resetAccountData).

<Callout emoji="!" type="warning">
All we need to do here is to loop through the `accountBackupCopies` passed into the function. Grab the account from our database using the same backup copy id, and set the account we grabbed from the copy.
</Callout>

Here's a working example of how this can be done
```ts
resetAccountData(accountBackupCopies) {
  for (const recordData of accountBackupCopies) {
    const accountData = recordData.data
    accounts[accountData.id] = {...accountData}
  }
}
```

#### deleteAccountData()
For [deleteAccountData()](./api/interface/setup/deleteAccountData), loop through the `addressList` passed in as an argument and delete the account in your database associated with each address. You can use the following code to accomplish this:
```ts
  deleteAccountData(addressList: string[]) {
    console.log('==> deleteAccountData');
    addressList.forEach(address => delete accounts[address]);
  },
```

#### deleteLocalAccountData()
The [deleteLocalAccountData()](./api/interface/setup/deleteLocalAccountData), loop through the `addressList` passed in as an argument and delete the account in your database associated with each address. You can use the following code to accomplish this:
 function is used to wipe everything thing in node's database, thus local account data. 
Use the following code to implement this function:
```ts
deleteLocalAccountData () {
  accounts = {}
}
```
#### getRelevantData()
`getRelevantData` is where we can create accounts. Of course if the account already exists, all we have left to do is return a `wrappedResponse` that we can get by calling the `createWrappedResponse` function exposed by shardus.

The following demonstrates an implementation of getRelevantData that will work for this basic application.
```ts
  getRelevantData(accountId, tx: Transaction) {
    console.log('==> getRelevantData');
    let account: Account = accounts[accountId];
    let accountCreated = false;

    if (!account) {
      account = {
        id: accountId,
        username: tx.username,
        todo: [],
        timestamp: tx.timestamp,
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
<Callout emoji="!" type="warning">
In more advanced applications, we will use multiple different account types. Shardus treats all data in the form of accounts, but these accounts can contain whatever data you want. Imagine a social networking application where you can write comments and posts. These types of data would exist on the network in the form of accounts, each with their own account id's, hashes, and timestamps. getRelevantData will be responsible for creating different accounts based on different transaction types.
</Callout>

#### getAccountData()

The `getAccountData` function is used by shardus to fetch a range of account data from our application's database. It provides three arguments.
- `accountStart` - The minimum account id from the range of accounts to fetch
- `accountEnd` - The maximum account id from the range of accounts to fetch
- `maxRecords` - The maximum number of accounts to fetch from database 

To implement this, loop through all the accounts in our database and add them to a list of results starting from accounts with id greater than `accountStart` up to accounts with id less than `accountEnd`. Wrap each account by using `createWrappedResponse` before adding it to the list of results.
```ts
  getAccountData(accountIdStart, accountIdEnd, maxRecords) {
    console.log('==> getAccountData');
    const wrappedAccounts: WrappedAccount[] = [];
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

#### getAccountDataByRange
`getAccountDataByRange` will look almost identical to `getAccountData`. 
The only difference in this function is that we add another range filter that looks for accounts with timestamp fields between the arguments tsStart and tsEnd. 
This is what it looks like:

```ts
  getAccountDataByRange(
    accountStart: string,
    accountEnd: string,
    dateStart: number,
    dateEnd: number,
    maxRecords: number,
  ) {
    console.log('==> getAccountDataByRange');
    const wrappedAccounts: WrappedAccount[] = [];

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
#### getAccountDataByList()
For implementing `getAccountDataByList`, Once again we need to use `createWrappedResponse`.

1. Loop throught the `addressList` passed in by shardus
2. Grab the account from our database associated with that address.
3. Wrap the account data using the `createWrappedResponse` function.
4. Add to a list of results that we return for shardus

```ts

  getAccountDataByList(addressList: string[]) {
    console.log('==> getAccountDataByList');
    const wrappedAccounts: WrappedAccount[] = [];

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
#### updateAccountFull()
The `updateAccountFull` function is used to update an account in our application's database. It provides three arguments.

1. `wrappedState` - The wrapped data of the account to update
2. `localCache` - Your local application cache
3. `applyResponse` - The response object generated from the `apply` function

Grab the `accountId`, `accountCreated`, and `data` fields from `wrappedState` and put them into seperate variables. Create two more variables `hashBefore` and `hashAfter` of the account. `hashBefore` should be the current account hash, and `hashAfter` will be calculated using the crypto module. Then update the account hash using `hashAfter` and your database with the new account like so:

```ts
  updateAccountFull(wrappedState, localCache: Account, applyResponse) {
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

#### updateAccountPartial()
We dont really need to worry about [updateAccountPartial](./api/interface/setup/updateAccountPartial) for the sake of this application. Just use the following code which treats it the same as [updateAccountFull](./api/interface/setup/updateAccountFull):
```ts

  updateAccountPartial(wrappedState, localCache: Account, applyResponse) {
    console.log('==> updateAccountPartial');
    this.updateAccountFull(wrappedState, localCache, applyResponse);
  },
```

#### calculateAccountHash

As the name suggests, [calculateAccountHash](./api/interface/setup/calculateAccountHash) is responsible for returning a new hash from the `account` that is passed in as an argument. We can easily do this using our [crypto module](../tools/crypto-utils) we imported earlier. First, reset the account hash to an empty `string` so that we know the hash will only change if the data from some other field on the `account` changed. Use the following code for implementing this function:

```ts

  calculateAccountHash(account: Account) {
    console.log('==> calculateAccountHash');
    return crypto.hashObj(account);
  },
```

#### close()

[close](./api/interface/setup/close) tells Shardus what to do on server shutdown or stop. Treat this as a callback function that gets triggered when a node shuts down. For the sake of this application, use the following to implement `close`.

```ts
close () {
  console.log('Shutting down...')
}
```

#### Start the shardus

Below the `setup` interface we just configured, call these two additional methods [registerExceptionHandler](./api/interface/registerExceptionHandler), and [start](./api/interface/start) in order to start the server:

```ts
// Registers the handler for errors
dapp.registerExceptionHandler();
// Starts the server
dapp.start();
```

That's just about it regarding how to setup a decentralized network using Shardus. Play around by adding more transaction types to your application and remember the `setup` functions that will need modification when doing so.

### Creating the client
We are going to be creating a `CLI` in order to interact with our server because it's _much_ faster than building a frontend.

<Callout emoji="!" type="warning">

You _could_ use something like [Postman](https://www.postman.com/) and hit the inject endpoint with different transaction types for this example application if you wanted to since we aren't signing transactions yet. We will start signing transactionsin one of our next [chat application](./chat-app-template.md) example.

</Callout>

#### create client.ts
Now that we have shardus server setup we'll interact with it by cool little cli app. To do that first create `client.ts` inside your `./src/`.

#### import modules
After you created an empty typescript file `./src/clients.ts`. Past following codes inside it.
```ts
const vorpal = require('vorpal')();
import * as got from 'got';
import * as crypto from '@shardus/crypto-utils';
```

#### Seeding cryptographic functions
This 32-byte hex you'd pass into must be the same as the one you specified when creating shardus server above.
Otherwise it will fail to understand each other.
```ts
crypto.init('69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc');
```
#### BASEURL
Since our shardus would sit on port `9001` of our `localhost`. Let's do 
```ts
const BASEURL = 'http://localhost:9001';
```
#### Transaction injector function
This function is a wrapper around `got` which is a HTTP request library allowing us to comfortably inject transactions.

```ts
async function inject(url, obj): Promise<string> {
  const response = await got.post(url, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(obj),
  });
  return response.body;
}
```
#### create todo add command
This function allow us to add todo lists associated with a username
```ts
vorpal
  .command(
    'todo add <list> <username>',
    'Add todo to your list associated with your username, Example `todo add "play game and have dinner" joe`'
  )
  .action(async (args, cb) => {
    const todo = args.list.split('and').map(el => {
      return el.trim();
    });

    const tx = {
      type: 'add_todo',
      accountId: crypto.hash(args.username),
      username: args.username,
      timestamp: Date.now(),
      todo: todo,
    };

    const API = BASEURL + '/inject';
    const res = await inject(API, tx);

    vorpal.log(JSON.parse(res));

    cb();
  });
```

#### create todo remove command
This functtion allow us to remove todo list(s) from a list associated with a username
```ts
vorpal
  .command(
    'todo remove <list> <username>',
    'Remove todo from your list associated with your username, Example `todo remove "play game and have dinner" joe`'
  )
  .action(async (args, cb) => {
    const todo = args.list.split('and').map(el => {
      return el.trim();
    });

    const tx = {
      type: 'remove_todo',
      accountId: crypto.hash(args.username),
      username: args.username,
      timestamp: Date.now(),
      todo: todo,
    };
    const API = BASEURL + '/inject';
    const res = await inject(API, tx);
    vorpal.log(JSON.parse(res));

    cb();
  });
```

#### create todo view command
This code allow us to view a todo list of a user in a resonable format.
```ts
vorpal
  .command('todo view <username>', 'View a list of todo for a specific user')
  .action(async (args, cb) => {
    const API = BASEURL + `/list/${crypto.hash(args.username)}`;
    const res = await got.get(API);
    const list = JSON.parse(res.body).todo;

    list.map((el, i) => {
      console.log(`${i + 1}.${el}`);
    });
    cb();
  });
```
#### Retrieve the database 
This code allow us to see entire `accounts` object acting as database in this project.
```ts
vorpal.command('state', 'Query the database').action(async (args, cb) => {
  const API = BASEURL + '/accounts';
  const res = await got.get(API);
  vorpal.log(JSON.parse(res.body));
  cb();
});
```
#### create a prompt
Every cli need a prompt, let's create one.
```ts
vorpal.delimiter('~input:').show();
```
See? as simple as that !! and this is all we need for our client

## Starting the network
We have server, and client, let's put that in action. When starting a shardus network we have two option 
- using `npm run start`
- using shardus cli

<Callout emoji="[x]" type="error">

only use one method at a time to start the network

</Callout>

### Using `npm run start`
This will start a network consist of only one node. Don't worry, earlier in this guide we set shardus configuration to allow us to do transaction with only one node in network.

To start a network with this method do -
```bash
npm run start
```
To stop the network - 
```bash
npm run stop
```
To clean the residual files and folders left by `npm run start`. please do -
```bash
npm run clean
```
To restart the network -
```bash
npm run stop && npm run clean && npm run start
```

### Using shardus cli to start the network
This method allows use to start a network consisting as many node as we want.
Since shardus cli read `package.json` to find `index.js` to start the nodes and our codes is in typescript, let's compile our code

To compile 
```bash
npm run compile
```
To start the network consisting 20 nodes.
```bash
shardus create-net 20
```

To stop the network -
```bash
shardus stop-net 
```

To clean residual folders and files, please do - 
```bash
shardus clean-net
```

## Interact with the network
To interact with the network let's start the client by doing `npm run client`. This will prompt you like this
```bash
~input:
```
Try typing `help`
```bash
~input: help

  Commands:

    help [command...]              Provides help for a given command.
    exit                           Exits application.
    todo add <list> <username>     Add todo to your list associated with your username, Example `todo add "play game and have dinner" joe`
    todo remove <list> <username>  Remove todo from your list associated with your username, Example `todo remove "play game and have dinner" joe`
    todo view <username>           View a list of todo for a specific user
    state                          Query the database
```
#### Adding todo list
```bash
~input: todo add "code and have dinner and sleep well" john
```
#### Viewing the list
To view the todo list of user john
```bash
~input: todo view john
```
Output will be:
```bash
1.code
2.have dinner
3.sleep well
```
#### Let's see what accounts database look like
To see all accounts do:
```bash
~input: state
```
Output:
```bash
{
  'b682e5326e0934c693c9ca334f69741c7492121592c04b9b76a6c28a2bbcc48a': {
    id: 'b682e5326e0934c693c9ca334f69741c7492121592c04b9b76a6c28a2bbcc48a',
    username: 'john',
    todo: [ 'code', 'have dinner', 'sleep well' ],
    timestamp: 1647083258912
  }
}
```
## What's next
We recommend to checkout this [guide](./exampes/coin-app-template) 
