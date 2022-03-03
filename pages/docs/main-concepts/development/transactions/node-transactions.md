# Node Transactions

Anytime you need the network to automatically change state on its own, you need node transactions. These transactions can be triggered by the nodes running the network and are useful for things like tallying votes after a specified time frame.

Liberdus is an application that required a few of these transactions, things like generating accounts to hold proposal submissions by users, counting the votes of each proposal, updating the network parameters, and submitting payments to developers.

## Generating

This `issue` transaction is responsible for automatically creating an account that holds a list of proposal account id's that users can submit. The purpose of this is so that you can easily query the network when you want to find all the proposals submitted to the nth network voting cycle. By creating accounts like this (hashing a numbered string values) you can easily find what the id of the current issue is (querying the global network variables) and then hashing the value using `crypto.hash("issue-"+ network.issue)`.

```ts
async function generateIssue(address: string, nodeId: string): Promise<void> {
  const account = await dapp.getLocalOrRemoteAccount(networkAccount)
  const network: NetworkAccount = account.data // Grab the global network variables
  const tx = {
    type: 'issue', // the type of transaction being submitted
    network: '0'.repeat(64), // The account holding the global network variables
    nodeId: nodeId, // The nodeId of the node submitting the transaction
    from: address, // the publicKey of the node submitting the transaction
    issue: crypto.hash(`issue-${network.issue}`), // the publicKey of the next issue account
    proposal: crypto.hash(`issue-${network.issue}-proposal-1`), // the publicKey of the default proposal (No change from the current parameters)
    timestamp: Date.now(), // the timestamp of the transaction creation
  }
  dapp.put(tx) // send the transaction to the network
  dapp.log('GENERATED_ISSUE: ', nodeId)
}
```

## Keys

The keys of any transaction are going to resemble the public keys of the accounts associated with the transaction. We are required to specify these in [getKeyFromTransaction](../../../api/interface/setup/getKeyFromTransaction). This particular transaction requires 4 keys.

```ts
case 'issue':
    result.sourceKeys = [tx.from]
    result.targetKeys = [tx.issue, tx.proposal, tx.network]
    break
```

## Validation

Validation of the `issue` transaction requires making sure the issue id matches the hash of the current network issue, making sure the issue account hasn't already been created, and that the proposal id matches what the hash of the current network issue's default proposal is.

```ts
case 'issue': {
    const network: NetworkAccount = wrappedStates[tx.network].data
    const issue: IssueAccount = wrappedStates[tx.issue] && wrappedStates[tx.issue].data
    if (issue.active !== null) { // Check to make sure this issue hasn't already been created
        response.reason = 'Issue is already active'
        return response
    }
    const networkIssueHash = crypto.hash(`issue-${network.issue}`)
    if (tx.issue !== networkIssueHash) { // Check to make sure the issue id matches the next issue hash
        response.reason = `issue hash (${tx.issue}) does not match current network issue hash (${networkIssueHash})`
        return response
    }
    const networkProposalHash = crypto.hash(`issue-${network.issue}-proposal-1`)
    if (tx.proposal !== networkProposalHash) { // Ensure the default proposal hash matches the next default proposal hash
        response.reason = `proposalHash (${tx.proposal}) does not match the current default network proposal (${networkProposalHash})`
        return response
    }
    response.success = true
    response.reason = 'This transaction is valid!'
    return response
}
```

## Applying

We modify 2 different accounts in this transaction, first the proposal, then the issue. The proposal will serve as the last parameters (no change) option which comes by default on every voting cycle. Deep clone the current network parameters, then give the account some default title and description. Next set the issue number to the current network issue number and set active to true. Add the default proposal id to the proposals array and increment the issue's `proposalCount`.

```ts
case 'issue': {
    const network: NetworkAccount = wrappedStates[tx.network].data
    const issue: IssueAccount = wrappedStates[tx.issue].data
    const proposal: ProposalAccount = wrappedStates[tx.proposal].data

    proposal.parameters = _.cloneDeep(network.current)
    proposal.parameters.title = 'Default parameters'
    proposal.parameters.description = 'Keep the current network parameters as they are'
    proposal.number = 1

    issue.number = network.issue
    issue.active = true
    issue.proposals.push(proposal.id)
    issue.proposalCount++

    from.timestamp = tx.timestamp
    issue.timestamp = tx.timestamp
    proposal.timestamp = tx.timestamp
    dapp.log('Applied issue tx', issue, proposal)
    break
}
```
