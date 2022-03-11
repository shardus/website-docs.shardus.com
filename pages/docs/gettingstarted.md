import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Getting Start
The goal of this section is to give you brief introduction to shardus by building a decentralized todo list app using shardus. We will start by setting up a tech stack on your machine.

## Prerequsites

<Callout emoji="!" type="warning">
Skip this entire step if you successfully followed [quickstart](./quickstart) section 
</Callout>

We need a set of tools with specific version to successfully use `@shardus/core`. This tech stack include following.

- Node version 16.11.1
- Python3
- Rust

### Configuring node version
It is generally recommend to use `nvm` for node version management for anyone serious about nodejs development. Otherwise developers may need to install specific node version mannually. 

`nvm` tool allow you have switch quickly between different node versions.

To install `nvm` check [here](https://github.com/nvm-sh/nvm).

After installing nvm on the machine, developers may then able to switch to specific `nvm` version by doing `nvm install 16.11.1` and `nvm use 16.11.1`.


### Configuring python3
Installing python on unix machine are fairly straight forward.

<Callout emoji="!" type="warning">
Skip this entire step if you successfully followed [quickstart](./quickstart) section 
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

For windows users this would include downloading python binaries for windows and installing it. Same goes for mac systems.

### Configuring rust

<Callout emoji="!" type="warning">
Skip this entire step if you successfully followed [quickstart](./quickstart) section 
</Callout>

When installation of shardus core, npm compile rust libraries on the fly. Though in future we would make this go away by shipping with binaries eliminating rust having to be installed on developers machines'.

But until then, install rust by following instruction from [here](https://www.rust-lang.org/tools/install). Once you have `rustup` setup on your machine do -

```bash
rustup install stable
``` 

```bash
rustup default stable
```
For other systems see [this](https://forge.rust-lang.org/infra/other-installation-methods.html)

## Let's start the project
Now that you have satisfied prerequsites for shardus tech stack you can now start nodejs project by doing the followings.

### Switch node version
Make sure using the correct node version by doing 
```
nvm use 16.11.1
```
Create `package.json` by doing 
```
npm init
```

### Install required global packages
To install node-gyp, please do 
```bash
npm i -g node-gyp
```
To install shardus-cli please do
```bash
npm i -g shardus
```

