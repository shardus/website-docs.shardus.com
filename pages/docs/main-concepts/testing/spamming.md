# Spamming

## Spam a single node on Shardus

1. Install project dependencies:

```bash
npm install
# OR
yarn install
```

2. Start the network with a single node:

```bash
npm run start
# OR
yarn start
```

3. Create a `spam` command in `client.js` to spam the node:

```typescript
vorpal
  .command('tokens spam create <amount> <to> <seconds> <tps>', 'Spams the network with create token transactions')
  .action(function(args, callback) {
    let spam = setInterval(() => {
      for (let i = 0; i < args.tps; i++) {
        injectTx({
          type: 'create',
          from: '0'.repeat(32),
          to: walletEntries[args.to],
          amount: args.amount,
          timestamp: Date.now(),
        });
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(spam);
      callback();
    }, 1000 * args.seconds);
  });
```

4. Run the client:

```bash
node client.js
```

5. Use the wallet create command to initialize a named wallet:

```bash
wallet create myWallet
```

6. Run the spam command to spam the single node:

```bash
tokens spam create 100 myWallet 20 20
```

7. Visit _localhost:3000_ in your browser to view the incoming network transactions.

## Spamming a network of nodes

Spamming a network of nodes on Shardus gets a bit more complicated. It requires our spam client to acquire a list of node IP addresses and ports from the seed node server, and rapidly generate transactions.

Start by creating a CLI command to spam the network with any given transaction type:

```ts
vorpal
  .command(
    'spam transactions <type> <accounts> <count> <tps>',
    'spams the network with <type> transactions <count> times, with <account> number of accounts, at <tps> transactions per second'
  )
  .action(async function(args, callback) {
    const accounts = createAccounts(args.accounts);
    const txs = makeTxGenerator(accounts, args.count, args.type);
    const seedNodes = await getSeedNodes();
    const ports = seedNodes.map((url) => url.port);
    await spamTxs({
      txs,
      rate: args.tps,
      ports: ports,
      saveFile: 'spam-test.json',
    });
    this.log('Done spamming...');
    callback();
  });
```

> This command will allow us to spam `count` transactions of whatever `type` of transaction we pass in, using `account` number of accounts, at a rate of `tps` transactions per second.

Now let's implement the 4 functions we defined in the `spam` command to make it work.

## createAccounts

This function needs to create an arbitrary number of accounts, each with their own key pairs, in order to be able to sign the transactions. Define two more functions here, one for creating a single account, and one that uses the single `createAccount` function to create an arbitrary number of accounts: `createAccounts`. You will need to import the `crypto` module in order to generate key pairs.

```ts
const crypto = require('shardus-crypto-utils');
crypto('64f152869ca2d473e4ba64ab53f49ccdb2edae22da192c126850970e788af347');

function createAccount(keys = crypto.generateKeypair()) {
  return {
    address: keys.publicKey,
    keys,
  };
}

function createAccounts(num) {
  // Create an empty array of size (num) and map it to a list of account keypairs
  const accounts = new Array(num).fill().map((account) => createAccount());
  return accounts;
}
```

## makeTxGenerator

Create a function called `makeTxGenerator` that implements a generator function called `buildGenerator`. `buildGenerator` should loop through all the accounts passed in, generate `create` transactions so they have tokens to transfer, and then generate whatever transaction `type` was passed in. Use a `while` loop to iterate through each account until the number of transactions generated is equivalent to the `total` value passed in by the CLI command.

```ts
function makeTxGenerator(accounts, total = 0, type) {
  function* buildGenerator(txBuilder, accounts, total, type) {
    let account1, offset, account2;
    while (total > 0) {
      // Keep looping through all available accounts as the srcAcct
      account1 = accounts[total % accounts.length];
      // Pick some other random account as the tgtAcct
      offset = Math.floor(Math.random() * (accounts.length - 1)) + 1;
      account2 = accounts[(total + offset) % accounts.length];

      // Return a create tx to add funds to the srcAcct
      yield txBuilder({ type: 'create', to: account1, amount: 1 });

      switch (type) {
        case 'transfer': {
          yield txBuilder({
            type: 'transfer',
            from: account1,
            to: account2,
            amount: 1,
          });
          break;
        }
        case 'message': {
          const message = stringify({
            body: 'spam1234',
            timestamp: Date.now(),
            handle: account1,
          });
          yield txBuilder({
            type: 'message',
            from: account1,
            to: account2,
            message: message,
            amount: 1,
          });
          break;
        }
        case 'toll': {
          yield txBuilder({
            type: 'toll',
            from: account1,
            toll: Math.ceil(Math.random() * 1000),
            amount: 1,
          });
          break;
        }
        default: {
          console.log('Type must be `transfer`, `message`, or `toll`');
        }
      }
      total--;
      if (!(total > 0)) break;
    }
  }
  const generator = buildGenerator(buildTx, accounts, total, type);
  generator.length = total;
  return generator;
}
```

Now, create the `buildTx` function that we passed into `buildGenerator` inside of `makeTxGenerator`. Build the actual transaction according to the type and what needs to be sent with that type of transaction, then sign the transaction with the account keys passed in (`from` and `to`).

```ts
function buildTx({ type, from, to, amount, message, toll }) {
  let actualTx;
  switch (type) {
    case 'create': {
      actualTx = {
        type: type,
        srcAcc: '0'.repeat(64),
        tgtAcc: to.address,
        amount: Number(amount),
        timestamp: Date.now(),
      };
      break;
    }
    case 'transfer': {
      actualTx = {
        type: type,
        srcAcc: from.address,
        timestamp: Date.now(),
        tgtAcc: to.address,
        amount: Number(amount),
      };
      break;
    }
    case 'message': {
      actualTx = {
        type: type,
        srcAcc: from.address,
        tgtAcc: to.address,
        message: message,
        amount: Number(amount),
        timestamp: Date.now(),
      };
      break;
    }
    case 'toll': {
      actualTx = {
        type: type,
        srcAcc: from.address,
        toll: toll,
        amount: Number(amount),
        timestamp: Date.now(),
      };
      break;
    }
    default: {
      console.log('Type must be `transfer`, `message`, or `toll`');
    }
  }
  if (from.keys) {
    crypto.signObj(actualTx, from.keys.secretKey, from.keys.publicKey);
  } else {
    crypto.signObj(actualTx, to.keys.secretKey, to.keys.publicKey);
  }
  return actualTx;
}
```

## getSeedNodes

Create a function called `getSeedNodes` that grabs a list of node addresses from the seed node server. Make a `GET` request to the URL where your seed node server is running at the route `/api/seednodes`.

> Since I'm testing this on a network locally in my CLI spam command, I only need to map the port numbers returned from this function; however, this will return an array of seed node objects in this form:
> `[{"ip": "127.0.0.1", "port": 9001 }, {"ip": "127.0.0.1", "port": 9002 } ...]`
> So you can use the data from this seed node server to grab the IP addresses of the nodes as well.

```ts
async function getSeedNodes() {
  const res = await axios.get(`http://localhost:4000/api/seednodes`);
  const { seedNodes } = res.data;
  return seedNodes;
}
```

## spamTxs

Now, implement the `spamTxs` function that actually spams the network with transactions. Additionally, you should implement write streams if you wish to log the sent transactions to a file for debugging purposes.

```ts
const fs = require('fs');
const path = require('path');

async function spamTxs({ txs, rate, ports = [], saveFile = true, verbose = false }) {
  if (!Array.isArray(ports)) ports = [ports];

  console.log(`Spamming ${ports.length > 1 ? 'ports' : 'port'} ${ports.join()} with ${txs.length ? txs.length + ' ' : ''}txs at ${rate} TPS...`);

  const writeStream = saveFile ? fs.createWriteStream(path.join(baseDir, saveFile)) : null;

  const promises = [];
  let port;
  let count = 0;

  for (const tx of txs) {
    if (writeStream) writeStream.write(JSON.stringify(tx, null, 2) + '\n');
    port = ports[Math.floor(Math.random() * ports.length)];
    promises.push(sendTx(tx, port, verbose));
    count++;
    await _sleep((1 / rate) * 1000);
  }

  if (writeStream) writeStream.end();
  console.log();

  await Promise.all(promises);
  console.log('Done spamming');

  if (writeStream) {
    await new Promise((resolve) => writeStream.on('finish', resolve));
    console.log(`Wrote spammed txs to '${saveFile}'`);
  }
}
```

Lastly, let's implement the `sendTx` and `_sleep` functions used by `sendTxs`.
`sendTx` will just make a `POST` request to the server.
`_sleep` will ensure the number of transactions sent doesn't exceed the `tps` argument passed in by the CLI.

```ts
async function sendTx(tx, port = null, verbose = false) {
  if (!tx.sign) {
    tx = buildTx(tx);
  }
  if (verbose) {
    console.log(`Sending tx to ${port}...`);
    console.log(tx);
  }
  const { data } = await axios.post(`http://localhost:${port}/inject`, tx);
  if (verbose) console.log('Got response:', data);
  return data;
}

async function _sleep(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```
