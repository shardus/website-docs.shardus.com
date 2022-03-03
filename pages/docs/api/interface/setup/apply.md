# apply

Shardus expects a very important function called `apply` to be passed into `setup`. `apply` is where all your business logic lives that mutates your application state. Within `apply`, you also need to create a transactionId by hashing the transaction object, and pass it into `createApplyResponse`, which is another method exposed by shardus, along with the transaction timestamp as the second paremeter. This response should get returned at the end of `apply`.

> It's crucially important that this is the only place where state data gets changed because all nodes basically run the apply function simultaniously. This enables the nodes to agree on what order the changes to state were made, and to be in sync with each other.
---
> When you mutate your application state data anywhere outside of `apply`, you end up causing the nodes to become out of sync. If you try this while running a network of nodes, you can actually see the node getting kicked out on the monitor server. Every other node has different state data than the one who changed his state prematurely, and they will boot him from the network.

The example shown in the main Interface Overview displayed a good example of what basically goes on in apply

```javascript
if (type === "transfer") {
  let sourceAccount = accountStates[tx.sourceAddress].data;
  let targetAccount = accountStates[tx.targetAddress].data;

  sourceAccount.balance -= amount; // Take from source
  targetAccount.balance += amount; // Give to target

  sourceAccount.timestamp = tx.timestamp;
  targetAccount.timestamp = tx.timestamp;
}
```

> For an simple transaction type like a transfer, all that's required to happen is the source account balance getting deducted and the target account balance getting credited. That's it! You can see how writing decentralized applications just got a whole lot easier.

Let's take a look at a more fully fledged chat application's implementation of apply...

> A good way of implementing the `apply` function is to use a switch statement, just like we did in `validateTransaction`. This way, only the code in the case for the specific transaction type will be executed. Any time you need to access account states to modify data, you need to grab it from the second argument `wrappedStates` that gets passed in to apply.

```javascript
// wrappedStates is a wrappedVersion of all the account states, which it
// gets from the keys given to the transaction
apply(tx, wrappedStates) {
  // This is where the validateTransaction comes into play
  const { result, reason } = this.validateTransaction(tx);
  if (result !== "pass") {
    throw new Error(
      `invalid transaction, reason: ${reason}. tx: ${JSON.stringify(tx)}`
    );
  }

  // Get the source and target account data, if they exist
  let source = wrappedStates[tx.srcAcc] && wrappedStates[tx.srcAcc].data;
  let target = wrappedStates[tx.tgtAcc] && wrappedStates[tx.tgtAcc].data;

  // Create an applyResponse which will be used to tell Shardus that the tx has been applied
  const txId = crypto.hashObj(tx); // compute from tx
  console.log("Attempting to apply tx", txId, "...");
  const applyResponse = dapp.createApplyResponse(txId, tx.timestamp);

  // Apply the tx
  switch (tx.type) {
    case "register": {
      source.handle = tx.handle;
      // Just for testing purposes, we'll initially give the source account 1000 tokens to play with
      source.data.balance += 1000;
      source.timestamp = tx.timestamp;
      console.log("Applied register tx", txId, accounts[tx.srcAcc]);
      break;
    }
    case "message": {
      source.data.balance -= tx.amount;
      target.data.balance += tx.amount;

      if (!source.data.chats[tx.tgtAcc]) source.data.chats[tx.tgtAcc] = { sent: [tx.message], received: [] };
      else source.data.chats[tx.tgtAcc].sent.push(tx.message);

      if (!target.data.chats[tx.srcAcc]) target.data.chats[tx.srcAcc] = { sent: [], received: [tx.message] };
      else target.data.chats[tx.srcAcc].received.push(tx.message);

      source.timestamp = tx.timestamp;
      target.timestamp = tx.timestamp;

      console.log("Applied message tx", txId, accounts[tx.srcAcc], accounts[tx.tgtAcc]);
      break;
    }
    case "toll": {
      source.data.balance -= tx.amount;
      source.data.toll = tx.toll;
      source.timestamp = tx.timestamp;
      console.log("Applied toll tx", txId, accounts[tx.srcAcc]);
      break;
    }
    case "friend": {
      source.data.balance -= tx.amount;
      source.data.friends[tx.handle] = tx.tgtAcc;
      source.timestamp = timestamp;
      console.log("Applied friend tx", txId, accounts[tx.srcAcc]);
      break;
    }
    case "node_reward": {
      target.data.balance += tx.amount;
      source.nodeRewardTime = tx.timestamp;
      source.timestamp = tx.timestamp;
      target.timestamp = tx.timestamp;
      console.log("Applied node_reward tx", txId, accounts[tx.srcAcc], accounts[tx.tgtAcc]);
      break;
    }
    return applyResponse;
  }
}
```

> `wrappedStates` is a very important argument that is generated from the keys sent in from the `getKeysFromTransaction` function. You need to parse the the account data from wrappedStates in order to properly modify any account state for that particular transaction.
