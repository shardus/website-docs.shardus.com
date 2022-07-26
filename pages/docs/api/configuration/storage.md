# Storage Configuration

## Default storage config

```json
{
  "database": "database",
  "username": "username",
  "password": "password",
  "options": {
    "logging": false,
    "host": "localhost",
    "dialect": "sqlite",
    "operatorsAliases": false,
    "pool": {
      "max": 5,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    },
    "storage": "db/db.sqlite",
    "sync": { "force": false },
    "memoryFile": false
  }
}

```

As of right now, it's best to leave the default storage configuration alone. This configuration is used by Shardus for its internal SQLite storage use cases.

> If you really want to, this file could be modified to use a separate internal database, but it may require lots of changes on your end to make Shardus work with it.

Here's a list of the default parameters that are used, and that you **should** use:

```json
{
  "database": "database",
  "username": "username",
  "password": "password",
  "options": {
    "logging": false,
    "host": "localhost",
    "dialect": "sqlite",
    "operatorsAliases": false,
    "pool": {
      "max": 5,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    },
    "storage": "db/db.sqlite",
    "sync": { "force": false },
    "memoryFile": false
  }
}
```
