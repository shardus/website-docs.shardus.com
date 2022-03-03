# What Are Shardus's Main Performance Advantages? 

The primary performance advantage with Shardus is that it scales linearly. As a result, unlike other blockchains, applications built with Shardus don't have a maximum TPS (transactions per second).

> Since Shardus was built with *linear scalability* in mind, the TPS for any network depends on how large that particular network is. It also depends on the [configuration](../api/configuration) setup for that network, specifically the `nodesPerConsensusGroup` parameter.

As a simplified example, let's imagine that you have 100 nodes running the network and a `nodesPerConsensusGroup` size of 10. Let's say that the maximum number of transactions per second that a single shard can handle is 100 TPS. With a consensus size of 10 nodes, and 100 nodes in the network, we have 10 shards. If each of these shards were operating at maximal capacity, we could expect the network as a whole to process about 1,000 TPS.

But now let's say that 100 more blockchain hobbyists decide to run nodes on this network and the network size grows to 200 nodes. This leaves us with 20 shards, or 2000 TPS at maximum capacity. Of course, these figures can't be completely exact, but it provides an effective example that shows that there is no max TPS.

> The more nodes that connect to a Shardus-based network, the faster it becomes.
