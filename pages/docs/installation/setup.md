import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Setting up the system
Developing decentralized applications on top of shardus usually requires a set of these packages in the shardus sdk described [here](../tools/README). Before going ahead with the development, developers may need to configure their system as follows.

- Node.js (16.11.1)
- npm (8.0.0)
- Python3.9 (or latest)
- [Rust](https://www.rust-lang.org/tools/install)

## Configuring node version
It is generally recommended to use `nvm` for node version management for anyone serious about nodejs development. Otherwise, developers may need to install specific node version manually.

The `nvm` tool allows you to quickly switch between different node versions.

Install `nvm` [here](https://github.com/nvm-sh/nvm).

After installing nvm on your machine, you are then able to switch to the specific nvm version by entering
```bash
nvm install 16.11.1
```
and
```bash
nvm use 16.11.1
```

## Configuring python3.9
Installing python on a Unix machine is fairly straightforward.

<Callout emoji="❗" type="warning">
This step is optional if your machine has python3 already configured
</Callout>

For example to install python3.9 on arch linux:
```bash
sudo pacman -Sy python3.9
```
On Ubuntu:
```bash
sudo apt-get install python3.9
```
The exact command differs from one linux system to another depending on what package management tools are being installed on the machine.

For windows users, this would include downloading python binaries for windows and installing it. This is also necessary for mac systems.

<Callout emoji="❗" type="warning">
It is a known issue that node-gyp would cause problems without the latest python version configured.
</Callout>

If you have multiple python versions on your machine and need to point npm to a specific python version, run this command:

```
npm config set python /path/to/python3.9
```

## Configuring rust

<Callout emoji="❗" type="warning">
This step is optional if your machine has rust toolchain already configured
</Callout>
Currently, npm compiles the rust libraries on the fly when installing Shardus core. In the future, you would not need to install rust, as the binaries will be included instead.

Until then, install rust by following the instructions [here](https://www.rust-lang.org/tools/install). Once rustup is set up on your machine, enter:

```bash
rustup install stable
```

```bash
rustup default stable
```
For other systems see [this](https://forge.rust-lang.org/infra/other-installation-methods.html)
