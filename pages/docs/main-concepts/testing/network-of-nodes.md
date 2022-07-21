# Network of Nodes

Testing with a network of nodes is going to be the most beneficial way to stress your application. There are many different issues that you might come across when testing this way versus just a single node. Internal network communication between nodes could fail, there could be synchronization issues, node's could fail to join the network, and a host of other issues may present themselves. Since a real network is going to be sharded and have many nodes in the network, it is essential to test this way before deploying your application.

## Install Dependencies

The only dependency required for testing a network of nodes is the [shardus-cli-tool](../../tools/shardus-cli-tool). We are going to be using the [network](../../tools/shardus-cli-tool/network) module of the CLI tool in order to start, stop and clean the log files.

> Install the cli tool with the following command

```bash
npm i -g shardus
# OR
yarn add global shardus
```

## Create a network

In the root of your project, run

```bash
shardus create
```

You will be asked a series of questions to configure the network directory

```bash
? Choose the main server file path (dist/index.js)
? What name should be the folder to be created for the network instances ? (instances)
? How many nodes do you want to create ? (10)
? Whats the starting external port ? (the nodes will be created from starting external port to starting external port + number of nodes (9001)
? Whats the starting internal port ? (the nodes will be created from starting internal port to starting internal port + number of nodes (10001)
? Do you want to run a archive-server instance locally ? (Y/n)
? Which port do you want to run the archive-server ? (4000)
? Do you want to run a monitor server instance locally ? (Y/n)
? Which port do you want to run the monitor server ? (3000)
? Do you want to run an explorer-server instance locally ? Yes
? Which port do you want to run the explorer-server ? 4444
```

> Unless you need some specific configuration for your network, it's usually ok to just hit `enter` through all the questions or use the desired number of network nodes at the end of the command `shardus create 10`.

Upon successful creation, you should see the following information for the number of instances you created:

```bash
Created server instance on folder <shardus-instance-9001>
Created server instance on folder <shardus-instance-9002>
Created server instance on folder <shardus-instance-9003>
Created server instance on folder <shardus-instance-9004>
Created server instance on folder <shardus-instance-9005>
Created server instance on folder <shardus-instance-9006>
Created server instance on folder <shardus-instance-9007>
Created server instance on folder <shardus-instance-9008>
Created server instance on folder <shardus-instance-9009>
Created server instance on folder <shardus-instance-9010>
```

## Run the network

After successful creation of node instances, Shardus CLI tool will automatically start the network with provided configurations.

## Stopping & Clean up

When you are finished with your test, you should always stop the network and clean up the `instances` directory:

```bash
shardus stop
shardus clean
rm -rf instances
```

## Restart a clean network

When you want to restart a new network after cleaning up the old network.

```bash
shardus start
```

## Helpful aliases

Here are some quick and easy aliases for your `.bashrc` or `.zshrc` file that will lessen the amount of typing overhead:

```bash
alias snc="shardus create"
alias sns="shardus start"
alias snst="shardus stop"
alias sncl="shardus clean"
alias snr="shardus stop && shardus clean && .. && rm -rf instances"
```
