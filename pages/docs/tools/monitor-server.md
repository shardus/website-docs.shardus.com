# Monitor Server

The [monitor server](https://gitlab.com/shardus/monitor-server) is a tool for receiving data reported by nodes and transferring it to the [monitor-client](./monitor-client) for display. Nodes are responsible for reporting the following information to the monitor server:

- `joining` an event indicating that the node has submitted a join request.
- `joined` an event indicating that the node has joined the network and started syncing.
- `active` an event indicating that the node has gone active.
- `removed` an event indicating that the node has been removed from the network.
- `heartbeat` a status update indicating that the node is still alive, or hasn't crashed.
- `report` the status report of the data that you see when hovering over a node on the monitor client

---

Installing the monitor server can be done as follows:

```bash
npm install @shardus/monitor-server
# OR
yarn add @shardus/monitor-server
```
