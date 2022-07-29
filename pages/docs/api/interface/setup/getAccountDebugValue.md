# getAccountDebugValue

This function is not required to be implemented, but it will aid in debugging state data across shards. It takes in an Account Object as a parameter and is expected to return a string of the account data.

```ts
const stringify = require('fast-stable-stringify')

function getAccountDebugValue(wrappedAccount) {
  return `${stringify(wrappedAccount)}`
}
```
