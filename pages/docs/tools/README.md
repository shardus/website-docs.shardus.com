# Tools

There are some very helpful tools available to use when developing with shardus. Some of these tools are essential, and others are optional but extremely helpful when it comes to debugging. Please look over all the tools in this section before diving into implementing your project.

- ### [shardus-cli-tool](./shardus-cli-tool/overview)

   This tool is primarily used to kickstart a network consisting specified number of network

- ### [monitor-server](./monitor-server)

   This is a tool for receiving data reported by nodes and transferring it to the monitor-client for display. 

- ### [monitor-client](./monitor-client)

   This is useful for monitoring the state of a running shardus network at a glance and is internally used by monitor-server to display data visually.

- ### [archive-server](./archive-server)

   Archiver stores full copy of data in a network

- ### [shardus-crypto-utils](./crypto-utils)

   This tool provide a set of cryptographic utility functions to use when developing with shardus core.

- ### [crypto-web-utils](./crypto-web-utils)

   This tool provide a set of cryptographic utility functions to use when developing with shardus but specifically design for browser compitabilities.

- ### [shardus-db](./shardus-db)

   This tool provide ORM-like api for get and set operations of states within shardus network.
