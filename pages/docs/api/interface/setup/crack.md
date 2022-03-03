# crack

Another important function Shardus expects in `setup` is `crack`. The
transaction object will be passed in as the parameter for you to generate and
return a result object with the source and target keys. The source and target
keys together should comprise the keys of all accounts that are affected
by the transaction.

> Once again, a switch statement is helpful here to generate the keys based on the type of transaction it receives.
---
> If a transaction is meant to modify only one account state, it usually means they're modifying their own account on the network. This could be something like registering an account, setting a user handle, or adding a friend to their friend list.

```javascript
// Create a result object
const result = {
  sourceKeys: [],
  targetKeys: [],
  allKeys: [],
  timestamp: tx.timestamp
};
// Generate the proper resultKeys based on the transaction type
switch (tx.type) {
  case "register":
    result.targetKeys = [tx.srcAcc];
    break;
  case "message":
    result.targetKeys = [tx.tgtAcc];
    result.sourceKeys = [tx.srcAcc];
    break;
  case "toll":
    result.targetKeys = [tx.srcAcc];
    break;
  case "friend":
    result.targetKeys = [tx.srcAcc];
    break;
  case "node_reward":
    result.sourceKeys = [tx.srcAcc];
    result.targetKeys = [tx.tgtAcc];
    break;
}
result.allKeys = result.allKeys.concat(result.sourceKeys, result.targetKeys);
return result;
```
