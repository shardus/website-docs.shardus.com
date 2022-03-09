
import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Linux Setup
Developing decentralized application on top of shardus usually require 4 of the packages in shardus sdk described [here](../tools/README). Before going ahead with the development developer may needs to configure their system describe as follow.

- Node.js (16.11.1)
- npm (8.0.0)
- Python3
- [Rust](https://www.rust-lang.org/tools/install)

# Configuring node version
It is generally recommend to use `nvm` for node version management for anyone serious about nodejs development. Otherwise developers may need to install specific node version mannually. To install `nvm` check [here](https://github.com/nvm-sh/nvm).

After installing nvm on the machine, developers may then able to switch to specific `nvm` version by doing `nvm install 16.11.1` and `nvm use 16.11.1`.


# Configuring python3
Installing python on unix machine are fairly straight forward.

<Callout emoji="!" type="warning">
This step is optional if your machine have it already configured
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

# Configuring rust
<Callout emoji="!" type="warning">
This step is optional if your machine have it already configured
</Callout>
When installation of shardus core, npm compile rust libraries on the fly. Though in future we would make this go away by shipping with binaries eliminating rust having to be installed on developers machines'.

But until then, install rust by following instruction from [here](https://www.rust-lang.org/tools/install). Once you have `rustup` setup on your machine do -
```
rustup install stable
``` 
```
rustup default stable
```

# Install node-gyp globally
To install node-gyp, please do 
```
npm i -g node-gyp
```

# Install shardus-cli
To install shardus-cli please do
```
npm i -g shardus
```

# Developing decentralized applications using shardus
Developing decentralized applications on top of shardus usually require these four npm packages.

**Core Technology**
```
npm i @shardus/core
```

**Cryptographic helper functions**
``` 
npm i @shardus/crypto-utils
```
**For monitoring**
```
npm i @shardus/monitor-server
```
**Archive server**
```
npm i @shardus/core
