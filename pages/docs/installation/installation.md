
import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Starting a nodejs project
Now that you have satisfied prerequsites for shardus tech stack you can now start nodejs project by doing the followings.

## Switch node version
Make sure using the correct node version by doing `nvm use 16.11.1`

## Starting a nodejs project
Create `package.json` by doing `npm init`


## Install node-gyp globally
To install node-gyp, please do 
```bash
npm i -g node-gyp
```

## Install shardus-cli
To install shardus-cli please do
```bash
npm i -g shardus
```

## Developing decentralized applications using shardus
Developing decentralized applications on top of shardus usually require these four npm packages.

**Core Technology**
```
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
npm i @shardus/core
```
## What's next
You can now develop your own decentralized applications. Don't know how ?

<Callout emoji="!" type="warning">
See [getting started](../gettingstarted.md) section if you havent already
</Callout>
