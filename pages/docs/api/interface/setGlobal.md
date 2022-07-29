import Callout from 'nextra-theme-docs/callout'

# setGlobal

`setGlobal` is a method that submits a special transaction to the network that will modify global variables that are meant to be accessible by all nodes. The `setGlobal` method takes 4 parameters:

1. `address` is a `string` that represents the address of the global account
2. `value` is the transaction object that will be submitted to the network
3. `when` is the time the transaction should be applied to the network
4. `source` is the account that originated the transaction

## Why is this important?

<Callout emoji="💡" type="warning">

`setGlobal` was a method we decided to add to Shardus when we found the need for global variables. [Liberdus](https://liberdus.com) required global variables that we were able to add by introducing the `setGlobal` method. It works by submitting a transaction with a special `global` flag that aims to eventually get applied to every shard in the network. Since normal accounts are only stored in a single shard, it defeated the purpose of scalability since the global variables needed to be accessed frequently by every node. Shown below is an example of the `tally` transaction for scoring the votes for all the proposal submissions to change the network parameters.

</Callout>

```ts
function apply(tx, wrappedStates) {
    switch (tx.type) {
        case 'tally': {
            const network: NetworkAccount = wrappedStates[tx.network].data
            const issue: IssueAccount = wrappedStates[tx.issue].data
            const margin = 100 / (2 * (issue.proposalCount + 1)) / 100

            const defaultProposal: ProposalAccount = wrappedStates[crypto.hash(`issue-${issue.number}-proposal-1`)].data
            const sortedProposals: ProposalAccount[] = tx.proposals
                .map((id: string) => wrappedStates[id].data)
                .sort((a: ProposalAccount, b: ProposalAccount) => a.power < b.power)
            let winner = defaultProposal

            for (const proposal of sortedProposals) {
                proposal.winner = false
            }

            if (sortedProposals.length >= 2) {
                const firstPlace = sortedProposals[0]
                const secondPlace = sortedProposals[1]
                const marginToWin = secondPlace.power + margin * secondPlace.power
                if (firstPlace.power >= marginToWin) {
                    winner = firstPlace
                }
            }

            winner.winner = true
            const next = winner.parameters
            const nextWindows: Windows = {
                proposalWindow: [
                    network.windows.applyWindow[1], network.windows.applyWindow[1] + TIME_FOR_PROPOSALS
                ],
                votingWindow: [
                    network.windows.applyWindow[1] + TIME_FOR_PROPOSALS, network.windows.applyWindow[1] +
                    TIME_FOR_PROPOSALS + TIME_FOR_VOTING
                ],
                graceWindow: [
                    network.windows.applyWindow[1] + TIME_FOR_PROPOSALS + TIME_FOR_VOTING,
                    network.windows.applyWindow[1] + TIME_FOR_PROPOSALS + TIME_FOR_VOTING + TIME_FOR_GRACE,
                ],
                applyWindow: [
                    network.windows.applyWindow[1] + TIME_FOR_PROPOSALS + TIME_FOR_VOTING + TIME_FOR_GRACE,
                    network.windows.applyWindow[1] + TIME_FOR_PROPOSALS + TIME_FOR_VOTING + TIME_FOR_GRACE + TIME_FOR_APPLY,
                ],
            }

           const when = tx.timestamp + ONE_SECOND * 10

            dapp.setGlobal(
                networkAccount,
                {
                    type: 'apply_tally',
                    timestamp: when,
                    network: networkAccount,
                    next,
                    nextWindows,
                },
                when,
                networkAccount,
            )

           issue.winner = winner.id

           from.timestamp = tx.timestamp
           issue.timestamp = tx.timestamp
           winner.timestamp = tx.timestamp
           dapp.log('APPLIED TALLY TX')
           break
        }
        case 'apply_tally': {
           const network: NetworkAccount = wrappedStates[tx.network].data
           network.next = tx.next
           network.nextWindows = tx.nextWindows
           network.timestamp = tx.timestamp
           dapp.log(`APPLIED TALLY GLOBAL`)
           break
        }
    }
}
```



> This transaction works by grabbing all the proposal accounts from the most recent `issue` account and finding the account with the most votes. If the proposal with the most votes doesn't beat 2nd place by a margin of `100 / (2 * (proposalCount + 1)) / 100` votes, then the default proposal or "no change" will be applied. We also create the next window time frames for all the network phases within the next voting cycle.
