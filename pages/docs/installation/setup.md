import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Setup

In order to develop decentralized applications using shardus, developer needs to use a set of [tools](../tools/README.md). These tools required specific tech stack to operate.

<Callout emoji="🚨" type="error">

Windows Users We recommend that Windows users follow the instructions [here](./windows) before following these setup instructions.

</Callout>

## Pre-Install

1. Make sure you have the following installed and configured (we recommend using [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js and npm versions)

- Node.js (^16.11.1)
- npm (^8.0.0)
- Git
- [Rust](https://www.rust-lang.org/tools/install)

If you're using a different version of Node, like 14.17.5, use the following command to switch to `16.11.1` if you have nvm installed:

```
nvm use 16.11.1
```

2. Install the `node-gyp` dependencies for your platform listed [here](https://www.npmjs.com/package/node-gyp#installation).

This will typically involve installing Python on your machine and enabling certain developer tooling.
