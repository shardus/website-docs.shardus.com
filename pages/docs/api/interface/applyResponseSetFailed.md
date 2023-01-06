# applyResponseSetFailed

`applyResponseSetFailed` is used internally by Shardus to set the failMessage field in the resultObject. The function takes in two parameters:

- `resultObject` - a `ShardusTypes.ApplyResponse` object generated from the `apply` function.
- `failMessage` - a `string` that contains the fail message.


```ts
applyResponseSetFailed(resultObject: ShardusTypes.ApplyResponse, failMessage: string) {
    resultObject.failed = true
    resultObject.failMessage = failMessage
  }
```