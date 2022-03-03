# validate

Shardus expects a function called `validate` to be passed in to `setup`. This
function is provided with the transaction as an argument passed into the
function.

This function needs to return an object with the following properties: `{
result, reason }`. `result` should be a boolean, `reason` should be
a string with a descriptive reason for why the result passed or failed

The purpose of this function is to add an extra validation checkpoint for the
fields passed into the transaction. It should check to make sure all the
correct data types are passed in to the specific type of transaction that's
about to be processed. Basically, it's just to make sure nothing was passed in
as the wrong data type, or that certain fields that need to exists on objects
do exist, and with the correct primitive types. You don't need to worry about
this function too much for development purposes, it's just an extra precaution
for the most part.

> `validate` is where most of the the critical validation happens. But it's
> never a bad idea to type check before passing it along to to validate. The
> important part here is that result gets labeled `"pass"` for things to move
> on to the `apply` function, and that you pass in the timestamp to the object
> your return.

> Here's an example of how my `validate` was implemented for a messaging application:

```javascript
validate(tx) {

  let result = "pass";
  let reason = "";
  let timestamp = tx.timestamp;

  let srcAddress = tx.srcAcc;
  let tgtAddress = tx.tgtAcc;
  let amount = tx.amount;
  let type = tx.type;
  let sign = tx.sign;

  if (sign && typeof sign.owner !== "string") {
    result = "fail";
    reason = '"sign.owner" must be a string.';
    throw new Error(reason);
  }

  if (sign && typeof sign.sig !== "string") {
    result = "fail";
    reason = '"sign.sig" must be a string.';
    throw new Error(reason);
  }

  if (typeof type !== "string") {
    result = "fail";
    reason = '"type" must be a string.';
    throw new Error(reason);
  }

  if (srcAddress && typeof srcAddress !== "string") {
    result = "fail";
    reason = '"srcAddress" must be a string.';
    throw new Error(reason);
  }

  if (tgtAddress && typeof tgtAddress !== "string") {
    result = "fail";
    reason = '"tgtAddress" must be a string.';
    throw new Error(reason);
  }

  if (amount && typeof amount !== "number") {
    result = "fail";
    reason = '"amount" must be a number.';
    throw new Error(reason);
  }

  if (typeof timestamp !== "number") {
    result = "fail";
    reason = '"timestamp" must be a number.';
    throw new Error(reason);
  }

  return {
    result,
    reason,
    timestamp
  };

}
```
