import Callout from 'nextra-theme-docs/callout'

# getAccountTimestamp

This function is not required to be implemented by the app developer for internal use by Shardus. It returns the timestamp of an account given its account address, and it takes in 2 parameters:

- `accountAddress` - a string containg the account address
- `mustExist` - a boolean value that is typically set to true

<Callout emoji="💡" type="default">

The code below shows an example implementation.

</Callout>

```javascript
getAccountTimestamp(accountAddress: string, mustExist = true): number {
    const account = accounts[accountAddress]
    if ((typeof account === 'undefined' || account === null) && mustExist === true) {
      throw new Error('Could not get getAccountTimestamp for account ' + accountAddress)
    }
    const timestamp = account.timestamp
    return timestamp
  }
```