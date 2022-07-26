# Configuration

Shardus lets you set configuration parameters for how you want your network to operate. This can easily be done when initializing Shardus in your app for the first time. Simply pass in your configuration object to Shardus, and you're done.

```javascript
const shardus = require("shardus-enterprise-server");
const configs = require("configs");
const baseDirPath = process.env[2] || "./";

const shardus = Shardus({
  server: {
    baseDir: baseDirPath,
    ip: configs.appconfig.ip,
    cycleDuration: configs.appconfig.cycleDuration,
    reporting: configs.appconfig.reporting,
    p2p: configs.appconfig.p2p,
    loadDetection: configs.appconfig.loadDetection,
    rateLimiting: configs.appconfig.rateLimiting,
    stateManager: configs.appconfig.stateManager
  }
});
```

## Default configs

> Shardus has default configuration parameters set for the network if the config options passed in don't override all the available settings, so don't worry about getting configs set up perfectly. These settings are geared more towards fine tuning the network behavior you want from your application before deploying to production.

Below are the default configurations used by Shardus, if nothing is passed in by the user:

- [Default server config](/docs/api/configuration/server#default-server-config)
- [Default logs config](/docs/api/configuration/logs#default-logs-config)
- [Default storage config](/docs/api/configuration/storage#default-storage-config)

> Depending on your type of application and what it demands, it might be wise to experiment beforehand with some of these parameters, just to get familiar with how well your specific application runs.

Shardus takes in 3 root level configuration objects, each having additional nested configs for the module to use:

- `server`
- `logs`
- `storage`

## Server

The server configuration deals with network size, load detection, rate limiting, internal peer-to-peer communication, heartbeat intervals, transaction times, cycle durations and much more...

The server config takes in the following parameters:

1. `heartbeatInterval` (Integer)
2. `baseDir` (String)
3. `transactionExpireTime` (Integer)
4. `crypto` (Object)
5. `p2p` (Object)
6. `ip` (Object)
7. `network` (Object)
8. `reporting` (Object)
9. `debug` (Object)
10. `statistics` (Object)
11. `loadDetection` (Object)
12. `rateLimiting` (Object)
13. `stateManager` (Object)
14. `sharding` (Object)

[More details...](server)

## Logs

The logs configuration deals with things like log file names, logging output depth and detail, max log file size, and number of backups.

The log config takes in the following parameters:

1. `dir` (String)
2. `files` (Object)
3. `options` (Object)

[More details...](logs)

## Storage

The storage configuration deals with things like database credentials, database host, database logging, dialect, operator aliases, and storage path.

The storage config takes in the following parameters:

1. `database` (String)
2. `username` (String)
3. `password` (String)
4. `options` (Object)

[More details...](storage)
