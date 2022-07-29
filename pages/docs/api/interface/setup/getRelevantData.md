# getRelevantData

This function can be used to create the wrapped account data used by Shardus in the [apply](./apply) function. It takes in the account ID and transaction as the parameters and returns the wrapped response to be used in `apply`. Use the [createWrappedResponse](../createWrappedResponse) function exposed by Shardus and pass in:

1. The account ID
2. A boolean indicating whether an account was created
3. The account hash
4. The account timestamp
5. The entire account object itself

> If you ever need to create an account with specific data based on a specific transaction type, that can be done here.

```javascript
getRelevantData(accountId, tx) {
  let account = accounts[accountId];
  let accountCreated = false;
  // Create the account if it doesn't exist
  if (typeof account === "undefined" || account === null) {
    account = createAccount({
      id: accountId,
      timestamp: 0,
      handle: accountId
    });
    accountCreated = true;
  }
  // Wrap it for Shardus
  const wrapped = dapp.createWrappedResponse(
    accountId,
    accountCreated,
    account.hash,
    account.timestamp,
    account
  );
  return wrapped;
}
```
