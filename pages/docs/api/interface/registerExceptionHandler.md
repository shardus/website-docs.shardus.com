# registerExceptionHandler

`registerExceptionHandler` is an essential function that must be invoked after calling [setup](./setup) in your application. It is used to register exit handlers for exceptions such as `'uncaughtException'` and `'unhandledRejection'`. You can see below how the function works under the hood.

```ts
/**
* Registers exception handlers for "uncaughtException" and "unhandledRejection"
*/
registerExceptionHandler() {
  const logFatalAndExit = err => {
    console.log('Encountered a fatal error. Check fatal log for details.')
    this.fatalLogger.fatal('unhandledRejection: ' + err.stack)
    // this.exitHandler.exitCleanly()
    this.exitHandler.exitUncleanly()
  }
  process.on('uncaughtException', err => {
    logFatalAndExit(err)
  })
  process.on('unhandledRejection', err => {
    logFatalAndExit(err)
  })
}
```
