# sendCorrespondingCachedAppData

The `sendCorrespondingCachedAppData` function is used by dapps to send cached data to another node for storage. Dapps are allowed to define arbitrary data to cache. They use a topic to have different categories in cache to represent different types of data. The cache improves the performance of validators by allowing them to store some data before sending it to other nodes for long-term storage. This function is used to send the cached data to another node for long term storage. It has 6 parameters:

-`topic` - a string representing the topic
-`dataId` - the data ID
-`appData` - an object containing the dapp's data
-`cycle` - the current cycle number
-`fromId` - this is unused
-`txId` - the transaction ID
