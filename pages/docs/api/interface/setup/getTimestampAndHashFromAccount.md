import Callout from 'nextra-theme-docs/callout'

# getTimestampAndHashFromAccount

This function is not required to be implemented by the app developer for internal use by Shardus. It returns the timestamp and hash of an account given its account data, and it takes in 1 parameter:

- `accountData` - the accountData

<Callout emoji="💡" type="default">

The code below shows an example implementation.

</Callout>

```javascript
getTimestampAndHashFromAccount(accountData: any): { timestamp: number; hash: string } {
    const account: Accounts = accountData as Accounts
    const timestamp = account.timestamp
    const hash = account.hash
    return { timestamp, hash }
  }
```