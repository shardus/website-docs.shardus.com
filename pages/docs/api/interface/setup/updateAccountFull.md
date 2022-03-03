# updateAccountFull

This function is used to apply the created wrappedResponse to update our account data. Call [applyResponseAddState](../applyResponseAddState) exposed by Shardus and pass in the following from the code below:

```javascript
updateAccountFull(wrappedData, localCache, applyResponse) {
  const accountId = wrappedData.accountId;
  const accountCreated = wrappedData.accountCreated;
  const updatedAccount = wrappedData.data;
  // Update hash
  const hashBefore = updatedAccount.hash;
  const hashAfter = crypto.hashObj(updatedAccount.data);
  updatedAccount.hash = hashAfter;
  // Save updatedAccount to db / persistent storage
  accounts[accountId] = updatedAccount;
  // Add data to our required response object
  dapp.applyResponseAddState(
    applyResponse,
    updatedAccount,
    updatedAccount,
    accountId,
    applyResponse.txId,
    applyResponse.txTimestamp,
    hashBefore,
    hashAfter,
    accountCreated
  );
}
```
