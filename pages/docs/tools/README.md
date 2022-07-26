# Tools

There are some helpful tools available to use when developing with Shardus. Some of these tools are essential; while others are optional, but extremely helpful when it comes to debugging. Please look over all the tools in this section before implementing your project.

- ### [shardus-cli-tool](./shardus-cli-tool/README)

   This tool is primarily used to start a network consisting of the specified number of nodes.

- ### [monitor-server](./monitor-server)

   This is a tool for receiving data reported by nodes and transferring it to the `monitor-client` for display.

- ### [monitor-client](./monitor-client)

   This is useful for monitoring the state of a running Shardus network at a glance and is internally used by `monitor-server` to display data visually.

- ### [archive-server](./archive-server)

   Archiver stores a full copy of the data in a network.

- ### [shardus-crypto-utils](./crypto-utils)

   This tool provides a set of cryptographic utility functions to use when developing with the Shardus core.

- ### [crypto-web-utils](./crypto-web-utils)

   This tool provides a set of cryptographic utility functions to use when developing with Shardus, but is specifically designed for browser compatibilities.
