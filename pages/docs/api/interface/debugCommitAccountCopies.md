# debugCommitAccountCopies

The `debugCommitAccountCopies` function is for a dapp to restore account data in a debug situation. It will call back into the dapp and instruct it to commit each account. It takes an array of account data and pushes it directly into the system with app.resetAccountData.
Account backup copies and in memory global account backups are also updated. It's parameters are:

-`accountCopies` - an array of account data
