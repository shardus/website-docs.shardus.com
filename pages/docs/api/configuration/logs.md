# Logs Configuration

## Default logs config

```json
{
  "saveConsoleOutput": true,
  "dir": "logs",
  "files": { "main": "", "fatal": "", "net": "" },
  "options": {
    "appenders": {
      "out": { "type": "console" },
      "main": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "p2p": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "cycle": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "fatal": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "errorFile": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "errors": {
        "type": "logLevelFilter",
        "level": "ERROR",
        "appender": "errorFile"
      },
      "net": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "playback": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      },
      "shardDump": {
        "type": "file",
        "maxLogSize": 10000000,
        "backups": 10
      }
    },
    "categories": {
      "default": { "appenders": ["out"], "level": "trace" },
      "main": { "appenders": ["main", "errors"], "level": "trace" },
      "p2p": { "appenders": ["p2p"], "level": "trace" },
      "cycle": { "appenders": ["cycle"], "level": "trace" },
      "fatal": { "appenders": ["fatal"], "level": "fatal" },
      "net": { "appenders": ["net"], "level": "trace" },
      "playback": { "appenders": ["playback"], "level": "trace" },
      "shardDump": { "appenders": ["shardDump"], "level": "trace" }
    }
  }
}
```

## dir

The `dir` parameter is a `String` used to define the base directory where the logs files will be generated and stored

```json
{
  "dir": "logs"
}
```

## files

The `files` parameter is an `Object` used to define the file names for the various log types

```json
{
  "files": { "main": "", "fatal": "", "net": "" }
}
```

> The `main` parameter is a `String` that defines the file name for the main logs

> The `fatal` parameter is a `String` that defines the file name for the fatal logs

> The `net` parameter is a `String` that defines the file name for the net logs

## options

The `options` parameter is an `Object` used to define a subset of option parameters

```json
"options": {
  "appenders": {},
  "categories": {}
}
```

## appenders

The `appenders` parameter is an `Object` used to define output settings for the different types of log files.

```json
"appenders": {
  "out": { "type": "console" },
  "main": {
    "type": "file",
    "maxLogSize": 10000000,
    "backups": 10
  },
  "fatal": {
    "type": "file",
    "maxLogSize": 10000000,
    "backups": 10
  },
  "errorFile": {
    "type": "file",
    "maxLogSize": 10000000,
    "backups": 10
  },
  "errors": {
    "type": "logLevelFilter",
    "level": "ERROR",
    "appender": "errorFile"
  },
  "net": {
    "type": "file",
    "maxLogSize": 10000000,
    "backups": 10
  },
  "playback": {
    "type": "file",
    "maxLogSize": 10000000,
    "backups": 10
  }
}
```

There are 7 configurations objects for `appenders` that each have their own sub configuration parameters.

1. `out` is an `Object` that configures console output
2. `main` is an `Object` that configures output for main applications logs
3. `fatal` is an `Object` that configures output for fatal application logs

```json
[2019-10-08T13:36:08.664] [FATAL] fatal - tryApplyTransaction failed: Error: invalid transaction, reason: Source account does not have sufficient funds.. tx: {"amount":50,"message":"{\"body\":\"hello\",\"handle\":\"jeff\",\"timestamp\":1570559762588}","srcAcc":"9407cff230d002bc9956594c0cfb18587d4db374705273d0dc07b48d92f14879","tgtAcc":"4fd17af679355102e9262c74152545c4f15bcf90f881475644b9ab1b437eb97c","timestamp":1570559762592,"type":"message","sign":{"owner":"9407cff230d002bc9956594c0cfb18587d4db374705273d0dc07b48d92f14879","sig":"8e824f755571e78aefceae420e74b31bd9b84168db000cd1ec28783aa91f73fb7e4b82d6e0ade192dac7a7c788880930e03aaa30de0c2c644f17e7857686ab08f4cb9ca5269f8da52b3421996032249ced77b95fb5d6acaa66e2831b51eb5517"}} at Error: invalid transaction, reason: Source account does not have sufficient funds.. tx: {"amount":50,"message":"{\"body\":\"hello\",\"handle\":\"jeff\",\"timestamp\":1570559762588}","srcAcc":"9407cff230d002bc9956594c0cfb18587d4db374705273d0dc07b48d92f14879","tgtAcc":"4fd17af679355102e9262c74152545c4f15bcf90f881475644b9ab1b437eb97c","timestamp":1570559762592,"type":"message","sign":{"owner":"9407cff230d002bc9956594c0cfb18587d4db374705273d0dc07b48d92f14879","sig":"8e824f755571e78aefceae420e74b31bd9b84168db000cd1ec28783aa91f73fb7e4b82d6e0ade192dac7a7c788880930e03aaa30de0c2c644f17e7857686ab08f4cb9ca5269f8da52b3421996032249ced77b95fb5d6acaa66e2831b51eb5517"}}
    at Object.apply (/Users/kyle/Desktop/dappChat/index.js:621:13)
    at Object.applicationInterfaceImpl.apply (/Users/kyle/shardus-global-server/src/shardus/index.js:458:85)
    at StateManager.tryApplyTransaction (/Users/kyle/shardus-global-server/src/state-manager/index.js:3317:38)
```

4. `errorFile` is an `Object` that configures output for error logs
5. `errors` is an `Object` that configures filtering for application ERROR throwing
6. `net` is an `Object` that configures output for network logs

```json
[2019-10-08T13:28:53.973] [DEBUG] net - External	{"url":"/inject","method":"POST","body":{"type":"register","id":"1169de28b4cf6afe87f77268673f5d39fe25faf1be7c4782832beb7a10b1ca4c","handle":"kyle","srcAcc":"4fd17af679355102e9262c74152545c4f15bcf90f881475644b9ab1b437eb97c","timestamp":1570559333945,"sign":{"owner":"4fd17af679355102e9262c74152545c4f15bcf90f881475644b9ab1b437eb97c","sig":"ac997e3bff584c09fdd52dc580b366a11084c7185d079f615e1b032050a27558bb5783298678495be13722ac885aae58313fad656ba85394bcdbb2f43e3a12021e5bf1f5e6758db6e431fd771728d9bdd09c70a4600bd88e6d7ddc9fb7287e3c"}}}
[2019-10-08T13:28:56.754] [DEBUG] net - External	{"url":"/seednodes","method":"GET","body":{}}
[2019-10-08T13:29:11.760] [DEBUG] net - External	{"url":"/seednodes","method":"GET","body":{}}
[2019-10-08T13:29:16.079] [DEBUG] net - External	{"url":"/inject","method":"POST","body":{"type":"claim_reward","srcAcc":"0000000000000000000000000000000000000000000000000000000000000000","tgtAcc":"4fd17af679355102e9262c74152545c4f15bcf90f881475644b9ab1b437eb97c","timestamp":1570559356076,"sign":{"owner":"4fd17af679355102e9262c74152545c4f15bcf90f881475644b9ab1b437eb97c","sig":"b73b691e8b7ac26c88c2e778b9a8af821ab88820e5df307a417e91836d8df4a1a2f571a09810d383958793b5a7e1511ead7ac47d554ed83689e50238d7560a02f95977c847cb49cacb41c4dcc0de43d92fe2bbbca81792f0914587e496c11f30"}}}
[2019-10-08T13:29:23.387] [DEBUG] net - External	{"url":"/inject","method":"POST","body":{"type":"toll","srcAcc":"4fd17af679355102e9262c74152545c4f15bcf90f881475644b9ab1b437eb97c","toll":50,"amount":1,"timestamp":1570559363385,"sign":{"owner":"4fd17af679355102e9262c74152545c4f15bcf90f881475644b9ab1b437eb97c","sig":"a519562a1c5a399cee25b92614165c383fa31a781fccca7da79a0210e001c714c44cc6bf9f93d3cbb11eba4f32517718edf2394b952fcfe5ab8387c87e1b0601b37c58dd778f6bcd7eca37c3f3f63b9815feef28f598f8bf9d81fb8c47a0b2d4"}}}
[2019-10-08T13:29:26.763] [DEBUG] net - External	{"url":"/seednodes","method":"GET","body":{}}
```

7. `playback` is an `Object` that configures output for the playback of everything that occurred during the run of your application

```json
[2019-10-08T13:28:52.941] [TRACE] playback - 	1570559332941	9d85xc5a49:9001	self	127.0.0.1:3000	HttpRequest	/api/heartbeat	-24	{"data":{"appState":"78c7xdeb6d","cycleCounter":2,"cycleMarker":"b5fexc9a0c","desiredNodes":20,"nodeIpInfo":{"externalIp":"127.0.0.1","externalPort":9001,"internalIp":"127.0.0.1","internalPort":9005},"nodelistHash":"6862x8ae4b","partitionReport":{},"reportInterval":2,"txApplied":0,"txExpired":0,"txInjected":0,"txRejected":0},"nodeId":"9d85xc5a49"}
[2019-10-08T13:28:52.944] [TRACE] playback - 	1570559332944	9d85xc5a49:9001	127.0.0.1:3000	self	HttpResponseRecv	/api/heartbeat	-24	{"received":true}
[2019-10-08T13:28:53.973] [TRACE] playback - 	1570559333973	9d85xc5a49:9001	localhost	self	ExternalHttpReq	/inject		{"body":{"handle":"kyle","id":"1169x1ca4c","sign":{"owner":"4fd1xeb97c","sig":"ac99xx87e3c"},"srcAcc":"4fd1xeb97c","timestamp":1570559333945,"type":"register"},"params":{}}
[2019-10-08T13:28:53.974] [TRACE] playback - 	1570559333974	9d85xc5a49:9001			Note	tx_injected	ad2fx9737a	Transaction: {"handle":"kyle","id":"1169x1ca4c","sign":{"owner":"4fd1xeb97c","sig":"ac99xx87e3c"},"srcAcc":"4fd1xeb97c","timestamp":1570559333945,"type":"register"}
[2019-10-08T13:28:53.976] [TRACE] playback - 	1570559333976	9d85xc5a49:9001			Note	shrd_homeNodeSummary	ad2fx9737a	account:4fd1xeb97c rel:failed, no extended data summary:{"consensus":[],"edge":[],"noExtendedData":true,"storedFull":[]}
[2019-10-08T13:28:53.976] [TRACE] playback - 	1570559333976	9d85xc5a49:9001			Note	shrd_homeNodeSummary	ad2fx9737a	account:1169x1ca4c rel:failed, no extended data summary:{"consensus":[],"edge":[],"noExtendedData":true,"storedFull":[]}
[2019-10-08T13:28:53.977] [TRACE] playback - 	1570559333977	9d85xc5a49:9001			Note	shrd_addToQueue	ad2fx9737a	AcceptedTransaction: ad2fx9737a ts: 1570559333945 acc: ["4fd1xeb97c","1169x1ca4c"]
[2019-10-08T13:28:53.977] [TRACE] playback - 	1570559333977	9d85xc5a49:9001			Note	tx_accepted	TransactionId: ad2f89b4a8b8edc6f16962495583374c96b4325bec8997e889ab60d510e9737a	AcceptedTransaction: {"data":{"handle":"kyle","id":"1169x1ca4c","sign":{"owner":"4fd1xeb97c","sig":"ac99xx87e3c"},"srcAcc":"4fd1xeb97c","timestamp":1570559333945,"type":"register"},"id":"ad2fx9737a","receipt":{"sign":{"owner":"f2acx23b2c","sig":"11c4xx90c40"},"targetStateId":null,"time":1570559333975,"txHash":"ad2fx9737a"},"status":1,"timestamp":1570559333945}
[2019-10-08T13:28:54.941] [TRACE] playback - 	1570559334941	9d85xc5a49:9001	self	127.0.0.1:3000	HttpRequest	/api/heartbeat	-25	{"data":{"appState":"78c7xdeb6d","cycleCounter":2,"cycleMarker":"b5fexc9a0c","desiredNodes":20,"nodeIpInfo":{"externalIp":"127.0.0.1","externalPort":9001,"internalIp":"127.0.0.1","internalPort":9005},"nodelistHash":"6862x8ae4b","partitionReport":{},"reportInterval":2,"txApplied":0,"txExpired":0,"txInjected":1,"txRejected":0},"nodeId":"9d85xc5a49"}
[2019-10-08T13:28:54.943] [TRACE] playback - 	1570559334943	9d85xc5a49:9001	127.0.0.1:3000	self	HttpResponseRecv	/api/heartbeat	-25	{"received":true}
```

Each "file" type appender can set 2 additional parameters:

1. `"maxLogSize"` is an `Integer` that declares the maximum size of a log file (in bytes)
2. `"backups"` is an `Integer` that declares the maximum number of log files

## categories

The `categories` parameter is an `Object` used to define the logging categories, as well as defining any appenders to them.

```json
{
  "categories": {
    "default": { "appenders": ["out"], "level": "trace" },
    "main": { "appenders": ["main", "errors"], "level": "trace" },
    "fatal": { "appenders": ["fatal"], "level": "fatal" },
    "net": { "appenders": ["net"], "level": "trace" },
    "playback": { "appenders": ["playback"], "level": "trace" }
  }
}
```

> Setting the level of all the log categories to `"fatal"` will drastically reduce the amount of logs generated and give your application a slight boost in speed.
