# tryInvolveAccount

The `tryInvolveAccount` function is used to try to inolve an account in a transaction if it isn't already involved. The function will check if the account is already involved, and if not, it will involve it. It returns a boolean value of whether it was involved or not.  It's parameters are:

-`txId` - the transaction's ID
-`address` - the account's address
-`isRead` - a boolean specifying whether the account is involved in reading or writing

