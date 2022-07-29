# getNode

`getNode` is a function that is used to return a node's information. It takes one parameter:

- `nodeId` is a `string` which represents the ID of the node to retrieve.

---

The node information returned resembles the following:

```json
{
  "activeTimestamp": 1588983396,
  "address": "e7d68fc7c65a542bbd7c685dbdbfb6aaf9e400de9492f6d324218aeebeb5e032",
  "externalIp": "127.0.0.1",
  "externalPort": 9001,
  "internalIp": "127.0.0.1",
  "internalPort": 10001,
  "joinRequestTimestamp": 1588983381,
  "publicKey": "e7d68fc7c65a542bbd7c685dbdbfb6aaf9e400de9492f6d324218aeebeb5e032",
  "cycleJoined": "0000000000000000000000000000000000000000000000000000000000000000",
  "counterRefreshed": 2,
  "id": "8a91c77457d3e942c2019162730aa13617a50cfa10825d32e68b1c744789381e",
  "curvePublicKey": "f0109efe42064796d5ec770a4e7a352624d876806192118ae0729f48991cad18",
  "status": "active"
}
```

Getting access to the ID of the node requires the [getNodeId](./getNodeId) function.
