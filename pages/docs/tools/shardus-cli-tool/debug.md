# Shardus Debugger Tool

This tool allows you to manage debug data from a running shardus app network

## Usage

```bash
shardus debug get <instanceUrl> [instanceDir]
shardus debug collect <instanceUrl> [networkDir]
shardus debug combine <networkDir>
```

## Examples

Get debug data from a single running instance:

```bash
shardus debug get localhost:9001 ./9001-debug
```

Collect debug data from all instances of a network:

```bash
shardus debug collect localhost:9001 ./test-net-debug
```

Combine the logs of all instances of a test network:

```bash
shardus debug combine ./test-net-debug
```

## Description

The `shardus debug` tools are used to manage debug data from the running instances of a Shardus application network.

`shardus debug get` saves the debug data from a single instance into an `instanceDir`.

`shardus debug collect` saves the debug data from all instances in a network into a `networkDir`.

`shardus debug combine` combines the logs from all instances in a `networkDir` into one large file for easy searching/analysis.
