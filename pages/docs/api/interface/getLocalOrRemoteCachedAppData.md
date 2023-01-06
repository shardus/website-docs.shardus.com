# getLocalOrRemoteCachedAppData

The `getLocalOrRemoteCachedAppData` function is used to return the cached app data whether the account is remote or local. If it is remote, then it will request the data from a consensus node. Else, it will look it up using the parameters given. This function is very useful as validator nodes can use this to store data(for example, recent receipts) in cache, which will take load off of the archiver/collector/explorer, and also allow you to get the data faster because as you do not have to wait for it to be ingested in its eventual long term location. It has 2 parameters:

-`topic` - a string representing the topic
-`dataId` - the data ID
