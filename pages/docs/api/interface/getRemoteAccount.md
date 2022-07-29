# getRemoteAccount

`getRemoteAccount` is a function that should be used when you know the node requesting data will not have it locally; otherwise, it would be sufficient to use [getLocalOrRemoteAccount](./getLocalOrRemoteAccount). The only place where this is utilized is within the [sync](./setup/sync) function, because a syncing node will not have access to any local data yet.
