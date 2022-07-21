import Callout from 'nextra-theme-docs/callout'

# Robustness

Making a transaction robust means that you add as many different security measures as possible. The goal is to make a transaction as robust as possible, without complicating the implementation. The "robust" transaction example shown below is part of the dynamic voting system in Liberdus. The transaction type we will demonstrate here is called `apply_parameters`. This transaction is responsible for changing the network parameters by applying the parameters held by the winning proposal from the recent voting results.


> Since this transaction could drastically change the way the network is run, security and validation is at the utmost importance. We want to implement as many security measures we can take to protect against vulnerablities and hacks. The first step we can take is making sure this transaction is only valid during a particular time window. Liberdus works through a cycling system of 4 phases that start with proposals, then voting, then tallying, and finally applying. These time windows are represented within the global network parameters and can be used to validate transactions based on where their timestamp falls between the 4 phases. The second step to making this transaction more robust is to ensure the issue is still active (A boolean field that is flipped to false after finishing this network cycle).

<Callout emoji="👇" type="default"> 

Making the `apply_parameters` transaction robust.

</Callout>

```ts
// Validation case for the 'apply_parameters' transaction type
case 'apply_parameters': {
    const network: NetworkAccount = wrappedStates[tx.network].data
    const issue: IssueAccount = wrappedStates[tx.issue].data

    if (network.id !== '0'.repeat(64)) {
        response.reason = 'To account must be the network account'
        return response
    }
    if (tx.timestamp < network.windows.applyWindow[0] || tx.timestamp > network.applyWindow[1]) {
        response.reason = 'Network is not currently in the apply window'
        return response
    }
    if (!issue) {
        response.reason = "Issue doesn't exist"
        return response
    }
    if (issue.active === false) {
        response.reason = 'This issue is no longer active'
        return response
    }
    response.success = true
    response.reason = 'This transaction is valid!'
    return response
}
```

