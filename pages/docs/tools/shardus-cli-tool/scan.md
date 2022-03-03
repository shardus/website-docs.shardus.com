# Shardus Scan Tool

## Usage

```bash
shardus scan <path-to-instances-dir>
```

## examples

```bash
shardus scan ../../applications/liberdus/server/instances
```

## Description

`shardus scan` is used to scan through all the `.log` files in the instances directory of your application. This will generate a merged, sorted list of all the fatal and error logs from the current running network. This is extremely useful for finding the root cause of a bug. When something goes wrong in a large network of 10 or more nodes, it gets harder and harder to locate the first place things went wrong.
