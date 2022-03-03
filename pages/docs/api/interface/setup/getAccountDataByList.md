# getAccountDataByList

This function is required to be implemented by the app developer for internal use by shardus. It takes in 1 parameter.

1. `addressList` An array of account addresses

Using the passed in list of addresses, find the corresponding accounts within your database, wrap them in an object with:

1. `accountId`: The account id
2. `stateId`: The hash property on the account
3. `data`: The entire account object
4. `timestamp`: The timestamp property on the account

> Because shardus allows you to use whatever kind of database you choose, this is required by the app developer to implement so shardus can grab the account data for it's internal uses.

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
