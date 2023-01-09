import Callout from 'nextra-theme-docs/callout'

# getStateID

This function is not required to be implemented by the app developer for internal use by Shardus. It returns the State ID for a given Account Address. Basically, It does this by returning a hash of the account. It takes in 1 parameter, and has another that has a default value of true:

- `accountAddress` - a string containg the account address
- `mustExist` - a boolean value that is typically set to true

<Callout emoji="💡" type="default">

The code below shows an example implementation.

</Callout>

```javascript
getStateId(accountAddress: string, mustExist = true): string {
    const account = accounts[accountAddress]
    if ((typeof account === 'undefined' || account === null) && mustExist === true) {
      throw new Error('Could not get stateId for account ' + accountAddress)
    }
    const stateId = account.hash
    return stateId
  }
```