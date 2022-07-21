# Incentivize Miners

Building a reward system is a **crucial** step in developing decentralized applications. It provides the needed incentive for users to contribute resources to your application's network. Without a reward, not many people would bother to provide compute power for your application.

Shardus makes it very easy for anyone to implement a reward system as they see fit. We don't constrict you in any way regarding how you want your token economics to work. That being said, here's a simple way we did it for a chat application.

> Note: This isn't necessarily the best way of doing things, it's just a template to get you thinking how it could be done.

1. In your `server` side application code, declare two variables for how often nodes should get paid, and how much.

```javascript
const NODE_REWARD_TIME = 86400; // 24 Hours, in seconds format
const NODE_REWARD_AMOUNT = 10; // 10 tokens rewarded for running a node for 24 hours
```

2. Wrap `dapp.start()` in a immediately invoked async function expression. Then simply set an interval for a function `selfReward` to be called on every time interval corresponding to your `NODE_REWARD_TIME`.

```javascript
(async () => {
  await dapp.start();
  setInterval(() => {
    selfReward();
  }, NODE_REWARD_TIME * 1000);
})();
```

3. Create the `selfReward` function somewhere in your `server` side code.

```javascript
const { resolve } = require("path");

const configFile = resolve("config.json");
const config = require(configFile);

function selfReward() {
  const nodeId = dapp.getNodeId(); // Get your nodeId
  const { address } = dapp.getNode(nodeId); // Get the publicKey from your nodeInfo using the nodeId
  const tgtAcc = config.payAcc || address; // If the node is configured to send the rewards to a different address
  // Create a "node_reward" type transaction
  const tx = {
    type: "node_reward",
    timestamp: Date.now(),
    nodeId: nodeId,
    srcAcc: address,
    tgtAcc: tgtAcc,
    amount: NODE_REWARD_AMOUNT
  };

  // Send the transaction to shardus
  dapp.put(tx);
}
```

4. Add a case for `validateTransaction` in `dapp.setup`.

```javascript
case "node_reward": {
  let nodeInfo = dapp.getNode(tx.nodeId);

  // Make sure NODE_REWARD_TIME has passed since the node joined the network
  if (
    tx.timestamp - nodeInfo.activeTimestamp <
    NODE_REWARD_TIME * 1000
  ) {
    response.result = 'fail';
    response.reason = "Too early for this node to get paid";
    return response;
  }

  // If no account exists yet for this node address, pass it through to apply
  if (!accounts[tx.srcAcc]) {
    response.result = "pass";
    response.reason = "This transaction in valid";
    return response;
  }

  if (accounts[tx.srcAcc]) {
    // If an account exists, but hasn't been rewarded for mining yet, pass it through to apply
    if (!accounts[tx.srcAcc].nodeRewardTime) {
      response.result = "pass";
      response.reason = "This transaction in valid";
      return response;
    }
    // If the account has been paid in the past, make sure it's been at least NODE_REWARD_TIME since it's last payment
    if (
      tx.timestamp - accounts[tx.srcAcc].nodeRewardTime <
      NODE_REWARD_TIME * 1000
    ) {
      response.result = "fail";
      response.reason = "Too early for this node to get paid";
      return response;
    }
  }
  // Since the transaction passed all validation fields, pass it through to apply
  response.result = "pass";
  response.reason = "This transaction is valid!";
  return response;
}
```

5. Add a case for `apply` in `dapp.setup`.

```javascript
case "node_reward": {
  let source = wrappedStates[tx.srcAcc].data;
  let target = wrappedStates[tx.tgtAcc].data;
  target.data.balance += tx.amount; // Add the NODE_REWARD_AMOUNT to the target balance
  source.nodeRewardTime = tx.timestamp; // Set the timestamp of this transaction for when this node got paid last
  source.timestamp = tx.timestamp;
  target.timestamp = tx.timestamp;
  break;
}
```

6. Lastly, add a case for `getKeyFromTransaction` in `dapp.setup`.

```javascript
case "node_reward":
  result.sourceKeys = [tx.srcAcc]
  result.targetKeys = [tx.tgtAcc];
  break;
```

> Play around with different settings and parameters to see what kind of coin economics work best for your decentralized application.

7. Set the `NODE_REWARD_TIME` to something like 30 seconds and use the CLI client to query the accounts data. You should see balance getting added to every nodes' associated account. And thats it! That's all it takes to implement the incentive for users to run nodes on your network. Once again, play around and see what kind of crazy incentives for running nodes you can come up with.

> Note: if you decide to set your `NODE_REWARD_TIME` to something along the lines of 60 seconds or less, you may want to run a timeout before the interval in order for your network of nodes to sync properly before bombarding the network with `node_reward` transactions. Like so...

```javascript
(async () => {
  await dapp.start();
  setTimeout(() => {
    setInterval(() => {
      selfReward();
    }, NODE_REWARD_TIME * 1000);
  }, 100000); // Should give enough time for a network of nodes to sync
})();
```
