import Callout from 'nextra-theme-docs/callout'

# API

Shardus provides you with the ability to register api endpoints with [registerExternalGet](../../api/interface/registerExternalGet) and [registerExternalPost](../../api/interface/registerExternalPost). Anything that users should be able to query data wise should be registered in the server side code using these methods. This is where using a hashed naming convention pays off. In our liberdus payment network application, we should be able to query all proposal account data without having access to the accountId's of a single proposal account.

## Example

<Callout emoji="💡" type="default">

Each proposal account id can be held by another "storage" account. In liberdus we call these storage accounts `issues` and they're meant to hold the id's of all the proposals submitted during that network voting cycle. Querying all proposal accounts can be achieved as easily as this:

</Callout>

```ts
dapp.registerExternalGet(
  'proposals',
  async (req, res): Promise<void> => {
    // Query the global network data
    const network = await dapp.getLocalOrRemoteAccount(networkAccount)
    try {
      const proposals = [] // create list for proposal account data
      for (let i = 1; i <= network.data.issue; i++) { // loop through all issue's
        const issue = await dapp.getLocalOrRemoteAccount(crypto.hash(`issue-${i}`))
        const proposalCount = issue && issue.data.proposalCount
        for (let j = 1; j <= proposalCount; j++) { // loop through all proposals for hash(`issue-${i}`)
          const proposal = await dapp.getLocalOrRemoteAccount(crypto.hash(`issue-${i}-proposal-${j}`))
          if (proposal && proposal.data) {
            proposals.push(proposal.data) // add to list of proposal data
          }
        }
      }
      res.json({ proposals }) // send the data back to the client
    } catch (error) {
      dapp.log(error)
      res.json({ error })
    }
  },
)
```

## Important Notes

<Callout emoji="⚠️" type="warning">

[getLocalOrRemoteAccount](../../api/interface/getLocalOrRemoteAccount) is a crucial method for accessing account data within your server side code. Because the networks built by shardus are "sharded", anytime a node needs access to account data, it's probable that it doesn't have it and needs to communicate with the nodes in the shard that hold that data. In the example above, you can see it referenced 3 different times. Every single data query from server side code will involve grabbing some account by their id using `dapp.getLocalOrRemoteAccount`

</Callout>
