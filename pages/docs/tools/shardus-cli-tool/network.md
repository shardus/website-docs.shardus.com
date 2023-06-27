import Callout from 'nextra-theme-docs/callout'

# Shardus Network

This tool helps you to manage a local Shardus test network.

## Usage

The `shardus-network` tool uses the `/instances` directory.

## Examples

Create a local test network with default parameters:

```sh
shardus create-net 10 --no-start
```

Start the test network:

```sh
shardus start-net 10
```

<Callout emoji="⚠️" type="error">
If any of the nodes error out, ensure that the processes of any previous network aren't still running.
</Callout>

Add 5 more nodes to the network and start them:

```sh
shardus create-net 5
```

Stop the test network:

```sh
shardus stop-net
```

Clean residual log and database files from the last run:

```sh
shardus clean-net
```

<Callout emoji="💡" type="default">
Make sure that you delete the instances directory before starting a new network

```bash
rm -rf instances
```

</Callout>

Set the `config.json` file for all the instances in the `/instances` folder:

```sh
shardus config-net
```

## Description

The `shardus-network` tools are used to launch and scale local test networks that run your Shardus app code.
