# getAccountDataByRange

> This function can return data for accounts that have been modified within a specified timeframe. For example, if you want all accounts that have been modified within the last 24 hours, you could do that here.

```javascript
getAccountDataByRange(accountStart, accountEnd, tsStart, tsEnd, maxRecords) {
  const results = [];
  const start = parseInt(accountStart, 16);
  const end = parseInt(accountEnd, 16);
  // Loop all accounts
  for (const account of Object.values(accounts)) {
    // Skip if not in account id range
    const id = parseInt(account.id, 16);
    if (id < start || id > end) continue;
    // Skip if not in timestamp range
    const timestamp = account.timestamp;
    if (timestamp < tsStart || timestamp > tsEnd) continue;
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
