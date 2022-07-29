# constructor

The constructor for Shardus expects a configuration object with settings that resemble the likes of [configuration](../configuration/README). If you don't provide a configuration object, Shardus will use its default configuration which you can also find [here](../configuration/README#default-configs).

```ts
import shardus from 'shardus-global-server'
import config from './config'

const dapp = shardus(config)
```
