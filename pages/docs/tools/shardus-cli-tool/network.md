# Shardus Network

This tool helps you to manage a local Shardus test network.

## Usage

The `shardus-network` tool uses the `/instances` directory by default, if another isn't specified.

```sh
shardus create-net [-n <amount-to-create>] [--no-start] [network_dir="/instances"]
shardus start-net [-n <amount-to-start>] [network_dir="/instances"]
shardus stop-net [-n <amount-to-stop>] [network_dir="/instances"]
shardus clean-net [-n <amount-to-clean>] [network_dir="/instances"]
shardus config-net [network_dir="/instances"]
```

## Examples

Create a local test network with default parameters:

```sh
shardus create-net 10 --no-start
```

Start the test network:

```sh
shardus start-net 10
```

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

Set the `config.json` file for all the instances in the `/instances` folder:

```sh
shardus config-net
```

## Description

The `shardus-network` tools are used to launch and scale local test networks that run your Shardus app code.

`shardus create-net` provides a questionnaire that gathers information about the way your app is configured. This includes the location of the main executable and configuration files for your application. It then creates a directory for the test network and saves the information it gathered into a `network-config.json` file in that directory. The `--default` option or the `-n` option can be passed to skip the questionnaire and use default values.
