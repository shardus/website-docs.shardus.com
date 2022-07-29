# getAccountData

This function is required to be implemented by the app developer for internal use by Shardus. It takes in 3 parameters.

- `accountStart` - the start of account IDs in the range Shardus wants to grab from
- `accountEnd` - the end of account IDs in the range Shardus wants to grab from
- `maxRecords` - the maximum number of account records Shardus wants to get back from the function

> Because Shardus allows you to use whatever kind of database you choose, this is required to be implemented by the app developer, so Shardus can grab the account data for its internal uses.

```javascript
getAccountData(accountStart, accountEnd, maxRecords) {
    const results = [];
    const start = parseInt(accountStart, 16);
    const end = parseInt(accountEnd, 16);
    // Loop all accounts
    for (const account of Object.values(accounts)) {
      // Skip if not in account id range
      const id = parseInt(account.id, 16);
      if (id < start || id > end) continue;

      // Add to results
      const wrapped = {
        accountId: account.id,
        stateId: account.hash,
        data: account,
        timestamp: account.timestamp
      };
      results.push(wrapped);

      // Return results early if maxRecords reached
      if (results.length >= maxRecords) return results;
    }
    return results;
  }
```

> This example uses a local, in-memory `accounts` object to store account data, but you can use whatever you wish.
