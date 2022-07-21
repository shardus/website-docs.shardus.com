import Callout from 'nextra-theme-docs/callout'
import Bleed from 'nextra-theme-docs/bleed'

# Validation

Validation is used to validate fields in account data to ensure that they meet the requirements for a specific transaction to occur. The most basic example of validation is checking if an account has enough balance to transfer coins to another account. Doing this with shardus is as easy as running a simple `"if" "else"` check. It is recommended to use a helper function for validating each transaction type individualy. For example:


> In this example we will demonstrate how liberdus validates a `transfer` transaction. Below is a typescript interface defining the global network parameters the nodes use to validate transactions against. The only parameter we're concerned with is the `transactionFee`. This parameter is dynamic, meaning users can decide to change this during a voting cycle that occurs every few weeks. Due to the dynamic nature of this application, nodes need access to this data on every transaction to perform validation. This means that one of the transaction keys needs to hold the account data for these parameters, and it needs to be submitted with the transaction. We will use `tx.network` to refer to the address of that account.

<Callout emoji="👇" type="default"> 

Validating account balance for `transfer` transaction and using the network parameters from a global account for the transaction fee.

</Callout>

```ts

interface NetworkParameters {
    transactionFee: number
    // ...,
}

interface NetworkAccount {
    id: string
    current: NetworkParameters
    // ...,
}

interface UserAccount {
    id: string
    data: {
        balance: number
        // ...
    }
    alias: string | null
    timestamp: number
    hash: string
}

switch (tx.type) {
    case 'transfer': {
        const network: NetworkAccount = wrappedStates[tx.network].data
        const from: UserAccount = wrappedStates[tx.from].data
        const to: UserAccount = wrappedStates[tx.to].data
        if (tx.sign.owner !== tx.from) { // Validate owner of signature is the sending account
            response.reason = 'not signed by from account'
            return response
        }
        if (crypto.verifyObj(tx) === false) { // Validate the signature
            response.reason = 'incorrect signing'
            return response
        }
        if (from === undefined || from === null) { // Validate that an account exists for the sender
            response.reason = "from account doesn't exist"
            return response
        }
        if (to === undefined || to === null) { // validate that an account exists for the recipient
            response.reason = "To account doesn't exist"
            return response
        }
        if (from.data.balance < tx.amount + network.current.transactionFee) { // Validate that the sender has enough tokens to cover the transaction amount + the current network transaction fee
            response.reason = "from account doesn't have sufficient balance to cover the transaction"
            return response
        }
        response.success = true
        response.reason = 'This transaction is valid!'
        return response
    }
}
```
