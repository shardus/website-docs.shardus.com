import Callout from 'nextra-theme-docs/callout'

# createWrappedResponse

`createWrappedResponse` is a function that needs to be called in order to return a `wrappedResponse` in the [getRelevantData](setup/getRelevantData.md) function of [setup](setup/README.md).

This function needs 5 parameters passed into it.

1. `accountId` - The account id that's passed into `getRelevantData`
2. `accountCreated` - A boolean indicating whether or not an account was created for the first time
3. `accountHash` - The hash field on the account
4. `accountTimestamp` - The timestamp field on the account
5. `account` - The entire account object

<Callout emoji="💡" type="default">

The example shown below demonstrates how to use this function within a chat application.

</Callout>

```ts
getRelevantData(accountId, tx) {
  let account = accounts[accountId]
  let accountCreated = false
  // Create the account if it doesn't exist
  if (typeof account === 'undefined' || account === null) {
    if (tx.type === 'register') {
      if (accountId === tx.aliasHash) {
        account = createAlias(accountId)
        accounts[accountId] = account
        accountCreated = true
      }
    } else if (tx.type === 'message') {
      if (accountId === tx.chatId) {
        account = createChat(accountId)
        accounts[accountId] = account
        accountCreated = true
      }
    }
  }
  if (typeof account === 'undefined' || account === null) {
    account = createAccount(accountId, tx.timestamp)
    accounts[accountId] = account
    accountCreated = true
  }
  // Wrap it for Shardus
  const wrapped = dapp.createWrappedResponse(accountId, accountCreated, account.hash, account.timestamp, account)
  return wrapped
}
```
