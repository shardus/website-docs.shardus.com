import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Setting up the system
Developing decentralized application on top of shardus usually require a set of these packages in shardus sdk described [here](../tools/README). Before going ahead with the development, developers may need to configure their system describe as follow.

- Node.js (16.11.1)
- npm (8.0.0)
- Python3.9 (or latest)
- [Rust](https://www.rust-lang.org/tools/install)

## Configuring node version
It is generally recommend to use `nvm` for node version management for anyone serious about nodejs development. Otherwise developers may need to install specific node version mannually. 

`nvm` tool allow you have switch quickly between different node versions.

To install `nvm` check [here](https://github.com/nvm-sh/nvm).

After installing nvm on the machine, developers may then able to switch to specific `nvm` version by doing `nvm install 16.11.1` and `nvm use 16.11.1`.


## Configuring python3.9
Installing python on unix machine are fairly straight forward.

<Callout emoji="!" type="warning">
This step is optional if your machine have python3 already configured
</Callout>

For example to install python3.9 on arch linux:
```bash
sudo pacman -Sy python3.9
```
On Ubuntu:
```bash
sudo apt-get install python3.9
```
The exact command would differs from one linux system to another depending on what package management tools is being setup on the machine.

For windows users this would include downloading python binaries for windows and installing it. Same goes for mac systems.

<Callout emoji="!" type="warning">
It is known issue that node-gyp would cause problem without the lastest python version configured.
</Callout>

If you have multiple python version on your machine and require to point npm to use specific python version, run this command:

```
npm config set python /path/to/python3.9
```

## Configuring rust

<Callout emoji="!" type="warning">
This step is optional if your machine have rust toolchain already configured
</Callout>
When installation of shardus core, npm compile rust libraries on the fly. Though in future we would make this go away by shipping `@shardus/core` with rust binaries eliminating rust having to be installed on developers machines'.

But until then, install rust by following instruction from [here](https://www.rust-lang.org/tools/install). Once you have `rustup` setup on your machine do -

```bash
rustup install stable
``` 

```bash
rustup default stable
```
For other systems see [this](https://forge.rust-lang.org/infra/other-installation-methods.html)
