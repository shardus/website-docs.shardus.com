import Callout from 'nextra-theme-docs/callout'

# getLatestCycles

`getLatestCycles` is a function that returns an array of cycles in the cycle chain history starting from the current cycle. It takes in a single parameter: `amount` which is a `number` representing the number of cycles you wish to return.

The cycle objects returned by `getLatestCycles` resemble something like this:

```json
{
  "activated": [
    "2e33359e17a528de8ad20835684b4d2b1b1da994d38f6971720430db8d443d50",
    "b7ba14647f3aaee92ce90379cbba7c050b4d7fd321997efa689f296ad5040a3a"
  ],
  "activatedPublicKeys": [
    "3631cd4420064ba0dd33a576a06b2dbcc73b0c4b0f5347aaf6a6b83f0cbc03f2",
    "464a94ac274db79f1470ec4c2ec8eb1ff7215bf1f2074f1361839d99d4558764"
  ],
  "active": 2,
  "apoptosized": [],
  "counter": 7,
  "desired": 15,
  "duration": 15,
  "expired": 2,
  "joined": [],
  "joinedArchivers": [],
  "joinedConsensors": [],
  "lost": [],
  "previous": "91a7ca0329d76a76e46ddd7c359638b595cf23b2f36767d5c28a266ef84b040e",
  "refreshedArchivers": [
    {
      "curvePk": "363afebb8cca474bd4e3c29d0109ad068736b7802c34ed8b7038cd6a95bb1e24",
      "ip": "localhost",
      "port": 4000,
      "publicKey": "758b1c119412298802cd28dbfa394cdfeecc4074492d60844cc192d632d84de3"
    }
  ],
  "refreshedConsensors": [
    {
      "activeTimestamp": 1588979852,
      "address": "e188fe618726c278a7138ca8d89c4de061eb43dffedb26cdfcb1580bf88efced",
      "counterRefreshed": 2,
      "curvePublicKey": "785b5c371a5823a53685aa7fb40e5ec447d02d8e730c29cf04fa77e7368a1056",
      "cycleJoined": "6ff19fabd305ed08aa260938101a522ae994bb54ecedb3b0a75a6d2acbf5cb0e",
      "externalIp": "127.0.0.1",
      "externalPort": 9008,
      "id": "359268a03cb6270da83de955a37ef9936eb3cbbed2e6aacaf706d6bd813dc6e5",
      "internalIp": "127.0.0.1",
      "internalPort": 10008,
      "joinRequestTimestamp": 1588979795,
      "publicKey": "e188fe618726c278a7138ca8d89c4de061eb43dffedb26cdfcb1580bf88efced",
      "status": "active"
    }
  ],
  "refuted": [],
  "removed": [],
  "returned": [],
  "start": 1588979867,
  "syncing": 4
}
```

<Callout emoji="💡" type="default">

Here we can use the timestamp of the cycle to check whether or not it's time to generate some type of transaction based on comparison with global variables. We can also use the previous cycle marker as a random value for the [getClosestNodes](./getClosestNodes) function.

</Callout>

```ts
const account = await dapp.getLocalOrRemoteAccount(networkAccount);
const network = account.data;
const [cycleData] = dapp.getLatestCycles();
const cycleStartTimestamp = cycleData.start * 1000;
const [luckyNode] = dapp.getClosestNodes(cycleData.previous, 3);
const nodeId = dapp.getNodeId();
const nodeAddress = dapp.getNode(nodeId).address;

// ISSUE
if (
  cycleStartTimestamp >= network.windows.proposalWindow[0] &&
  cycleStartTimestamp <= network.windows.proposalWindow[1]
) {
  if (!issueGenerated && network.issue > 1) {
    if (nodeId === luckyNode) {
      await generateIssue(nodeAddress, nodeId);
    }
    issueGenerated = true;
    tallyGenerated = false;
    applyGenerated = false;
  }
}
```

