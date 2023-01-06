# patchObject

The `patchObject` function is used to update the values of an object ,`existingObject`, with the values of another object `changeObj`. It does this by iterating over the key-value pairs of `changeObj` and updating the corresponding key-value pairs in `existingObject`. It will also log the keys value patches. It has no return type and 2 parameters:

-`existingObject` - the original object
-`changeObj` - the object with the new values

```ts
patchObject(existingObject: any, changeObj: any) {
    for (const [key, value] of Object.entries(changeObj)) {
      if (existingObject[key] != null) {
        if (typeof value === 'object') {
          this.patchObject(existingObject[key], value)
        } else {
          existingObject[key] = value
          this.mainLogger.info(`patched ${key} to ${value}`)
          nestedCountersInstance.countEvent('config', `patched ${key} to ${value}`)
        }
      }
    }
  }
```