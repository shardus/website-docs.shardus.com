# forwardAccounts

The `forwardAccounts` function is used to forward the inputted data to all of the archiver nodes. It does this by creating a tagged data response object using `data`, and then sending it to all archivers. If there are no archivers connected, it will log that of the console. It's parameters are:

-`data` - an object that contains an array of account data and an array of recipts
