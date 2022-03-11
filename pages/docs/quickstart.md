import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Quickstart

This guide will help you install a basic dapp built on top of the shardus
network. It'll walk you through installation, starting and stopping both
single and multiple node networks, and interacting with the dapp.

## Installation

<Callout emoji="⚠️" type="error">
For the time being, you need to have the rust [build toolchain](https://www.rust-lang.org/tools/install)
installed locally to run shardus.
</Callout>

Start by cloning `Hello Shardus`:

```bash
git clone https://gitlab.com/shardus/applications/hello-shardus.git
```
Make sure you have the correct node version which is `16.11.1`

```bash
nvm install 16.11.1
nvm use 16.11.1
```
Now that correct node version is satisfied, go ahead and play with `hello-shardus`by doing
```bash
cd hello-cloud
npm install
# OR: yarn install
```

## Single node

Start the `seed-node-server`, `monitor-server`, and your `index.ts` server:

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

Create a local test network with multiple instances of your `index.js` server. In order to do that we need `shardus-cli` specifically design to do this.
`shardus-cli` start a network containing multiple nodes by reading main `js` or `ts` entry described inside `package.json` in current directory.

### Shardus cli
<Callout emoji="💡" type="default">
Make sure you have the Shardus CLI tool installed globally by doing

```bash
npm install -g shardus
# OR: yarn global add shardus
```

</Callout>

### Create a network with specified number of nodes
To create a shardus network consist of 3 node
```bash
shardus create 3
```

### Interact with your network:

```bash
npm run client
```

### Stopping and cleaning the network:
Everytime you make a code change you need to restart network, in order for successful restart you need to first stop the previously running network and cleaning the residual files it generate.
```bash
shardus stop
```
Clean databases and logs from the last run:

```bash
shardus clean
```
