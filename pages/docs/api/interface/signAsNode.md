# signAsNode

`signAsNode` is used internally to the the object that is passed in as an arguement. The function takes 1 parameter:

- `obj` - the object to be signed

Below is the implementation of it.

```ts
signAsNode(obj) {
    return this.crypto.sign(obj)
  }
```
