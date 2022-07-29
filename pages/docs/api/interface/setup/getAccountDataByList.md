# getAccountDataByList

This function is required to be implemented by the app developer for internal use by Shardus. It takes in 1 parameter.

- `addressList` - an array of account addresses

Using the passed in list of addresses, find the corresponding accounts within your database, wrap them in an object with:

- `accountId` - the account ID
- `stateId` - the hash property on the account
- `data` - the entire account object
- `timestamp` - the timestamp property on the account

> Because Shardus allows you to use whatever kind of database you choose, this is required to be implemented by the app developer, so Shardus can grab the account data for its internal uses.

```javascript
getAccountDataByList(addressList) {
    const results = [];
    for (const address of addressList) {
      const account = accounts[address];
      if (account) {
        const wrapped = {
          accountId: account.id,
          stateId: account.hash,
          data: account,
          timestamp: account.timestamp
        };
        results.push(wrapped);
      }
    }
    return results;
  }
```
