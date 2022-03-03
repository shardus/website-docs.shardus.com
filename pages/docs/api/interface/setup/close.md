# close

This function is required to be implemented by the app developer for internal use by shardus. It doesn't take in any parameters.

> Whatever is in this function will be executed when the server shuts down, so it might be useful to log whatever you need here

```javascript
close() {
  console.log("Shutting down server...");
}
```
