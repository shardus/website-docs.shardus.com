import Callout from 'nextra-theme-docs/callout'

# Shardus CLI Tool

The `shardus`  CLI tool lets you:

- Create and manage local test networks running your app.
- Collect debug data from a running Shardus app network.

## Installation

```sh
npm i -g shardus
# OR
yarn global add shardus
```


<Callout emoji="💡" type="default">

The `shardus` CLI also has autocomplete available to those of you who are using `zsh`.
In order to get the autocompletions working, just run:

</Callout>

```sh
# For zsh
source <(shardus completion zsh)

# or add it to your .zshrc to make it persist
echo "source <(shardus completion zsh)" >> ~/.zshrc \
&& source ~/.zshrc
```


<Callout emoji="💡" type="default"> 

The sub modules included in the `shardus-cli`

</Callout>

- [shardus-network](./network)
- [shardus-scan](./scan)
- [shardus-debug](./debug)
- [shardus-deploy](./deploy)

