import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Quickstart

This guide will help you install a basic dApp built on top of the shardus
network. It'll walk you through installing, starting, and stopping both
single and multiple node networks, and interacting with the dApp.

## Installation


Start by cloning `Hello Shardus`:

```bash
git clone https://gitlab.com/shardus/applications/hello-shardus.git
```
Make sure that you have the correct node version which is `16.11.1`

```bash
nvm install 16.11.1
nvm use 16.11.1
```
Now that the correct node version is satisfied, go ahead and play with `hello-shardus` by doing
```bash
cd hello-shardus
npm install
# OR: yarn install
```

<Callout emoji="⚠️" type="error">
If you encounter major problems doing `npm run start` or `npm i`, check out this [guide](./installation/setup)
</Callout>

## Single node

Start the `seed-node-server`, `monitor-server`, and your `index.js` server:

```bash
npm start
# OR: yarn start
```

Interact with your `index.js` server:

```bash
npm run client

client$ help

  Commands:

    help [command...]            Provides help for a given command.
    exit                         Exits application.
    state                        Queries the network via a GET request to /state.
    set state <state> <account>  Injects a tx into the network via a POST request to /inject. Whatever
                                 account name you give it, this client will hash that to create a 32 byte
                                 hex string suitable for the server to use as an account address.
```

Stop the `seed-node-server` and `monitor-server`, and clean residual run files:

```bash
npm run stop && npm run clean
# OR: yarn stop && yarn clean
```

## Network of nodes

Create a local test network with multiple instances of your `index.js` server. In order to do that, we need `shardus-cli`, which is specifically designed to do this.
`shardus-cli` starts a network containing multiple nodes by reading main `js` file specified inside `package.json` in the current directory.

### Shardus cli
<Callout emoji="💡" type="default">
Make sure that you have the Shardus CLI tool installed globally by doing

```bash
npm install -g shardus
# OR: yarn global add shardus
```

</Callout>

### Create a network with specified number of nodes
To create a shardus network consisting of 3 nodes
```bash
shardus create 3
```

### Interact with your network:

```bash
npm run client
```

### Stopping and cleaning the network:
Everytime you make a code change, you need to restart the network. In order for a successful restart, you need to first stop the previously running network and clean the residual files it generated.
```bash
shardus stop
```
Clean databases and logs from the last run:

```bash
shardus clean
```
## Congratulations
Congratulations! You've successfully installed, launched, stopped, cleaned, and interacted with a Shardus network. You can now proceed to the next section to learn the finer details of how to develop decentralized applications with Shardus
