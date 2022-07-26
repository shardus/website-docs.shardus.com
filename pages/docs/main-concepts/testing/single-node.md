# Single Node

When building applications with Shardus, it's useful to test using a single node just to get things working. Running a single node will let you test much faster because you don't have to wait for other nodes to sync up. Once you have your application [transactions](../development/transactions/README) implemented, you should start testing with a [network of nodes](./network-of-nodes).

> In order to test using a single node, you will need to create scripts that spin up the [archive-server](../../tools/archive-server) and [monitor-server](../../tools/monitor-server). There's also a section in the [Coin App](../../examples/coin-app-template) example that goes over setting up the scripts.

## Install Dependencies

> Dependencies

```bash
npm install @shardus/core
npm install @shardus/crypto-utils
npm install deepmerge
# OR:
yarn add @shardus/core
yarn add @shardus/crypto-utils
yarn add deepmerge
```

> Dev Dependencies

```bash
npm install -D @shardus/archiver
npm install -D @shardus/monitor-server
npm install -D cross-env execa pm2 shelljs yarpm
# OR:
yarn add -D @shardus/archiver
yarn add -D @shardus/monitor-server
yarn add -D cross-env execa pm2 shelljs yarpm
```

## Create scripts

Create a `scripts` directory in the root of your project. Create 3 script files that will help start, stop, and clean a single node network:

```bash
mkdir scripts && cd scripts
touch start.js stop.js clean.js
```

Copy this code into your `start.js` file:

```javascript
const execa = require('execa');

const archiverPath = require.resolve('@shardus/archiver');
const monitorPath = require.resolve('@shardus/monitor-server');

async function main() {
  try {
    await execa('yarpm', `run pm2 start --no-autorestart ${archiverPath}`.split(' '), { stdio: [0, 1, 2] });
    await execa('yarpm', `run pm2 start --no-autorestart ${monitorPath}`.split(' '), { stdio: [0, 1, 2] });
    console.log();
    console.log('\x1b[33m%s\x1b[0m', 'View network monitor at:'); // Yellow
    console.log('  http://localhost:\x1b[32m%s\x1b[0m', '3000'); // Green
    console.log();
  } catch (e) {
    console.log(e);
  }
}
main();
```

Copy this code into your `stop.js` file:

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

Copy this code into your `clean.js` file:

```javascript
const { rm } = require('shelljs');

async function main() {
  try {
    rm('-rf', './.pm2 ./db ./logs ./statistics.tsv'.split(' '));
    rm('-rf', './archiver-db.sqlite'.split(' '));
  } catch (e) {
    console.log(e);
  }
}
main();
```

## Add scripts to `package.json`

Add `start`, `stop`, `clean`, and `restart` scripts to the `scripts` field of your `package.json` like so:

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

## Test

Once you have the necessary scripts set up, you can start running your tests with the following command:

```bash
npm run start
# OR
yarn start
```

When you finish running your test, run the `stop` and `clean` scripts:

```bash
npm run stop && npm run clean
# OR
yarn stop && yarn clean
```
