
import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Starting a Node.js project
Now that you have satisfied the prerequisites for the Shardus tech stack, you can start a Node.js project by doing the following.

## Switch Node version
Make sure that you are using the correct Node version by doing:
```
nvm use 18.16.0
```

## Starting a Node.js project
Create `package.json` by doing:
```
npm init
```

## Install node-gyp globally
To install `node-gyp`, please do:
```bash
npm i -g node-gyp
```

## Install the Shardus CLI
To install the Shardus CLI, please do:
```bash
npm i -g shardus
```

## Developing decentralized applications using Shardus
Developing decentralized applications on top of Shardus usually requires these four `npm` packages.

**Core Technology**
```bash
npm i @shardus/core
```

**Cryptographic helper functions**
```bash
npm i @shardus/crypto-utils
```

**For monitoring**
```bash
npm i @shardus/monitor-server
```

**Archive server**
```bash
npm i @shardus/archiver
```

## What's next
You can now develop your own decentralized applications. Don't know how?

<Callout emoji="❗" type="warning">
See the [getting started](../gettingstarted.md) section (if you haven't already)
</Callout>
