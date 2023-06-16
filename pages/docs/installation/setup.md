import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Setting up the system
Developing decentralized applications on top of Shardus usually requires a set of these packages in the Shardus SDK described [here](../tools/README). Before going ahead with development, developers may need to configure their system as follows.

- Node.js (16.11.1)
- npm (8.0.0)
- Python3.9 (or latest)
- [Rust](https://www.rust-lang.org/tools/install)

## Configuring Node version
It is generally recommended to use `nvm` (Node Version Manager) to anyone serious about Node.js development. Otherwise, developers may need to install a specific Node version manually.

The `nvm` tool allows you to quickly switch between different Node versions.

Install `nvm` [here](https://github.com/nvm-sh/nvm).

After installing `nvm` on your machine, you are then able to switch to the specific Node version by entering
```bash
nvm install 16.11.1
```
and
```bash
nvm use 16.11.1
```

### Configuring Python 3
Installing Python on a Unix machine is fairly straightforward.

<Callout emoji="❗" type="warning">
This step is optional if your machine has Python 3 already configured
</Callout>

For example, to install Python 3 on Arch Linux:
```bash
sudo pacman -Sy python3.9
```
On Ubuntu:
```bash
sudo apt-get install python3.9
```
The exact command differs from one Linux system to another depending on what package management tools are being installed on the machine.

For Windows users, this would include downloading Python binaries for Windows and installing it. This is also necessary for Mac systems.

<Callout emoji="❗" type="warning">
It is a known issue that `node-gyp` would cause problems without the latest Python version configured.
</Callout>

If you have multiple Python versions on your machine and need to point `npm` to a specific Python version, run this command:

```
npm config set python /path/to/python3.9
```

## Configuring Rust

<Callout emoji="❗" type="warning">
This step is optional if your machine has the Rust toolchain already configured
</Callout>

Currently, `npm` compiles the Rust libraries on the fly when installing Shardus core. In the future, you would not need to install Rust, as the binaries will be included instead.

Until then, install Rust by following the instructions [here](https://www.rust-lang.org/tools/install). Once `rustup` is set up on your machine, enter:

```bash
rustup install stable
```

```bash
rustup default stable
```
For other systems see [this](https://forge.rust-lang.org/infra/other-installation-methods.html).
