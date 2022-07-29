# Server Configuration

## Default server config

```json
{
  "heartbeatInterval": 5,
  "baseDir": ".",
  "transactionExpireTime": 5,
  "crypto": {
    "hashKey": "69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc"
  },
  "p2p": {
    "ipServer": "api.ipify.org/?format=json",
    "timeServers": [
      "0.pool.ntp.org",
      "1.pool.ntp.org",
      "2.pool.ntp.org",
      "3.pool.ntp.org"
    ],
    "existingArchivers": [
      {
        "ip": "127.0.0.1",
        "port": 4000,
        "publicKey": "758b1c119412298802cd28dbfa394cdfeecc4074492d60844cc192d632d84de3"
      }
    ],
    "syncLimit": 180,
    "cycleDuration": 30,
    "maxRejoinTime": 20,
    "difficulty": 2,
    "queryDelay": 1,
    "gossipRecipients": 4,
    "gossipTimeout": 180,
    "maxSeedNodes": 10,
    "minNodesToAllowTxs": 3,
    "minNodes": 15,
    "maxNodes": 30,
    "seedNodeOffset": 4,
    "nodeExpiryAge": 30,
    "maxJoinedPerCycle": 1,
    "maxSyncingPerCycle": 5,
    "maxRotatedPerCycle": 1,
    "maxPercentOfDelta": 40,
    "scaleReqsNeeded": 5,
    "maxScaleReqs": 10,
    "amountToScale": 1
  },
  "ip": {
    "externalIp": "127.0.0.1",
    "externalPort": 9001,
    "internalIp": "127.0.0.1",
    "internalPort": 9005
  },
  "network": {
    "timeout": 10
  },
  "reporting": {
    "report": true,
    "recipient": "http://127.0.0.1:3000/api",
    "interval": 2,
    "console": false
  },
  "debug": {
    "loseReceiptChance": 0.0,
    "loseTxChance": 0.0,
    "canDataRepair": true
  },
  "statistics": {
    "save": true,
    "interval": 1
  },
  "loadDetection": {
    "queueLimit": 1000,
    "desiredTxTime": 15,
    "highThreshold": 0.5,
    "lowThreshold": 0.2
  },
  "rateLimiting": {
    "limitRate": true,
    "loadLimit": 0.5
  },
  "stateManager": {
    "stateTableBucketSize": 200,
    "accountBucketSize": 50
  },
  "sharding": {
    "nodesPerConsensusGroup": 5
  }
}
```

## heartbeatInterval

The `heartbeatInterval` parameter is an `Integer` that defines the number of seconds between each heartbeat logged within Shardus.

```json
{
  "heartbeatInterval": 5
}
```

## baseDir

The `baseDir` parameter is a `String` that defines the relative base directory for this running instance of Shardus.

```json
{
  "baseDir": "."
}
```

## transactionExpireTime

The `transactionExpireTime` parameter is an `Integer` that defines the amount of time (in seconds) allowed to pass before a transaction will expire and be rejected by the network.

```json
{
  "transactionExpireTime": 5
}
```

## crypto

The `crypto` parameter is an `Object` which can pass in the following parameter:

```json
"crypto": {
  "hashKey": "69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc"
}
```

> The `hashKey` parameter is a `String` that is used to initialize the `crypto` module, which is used for the cryptographic functions within Shardus.

## p2p

The `p2p` parameter is an `Object` which can pass in the following parameters:

```json
"p2p": {
  "ipServer": "api.ipify.org/?format=json",
  "timeServers": [
    "0.pool.ntp.org",
    "1.pool.ntp.org",
    "2.pool.ntp.org",
    "3.pool.ntp.org"
  ],
  "syncLimit": 5,
  "cycleDuration": 15,
  "maxRejoinTime": 20,
  "seedList": "http://127.0.0.1:4000/api/seednodes",
  "difficulty": 2,
  "queryDelay": 1,
  "netadmin": "758b1c119412298802cd28dbfa394cdfeecc4074492d60844cc192d632d84de3",
  "gossipRecipients": 4,
  "gossipTimeout": 180,
  "maxSeedNodes": 10,
  "minNodes": 1,
  "maxNodes": 20,
  "seedNodeOffset": 4,
  "nodeExpiryAge": 180,
  "maxNodesToRotate": 1,
  "maxNodesPerCycle": 5,
  "maxPercentOfDelta": 40,
  "scaleReqsNeeded": 5,
  "maxScaleReqs": 10,
  "amountToScale": 1
}
```

> The `ipServer` parameter is a `String` that specifies the URL for the IP server.

> The `timeServers` parameter is an `Array` of `String`s that specifies where to get time critical data.

> The `syncLimit` parameter is an `Integer` that specifies the amount of time (in seconds) a node's local time can differ from the network's time.

> The `cycleDuration` parameter is an `Integer` specifying the amount of time (in seconds) it takes for a Shardus network cycle to complete.

> The `maxRejoinTime` parameter is an `Integer` specifying the amount of time (in seconds) between network heartbeats before a node must ask to rejoin.

> The `seedList` parameter is a `String` specifying the URL for the seed node server that the application will communicate with.

> The `difficulty` parameter is an `Integer` specifying the proof of work difficulty to prevent network spam.

> The `queryDelay` parameter is an `Integer` specifying the amount of time (in seconds) to delay between cycle phases.

> The `netadmin` parameter is a `String` specifying the public key of the network admin for emergency network alerts, updates, or broadcasts.

> The `gossipRecipients` parameter is an `Integer` specifying the number of nodes to send gossip to in the network after receiving a message. Shardus groups nodes with neighbors, who they can gossip the message to, so you can set this pretty low and still expect it to be propagated through the entire network. (It's recommended to set this to __at least__ 3, 4 is recommended, and 5 would be even safer, but maybe overkill.) Shardus will send 2 gossips to neighboring nodes, and send the remaining number left over in the parameter to random nodes in the network, so messages will be propagated very quickly.

> The `gossipTimeout` parameter is an `Integer` specifying the amount of time (in seconds) before an old gossip is deleted from a node.

> The `maxSeedNodes` parameter is an `Integer` specifying the maximum number of seed nodes to be used.

> The `minNodes` parameter is an `Integer` specifying the minimum number of nodes that need to be active in the network in order to process transactions.

> The `maxNodes` parameter is an `Integer` specifying the maximum number of nodes that can be active in the network at once.

> The `seedNodeOffset` parameter is an `Integer` specifying the number of seed nodes to remove when producing the seed list.

> The `nodeExpiryAge` parameter is an `Integer` specifying the amount of time (in seconds) a node can be in the network before getting rotated out.

> The `maxNodesToRotate` parameter is an `Integer` specifying the maximum number of nodes that can be rotated out of the network.

> The `maxNodesPerCycle` parameter is an `Integer` specifying the maximum number of nodes that can join the syncing phase each cycle.

> The `maxPercentOfDelta` parameter is an `Integer` specifying a percentage limit for additional nodes that can be accepted to the network.

> The `scaleReqsNeeded` parameter is an `Integer` specyifying the number of internal scaling requests Shardus needs to receive before scaling up or down the number of desired nodes in the network.

> The `maxScaleReqs` parameter is an `Integer` specifying the maximum number of scaling requests the network will process before scaling up or down.

> The `amountToScale` parameter is an `Integer` specifying the amount of nodes to add to or subtract from the number of desired nodes in the network.

## ip

The `ip` parameter is an `Object` which can pass in the following parameters:

```json
"ip": {
  "externalIp": "127.0.0.1",
  "externalPort": 9001,
  "internalIp": "127.0.0.1",
  "internalPort": 9005
}
```

> The `externalIp` parameter is a `String` specifying the external IP address exposed by the node running the network.

> The `externalPort` parameter is an `Integer` specifying the external port exposed by the node running the network.

> The `internalIp` parameter is a `String` specifying the internal IP address exposed by the node running the network.

> The `internalPort` parameter is an `Integer` specifying the internal port exposed by the node running the network.

## network

The `network` parameter is an `Object` which can pass in the following parameter:

```json
"network": {
  "timeout": 10
}
```

> The `timeout` parameter is an `Integer` specifying the amount of time (in seconds) given to an internal network request made by the node until it gets timed out.

## reporting

The `reporting` parameter is an `Object` which can pass in the following parameters:

```json
"reporting": {
  "report": true,
  "recipient": "http://127.0.0.1:3000/api",
  "interval": 2,
  "console": false
}
```

> The `report` parameter is a `Boolean` specifying whether or not to report data to a monitor server / client.

> The `recipient` parameter is a `String` specifying the URL of the recipient of the data that will be reported if `report` is set to `true`.

> The `interval` parameter is an `Integer` specifying the amount of time (in seconds) between the reported data updates.

> The `console` parameter is a `Boolean` specifying whether or not to report data updates to the console.

## debug

The `debug` parameter is an `Object` which can pass in the following parameters:

```json
"debug": {
  "loseReceiptChance": 0.000,
  "loseTxChance": 0.00
}
```

> The `loseReceiptChance` parameter is a `Float` specifying a percentage chance to randomly drop a receipt __(currently doesn't do anything)__.

> The `loseTxChance` parameter is a `Float` specifying a percentage chance to randomly drop a transaction.

## statistics

The `statistics` parameter is an `Object` which can pass in the following parameters:

```json
"statistics": {
  "save": true,
  "interval": 1
}
```

> The `save` parameter is a `Boolean` specifying whether or not statistics will be gathered and saved when running the network.

> The `interval` parameter is an `Integer` specifying the amount of time (in seconds) between each generation of stats data.

## loadDetection

The `loadDetection` parameter is an `Object` which can pass in the following parameters:

```json
"loadDetection": {
  "queueLimit": 1000,
  "desiredTxTime": 15,
  "highThreshold": 0.5,
  "lowThreshold": 0.2
}
```

> The `queueLimit` parameter is an `Integer` which specifies one of the two possible limits to check whether the network is under heavy load. It does this by checking its set value against the current transaction queue. The threshold will be equal to the number of transactions in the queue divided by the `queueLimit`.

```javascript
const scaledQueueLength =
  queueLength >= this.queueLimit ? 1 : queueLength / this.queueLimit;
```

> The `desiredTxTime` parameter is an `Integer` which specifies the other condition to check whether the network is under heavy load.

```javascript
const scaledTxTimeInQueue =
  txTimeInQueue >= this.desiredTxTime ? 1 : txTimeInQueue / this.desiredTxTime;
```

> The `highThreshold` parameter is an `Integer` which specifies the high end of the load the network can take. Reaching this threshold will cause the network to increase the number of desired nodes.

> The `lowThreshold` parameter is an `Integer` which specifies the low end of the load the network can take. Reaching this threshold will cause the network to decrease the number of desired nodes.

## rateLimiting

The `rateLimiting` parameter is an `Object` which can pass in the following parameters:

```json
"rateLimiting": {
  "limitRate": true,
  "loadLimit": 0.5
}
```

> The `limitRate` parameter is a `Boolean` indicating whether or not the network should rate limit in any way.

> The `loadLimit` parameter is a `Float` (between 0 and 1) indicating the maximum level of load the network can handle before starting to drop transactions. With `loadLimit` set to `0.5`, at 75% or `0.75` load, the network would drop 33% of incoming transactions. (The percentage chance to drop a transaction scales linearly as the load increases past the threshold.)

## stateManager

The `stateManager` parameter is an `Object` which can pass in the following parameters:

```json
"stateManager": {
  "stateTableBucketSize": 200,
  "accountBucketSize": 50
}
```

> The `stateTableBucketSize` parameter is an `Integer` which defines the max number of account records that the `p2p` module will ask for in its `get_account_state` call.

> The `accountBucketSize` parameter is an `Integer` that is also currently used as input to a p2p `ask` method for the max number of account records.

## sharding

The `sharding` parameter is an `Object` which contains the following property:

```json
"sharding": {
  "nodesPerConsensusGroup": 5
}
```

> The `nodesPerConsensusGroup` property is an `Integer`.
