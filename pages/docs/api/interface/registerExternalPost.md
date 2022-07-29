import Callout from 'nextra-theme-docs/callout'

# registerExternalPost

`registerExternalPost` is used for registering API routes in your application. As the name suggests, it's used to register POST requests. This function takes two parameters:

- `route` is a `string` representing the route of the request.
- `handler` is the `callback` function that will be executed when a request comes in that matches the route.

<Callout emoji="🚨" type="error">

It is usually the case that `POST` requests are used to modify or post data to an application. In the case of a Shardus application, this cannot be done directly using a `POST` request because the entire network needs to agree on the data being changed. This is why Shardus revolves around transactions, which are propagated to all the other nodes in the network. The only useful thing to use `registerExternalPost` for is the inject endpoint for transactions.

</Callout>

```ts
dapp.registerExternalPost(
  'inject',
  async (req, res): Promise<void> => {
    try {
      const result = dapp.put(req.body)
      res.json({ result })
    } catch (error) {
      dapp.log(error)
      res.json({ error })
    }
  },
)
```
