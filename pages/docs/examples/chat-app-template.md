import Callout from "nextra-theme-docs/callout"

# Chat App

This guide will show you how to create a simple, scalable chat application using Shardus.

<Callout emoji="⚠️" type="error">

This app was built for an older shardus interface, the overall concepts are the same but there may be some discrepencies
with specific implementation.

</Callout>

<Callout emoji="⚠️" type="warning">

This guide will not cover the basic setup of a shardus application. If you wish to learn how to create an entire application from start to finish using Shardus, see [Basic Dapp](./coin-app-template).
We are going to be starting from where we left off in the Basic Dapp guide, so if you wish to follow along step by step we highly recommend implementing that first.

</Callout>

## Modify Accounts

Currently, our `User Account` data structure from the basic dapp guide looks something like this:

```javascript
function createAccount(id) {
  const account = {
    id: id,
    data: {
      balance: 0,
    },
    hash: '',
    timestamp: 0,
  };
  account.hash = crypto.hashObj(account);
  return account;
}
```

In order to add chat functionality to our application, we need to modify the `User Account` in some way so that we can store the message data between users. One feature we thought would be interesting is the ability for users to request a `toll` for the privelege of sending them messages. This prevents people you don't know from being able to spam your inbox constantly with messages or ads. We will be allowing any user to change their requested toll to any amount they desire, but we also want the user to be able to add friends so that people they chat with often don't always need to be sending them tokens. We are also going to add an `alias` field so that users can register and use aliases to interact with each other instead of copying and pasting long hexadecimal addresses. Lets add a few lines to the `createAccount` function in order to start implementing this functionality.

```javascript highlight=4,3-6
// CREATE A USER ACCOUNT
function createAccount(id) {
  const account = {
    id: id,
    data: {
      balance: 50,
      toll: null,
      chats: {},
      friends: {},
    },
    alias: null,
    hash: '',
    timestamp: 0,
  };
  account.hash = crypto.hashObj(account);
  return account;
}
```

Now we need to add another account for storing the chat data between users. All the state data that exists on a shardus network exists in the form of accounts (See [Accounts](./../main-concepts/development/accounts.md) for a more detailed explanation of what we mean). So the next step in implementing our chat functionality is to create an account for holding the chat data. We will do this by adding the following function:

```javascript
function createChat(id) {
  const chat = {
    id: id,
    messages: [], // The messages between two users in a chat
    timestamp: 0,
    hash: '',
  };
  chat.hash = crypto.hashObj(chat);
  return chat;
}
```

Now, let's do the same thing for storing our aliases.

```javascript
function createAlias(id) {
  const alias = {
    id: id,
    hash: '',
    inbox: '',
    address: '',
    timestamp: 0,
  };
  alias.hash = crypto.hashObj(alias);
  return alias;
}
```

## API Routes

Next up on our list of things to do server side is to create API routes that grab chat, alias, friend, and toll data.

<Callout emoji="💡" type="default">

Here is a reference for the route names we will be using here

</Callout>

```javascript
'account/:id/alias'; // Get the alias for an account
'account/:id/toll'; // Get the toll for an account
'address/:name'; // Get the address (publicKey) from an alias
'account/:id/:friendId/toll'; // Get the toll for a user chatting with another user
'account/:id/friends'; // Get the friend list of a user
'messages/:chatId'; // Get the messages between two users
```

The first route deals with getting the alias of an account from their publicKey. You can implement this by grabbing the `id` from the request parameters, calling [getLocalOrRemoteAccount](./../api/interface/getLocalOrRemoteAccount.md) and passing in the `id` to get the account data, then returning the alias field on the account.

```javascript
dapp.registerExternalGet('account/:id/alias', async (req, res) => {
  try {
    const id = req.params['id'];
    const account = await dapp.getLocalOrRemoteAccount(id);
    res.json({ handle: account && account.data.alias });
  } catch (error) {
    res.json({ error });
  }
});
```

The second route will deal with grabbing the `toll` data field from an account. Same technique applies here, just grab the id from the parameters, and call [getLocalOrRemoteAccount](./../api/interface/getLocalOrRemoteAccount.md) to grab the account data, then return the toll.

```javascript
dapp.registerExternalGet('account/:id/toll', async (req, res) => {
  try {
    const id = req.params['id'];
    const account = await dapp.getLocalOrRemoteAccount(id);
    if (account) {
      if (!account.data.data.toll) {
        res.json({ toll: 0 });
      } else {
        res.json({ toll: account.data.data.toll });
      }
    } else {
      res.json({ error: 'No account with the given id' });
    }
  } catch (error) {
    res.json({ error });
  }
});
```

Next up is the route that deals with mapping an alias to an account. We will be creating this address when we create our alias accounts through a transaction called `register` by hashing the name of the alias. We are creating this route so that we can grab the actual user account address info by querying the hash of their alias (the alias account). By now you probably have an idea on how to do this, but here's the full example:

```javascript
dapp.registerExternalGet('address/:name', async (req, res) => {
  try {
    const name = req.params['name'];
    const account = await dapp.getLocalOrRemoteAccount(name);
    if (account && account.data) {
      res.json({ address: account.data.address });
    } else {
      res.json({ error: 'No account exists for the given handle' });
    }
  } catch (error) {
    res.json({ error });
  }
});
```

Now let's talk about the `toll` API route. Because the toll can differ depending on whether or not the account you are grabbing it from is a friend of the user requesting the info, we need to have two request parameters. `id` is the public key of the account you are requesting the toll from and `friendId` will be the publicKey of the user requesting the toll info. Here's how that looks inside of the API route:

```javascript
dapp.registerExternalGet('account/:id/:friendId/toll', async (req, res) => {
  const id = req.params['id'];
  const friendId = req.params['friendId'];
  if (!id) {
    res.json({ error: 'No provided id in the route: account/:id/:friendId/toll' });
  }
  if (!friendId) {
    res.json({ error: 'No provided friendId in the route: account/:id/:friendId/toll' });
  }
  try {
    const account = await dapp.getLocalOrRemoteAccount(id);
    if (account) {
      if (account.data.data.friends[friendId]) {
        res.json({ toll: 0 });
      } else {
        if (account.data.data.toll === null) {
          res.json({ toll: 0 });
        } else {
          res.json({ toll: account.data.data.toll });
        }
      }
    } else {
      res.json({ error: 'No account with the given id' });
    }
  } catch (error) {
    res.json({ error });
  }
});
```

Now, let's add a route for grabbing the friend list of an account:

```javascript
dapp.registerExternalGet('account/:id/friends', async (req, res) => {
  try {
    const id = req.params['id'];
    const account = await dapp.getLocalOrRemoteAccount(id);
    if (account) {
      res.json({ friends: account.data.data.friends });
    } else {
      res.json({ error: 'No account for given id' });
    }
  } catch (error) {
    dapp.log(error);
    res.json({ error });
  }
});
```

Finally, let's add the route for grabbing messages shared between two users on the network. We will be using a `chatId` created by hashing two users addresses together, so that a unique chat account will exist for any given two users. Here's how we accomplish that:

```javascript
dapp.registerExternalGet('messages/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await dapp.getLocalOrRemoteAccount(chatId);
    dapp.log(chat);
    if (!chat) {
      res.json({ error: "Chat doesn't exist" });
      return;
    }
    if (!chat.data.messages) {
      res.json({ error: 'no chat history for this request' });
    } else {
      res.json({ messages: chat.data.messages });
    }
  } catch (error) {
    res.json({ error });
  }
});
```

## Setup functions

Now it's time for modifying the [setup](../api/interface/setup/README.md) functions to handle the new transaction types we will be creating.

<Callout emoji="💡" type="default">

We are going to be adding the following transaction types (You can name yours whatever you wish)

1. `register`
2. `message`
3. `toll`
4. `friend`
5. `remove_friend`

</Callout>

## Validate Transactions

Lets begin with [validateTransaction](../main-concepts/security/validation.md). We want to create new paths for validation code to be executed by adding cases to our existing `switch` statement.

<Callout emoji="💡" type="default">

In this application, we need to pass `wrappedStates` into `validateTransaction` from `apply`. Make sure that you modify the function like so:

```javascript
validateTransaction(tx, wrappedStates) {}
```

</Callout>

### `register`

In order to implement verification for the `register` transaction type, we need to make sure the following items are accomplished:

1. Validate the signature on the transaction and ensure it was signed by the account that submitted it.
2. Ensure no `alias` account already exists with the given `aliasHash` of the transaction.

```javascript
switch (tx.type) {
  case 'register': {
    const alias = wrappedStates[tx.aliasHash] && wrappedStates[tx.aliasHash].data;
    if (tx.sign.owner !== tx.from) {
      response.reason = 'not signed by from account';
      return response;
    }
    if (crypto.verifyObj(tx) === false) {
      response.reason = 'incorrect signing';
      return response;
    }
    if (!alias) {
      response.reason = 'Alias account was not found for some reason';
      return response;
    }
    if (alias.inbox === tx.alias) {
      response.reason = 'This alias is already taken';
      return response;
    }
    response.result = 'pass';
    response.reason = 'This transaction is valid!';
    return response;
  }
}
```

### `message`

In order to implement verification for the `message` transaction type, we need to make sure the following items are accomplished:

1. Validate the signature on the transaction and ensure it was signed by the account that submitted it.
2. Ensure both `to` and `from` accounts exists on the network.
3. If the sender (`from`) isn't a friend of the receiver (`to`), then ensure the sender has enough balance to cover the receiver's toll

```javascript
switch (tx.type) {
  case 'message': {
    const from = wrappedStates[tx.from].data;
    const to = wrappedStates[tx.to].data;
    if (tx.sign.owner !== tx.from) {
      response.reason = 'not signed by from account';
      return response;
    }
    if (crypto.verifyObj(tx) === false) {
      response.reason = 'incorrect signing';
      return response;
    }
    if (typeof from === 'undefined' || from === null) {
      response.reason = '"from" account does not exist.';
      return response;
    }
    if (typeof to === 'undefined' || to === null) {
      response.reason = '"target" account does not exist.';
      return response;
    }
    if (to.data.friends[tx.from]) {
      response.result = 'pass';
      response.reason = 'This transaction is valid!';
      return response;
    } else {
      if (to.data.toll === null) {
        response.result = 'pass';
        response.reason = 'This transaction is valid!';
        return response;
      } else {
        if (from.data.balance < to.data.toll) {
          response.reason = 'from account does not have sufficient funds.';
          return response;
        }
      }
    }
    response.result = 'pass';
    response.reason = 'This transaction is valid!';
    return response;
  }
}
```

### `toll`

In order to implement verification for the `toll` transaction type, we need to make sure the following items are accomplished:

1. Validate the signature on the transaction and ensure it was signed by the account that submitted it.
2. Ensure `toll` is greater than or equal to at least 1 token (totally optional, you can do this however you want, but here is where you would do it)

```javascript
switch (tx.type) {
  case 'toll': {
    const from = wrappedStates[tx.from].data;
    if (tx.sign.owner !== tx.from) {
      response.reason = 'not signed by from account';
      return response;
    }
    if (crypto.verifyObj(tx) === false) {
      response.reason = 'incorrect signing';
      return response;
    }
    if (!from) {
      response.reason = 'from account does not exist';
      return response;
    }
    if (!tx.toll) {
      response.reason = 'Toll was not defined in the transaction';
      return response;
    }
    if (tx.toll < 1) {
      response.reason = 'Toll must be greater than or equal to 1';
      return response;
    }
    response.result = 'pass';
    response.reason = 'This transaction is valid!';
    return response;
  }
}
```

### `friend`

In order to implement verification for the `friend` transaction type, we need to make sure the following items are accomplished:

1. Validate the signature on the transaction and ensure it was signed by the account that submitted it.
2. Ensure that the sender account exists
3. That's it!

```javascript
switch (tx.type) {
  case 'friend': {
    const from = wrappedStates[tx.from].data;
    if (typeof from === 'undefined' || from === null) {
      response.reason = 'from account does not exist';
      return response;
    }
    if (tx.sign.owner !== tx.from) {
      response.reason = 'not signed by from account';
      return response;
    }
    if (crypto.verifyObj(tx) === false) {
      response.reason = 'incorrect signing';
      return response;
    }
    response.result = 'pass';
    response.reason = 'This transaction is valid!';
    return response;
  }
}
```

### `remove_friend`

In order to implement verification for the `remove_friend` transaction type, we need to make sure the following items are accomplished:

1. Validate the signature on the transaction and ensure it was signed by the account that submitted it.
2. Ensure that the sender account exists
3. That's it!

```javascript
switch (tx.type) {
  case 'remove_friend': {
    const from = wrappedStates[tx.from].data;
    if (typeof from === 'undefined' || from === null) {
      response.reason = 'from account does not exist';
      return response;
    }
    if (tx.sign.owner !== tx.from) {
      response.reason = 'not signed by from account';
      return response;
    }
    if (crypto.verifyObj(tx) === false) {
      response.reason = 'incorrect signing';
      return response;
    }
    response.result = 'pass';
    response.reason = 'This transaction is valid!';
    return response;
  }
}
```

## Validate Transaction Fields

Now we want to do the same thing for the code paths in the `switch` statement within [validateTxnFields](../api/interface/setup/validateTxnFields.md). All you need to do in these validation cases is type check the fields in the transactions to ensure they are in the format that you expect. You can copy the following code examples if you just want to follow along (Keep in mind I have removed the `create` and `transfer` cases because we already implemented those in the last example we built)

### `register`

```javascript
switch (tx.type) {
  case 'register': {
    if (typeof tx.aliasHash !== 'string') {
      success = false;
      reason = '"aliasHash" must be a string.';
      throw new Error(reason);
    }
    if (typeof tx.from !== 'string') {
      success = false;
      reason = '"From" must be a string.';
      throw new Error(reason);
    }
    if (typeof tx.alias !== 'string') {
      success = false;
      reason = '"alias" must be a string.';
      throw new Error(reason);
    }
    if (tx.alias.length >= 20) {
      success = false;
      reason = '"alias" must be less than 21 characters (20 max)';
      throw new Error(reason);
    }
    break;
  }
  case 'message': {
    if (typeof tx.from !== 'string') {
      success = false;
      reason = '"From" must be a string.';
      throw new Error(reason);
    }
    if (typeof tx.to !== 'string') {
      success = false;
      reason = '"To" must be a string.';
      throw new Error(reason);
    }
    if (typeof tx.message !== 'string') {
      success = false;
      reason = '"Message" must be a string.';
      throw new Error(reason);
    }
    if (tx.message.length > 5000) {
      success = false;
      reason = '"Message" length must be less than 5000 characters.';
      throw new Error(reason);
    }
    break;
  }
  case 'toll': {
    if (typeof tx.from !== 'string') {
      success = false;
      reason = '"From" must be a string.';
      throw new Error(reason);
    }
    if (typeof tx.toll !== 'number') {
      success = false;
      reason = '"Toll" must be a number.';
      throw new Error(reason);
    }
    if (tx.toll < 1) {
      success = false;
      reason = 'Minimum "toll" allowed is 1 token';
      throw new Error(reason);
    }
    if (tx.toll > 1000000) {
      success = false;
      reason = 'Maximum toll allowed is 1,000,000 tokens.';
      throw new Error(reason);
    }
    break;
  }
  case 'friend': {
    if (typeof tx.from !== 'string') {
      success = false;
      reason = '"From" must be a string.';
      throw new Error(reason);
    }
    if (typeof tx.to !== 'string') {
      success = false;
      reason = '"To" must be a string.';
      throw new Error(reason);
    }
    if (typeof tx.alias !== 'string') {
      success = false;
      reason = '"Message" must be a string.';
      throw new Error(reason);
    }
    break;
  }
  case 'remove_friend': {
    if (typeof tx.from !== 'string') {
      success = false;
      reason = '"From" must be a string.';
      throw new Error(reason);
    }
    if (typeof tx.to !== 'string') {
      success = false;
      reason = '"To" must be a string.';
      throw new Error(reason);
    }
    break;
  }
}
```

## Get Keys From Transactions

Next up in our list of setup functions to modify is [getKeyFromTransaction](../api/interface/setup/getKeyFromTransaction.md). This doesn't require a lot of code to add, we just need to give shardus the expected keys for the accounts that will be modified with respect to each transaction type. Add the following cases for the `switch` statement within your `getKeysFromTransaction` function.

```javascript
switch (tx.type) {
  case 'register':
    result.sourceKeys = [tx.from]; // Account registering the alias
    result.targetKeys = [tx.aliasHash]; // Alias account that holds the mapping to the User Account
    break;
  case 'message':
    result.sourceKeys = [tx.from]; // Account sending the message
    result.targetKeys = [tx.to, tx.chatId]; // [Account receiving message, Chat account holding the messages between the users]
    break;
  case 'toll':
    result.sourceKeys = [tx.from]; // Account setting the toll
    break;
  case 'friend':
    result.sourceKeys = [tx.from]; // Account adding the friend
    break;
  case 'remove_friend':
    result.sourceKeys = [tx.from]; // Account removing the friend
    break;
}
```

## Get Relevant Data

[getRelevantData](../api/interface/setup/getRelevantData.md) is where we will actually create the accounts specific to each transaction. Remember we added two new account types (`chat` and `alias` accounts). We need to parse the transaction type and determine whether the account needs to be "created" or "accessed". Since the only two transactions that create different "types" of accounts so far are `register` and `message`, we will add code paths that deal with creating accounts when those transactions are processed.

```javascript
getRelevantData(accountId, tx) {
  let account = accounts[accountId]
  let accountCreated = false
  // Create the account if it doesn't exist
  if (typeof account === 'undefined' || account === null) {
    if (tx.type === 'register') {
      if (accountId === tx.aliasHash) {
        account = createAlias(accountId)
        accounts[accountId] = account
        accountCreated = true
      }
    } else if (tx.type === 'message') {
      if (accountId === tx.chatId) {
        account = createChat(accountId)
        accounts[accountId] = account
        accountCreated = true
      }
    }
  }
  // All other transactions will default to creating "User Accounts"
  if (typeof account === 'undefined' || account === null) {
    account = createAccount(accountId, tx.timestamp)
    accounts[accountId] = account
    accountCreated = true
  }
  // Wrap it for Shardus
  const wrapped = dapp.createWrappedResponse(accountId, accountCreated, account.hash, account.timestamp, account)
  return wrapped
}
```

## Apply

Finally, we can implement the business logic of our transactions within [apply](../api/interface/setup/apply.md).
Remember from our last app we built how we called our helper `validateTransaction` function to make sure it passed our validation requirements? Well This time, we need to pass an extra argument to that function called `wrappedStates`. If you have been following along carefully, you may have noticed that we used this variable in our `validateTransaction` setup we did earlier. Just remember to pass it into the function as an argument so that you don't get an error. The start of your `apply` function should now look something like this:

```javascript
apply(tx, wrappedStates) {
  // Validate the tx
  const { result, reason } = this.validateTransaction(tx, wrappedStates)
  if (result !== 'pass') {
    throw new Error(`invalid transaction, reason: ${reason}. tx: ${JSON.stringify(tx)}`)
  }
  // Create an applyResponse which will be used to tell Shardus that the tx has been applied
  const txId = crypto.hashObj(tx) // compute txId from tx
  const applyResponse = dapp.createApplyResponse(txId, tx.timestamp)

  // switch statement code
  // ...
}
```

### `register`

```javascript
switch (tx.type) {
  case 'register': {
    const from = wrappedStates[tx.from].data; // grab account data from wrappedStates
    const alias = wrappedStates[tx.aliasHash].data;
    alias.inbox = tx.alias; // set inbox field to the alias
    from.alias = tx.alias; // set alias field on the sender account
    alias.address = tx.from; // set address of sender on the alias account
    alias.timestamp = tx.timestamp; // set timestamps on accounts that were modified
    from.timestamp = tx.timestamp;
    dapp.log('Applied register tx', tx);
    break;
  }
}
```

### `message`

```javascript
switch (tx.type) {
  case 'message': {
    const from = wrappedStates[tx.from].data; // grab sender account data from wrappedStates
    const to = wrappedStates[tx.to].data; // grab receiver account data from wrappedStates
    const chat = wrappedStates[tx.chatId].data; // grab chat account data from wrappedStates

    // check whether or not to apply the toll
    if (!to.data.friends[from.id]) {
      if (to.data.toll) {
        from.data.balance -= to.data.toll;
        to.data.balance += to.data.toll;
      }
    }

    // Create a mapping to the chat in each user's chat list
    // so that it can be referenced with ease later
    if (!from.data.chats[tx.to]) from.data.chats[tx.to] = tx.chatId;
    if (!to.data.chats[tx.from]) to.data.chats[tx.from] = tx.chatId;

    // Add the actual chat data to the account holding the messages
    chat.messages.push(tx.message);

    // Add timestamps to the modified accounts
    chat.timestamp = tx.timestamp;
    from.timestamp = tx.timestamp;
    to.timestamp = tx.timestamp;

    dapp.log('Applied message tx', tx);
    break;
  }
}
```

### `toll`

```javascript
switch (tx.type) {
  case 'toll': {
    const from = wrappedStates[tx.from].data; // grab sender account data from wrappedStates
    from.data.toll = tx.toll; // Set the toll field on the sender account
    from.timestamp = tx.timestamp; // Add timestamp to the sender account
    dapp.log('Applied toll tx', tx);
    break;
  }
}
```

### `friend`

```javascript
switch (tx.type) {
  case 'friend': {
    const from = wrappedStates[tx.from].data;
    from.data.friends[tx.to] = tx.alias;
    from.timestamp = tx.timestamp;
    dapp.log('Applied friend tx', from);
    break;
  }
}
```

### `remove_friend`

```javascript
switch (tx.type) {
  case 'remove_friend': {
    const from = wrappedStates[tx.from].data;
    delete from.data.friends[tx.to];
    from.timestamp = tx.timestamp;
    dapp.log('Applied remove_friend tx', from);
    break;
  }
}
```

<Callout emoji="💡" type="default">

Don't forget to return the `replyResponse` at the end of the `apply` function.

```javascript
return applyResponse;
```

</Callout>

## Extend CLI

That's it for the server side implementation of our chat application. Now in order to interact with everything we just added, we need to extend the CLI we created in the last example. Start by creating helper methods for interacting with our new API routes:

```javascript
// USED TO GET THE TOLL AMOUNT BETWEEN 2 USERS
async function getToll(friendId, yourId) {
  try {
    const res = await axios.get(`http://${HOST}/account/${friendId}/${yourId}/toll`);
    return { toll: res.data.toll };
  } catch (error) {
    return { error: error };
  }
}

// USED TO GET THE PUBLIC_KEY OF OF AN ACCOUNT FROM THIER ALIAS
async function getAddress(handle) {
  if (handle.length === 64) return handle;
  try {
    const res = await axios.get(`http://${HOST}/address/${crypto.hash(handle)}`);
    const { address, error } = res.data;
    if (error) {
      console.log(error);
    } else {
      return address;
    }
  } catch (error) {
    console.log(error);
  }
}

// USED TO QUERY MESSAGES
async function queryMessages(to, from) {
  try {
    const res = await axios.get(`http://${HOST}/messages/${crypto.hash([from, to].sort().join``)}`);
    const { messages } = res.data;
    return messages;
  } catch (error) {
    return error;
  }
}
```

### Add transaction commands

<Callout emoji="💡" type="default">

Now it's time for us to add the commands to interact with the transactions we created.

</Callout>

> We've gone ahead and modified the `transfer` command from the previous example application in order to utilize our new `alias` feature. Now, instead of grabbing the address from our local wallet, we can query the address from the `alias account` associated with that user's alias on the network. We also utilize the [crypto](../tools/crypto-utils.md) module to sign our transactions, as this provides an extra layer of security for our application. Make sure you modify the `transfer` command to the following:

```javascript
// COMMAND TO TRANSFER TOKENS FROM ONE ACCOUNT TO ANOTHER
vorpal.command('transfer', 'transfers tokens to another account').action(async function(_, callback) {
  const answers = await this.prompt([
    {
      type: 'input',
      name: 'target',
      message: 'Enter the target account: ',
    },
    {
      type: 'number',
      name: 'amount',
      message: 'How many tokens do you want to send: ',
      default: 50,
      filter: (value) => parseInt(value),
    },
  ]);
  const to = await getAddress(answers.target);
  const tx = {
    type: 'transfer',
    from: USER.address,
    to: to,
    amount: answers.amount,
    timestamp: Date.now(),
  };
  crypto.signObj(tx, USER.keys.secretKey, USER.keys.publicKey);
  injectTx(tx).then((res) => {
    this.log(res);
    callback();
  });
});
```

## `register` command

To implement `register` prompt the user to enter an `alias`, then hash that `alias` and stick it onto the `aliasHash` field in the transaction.

```javascript
// COMMAND TO REGISTER AN ALIAS FOR A USER ACCOUNT
vorpal.command('register', 'registers a unique alias for your account').action(async function(args, callback) {
  const answer = await this.prompt({
    type: 'input',
    name: 'alias',
    message: 'Enter the alias you want: ',
  });
  const tx = {
    type: 'register',
    aliasHash: crypto.hash(answer.alias),
    from: USER.address,
    alias: answer.alias,
    timestamp: Date.now(),
  };
  crypto.signObj(tx, USER.keys.secretKey, USER.keys.publicKey);
  injectTx(tx).then((res) => {
    this.log(res);
    callback();
  });
});
```

## `message` command

> The `message` command is a bit more involved. First, we prompt the user for the alias of the account they want to message. Then we query the API for the toll that we need to send (if any). Then we prompt the user once again with a confirmation about how much it will cost them to send a message. Finally, if the user responds to the prompt with a "yes", then create a stringified message object with the following fields:

```javascript
const message = stringify({
  body: answers.message,
  handle, // We get this from querying our own alias
  timestamp: Date.now(),
});
```

After stringifying the `message`, use the `encrypt` function of the [crypto module](../tools/crypto-utils.md) in order to encrypt the message data so that nobody can see your chat other than this other user. Create the unique `chatId` by hashing the result of combining and sorting both user addresses like so:

```javascript
crypto.hash([USER.address, to].sort().join``);
```

Finally, sign the transaction and send it off:

```javascript
// COMMAND TO SEND A MESSAGE TO ANOTHER USER ON THE NETWORK
vorpal.command('message', 'sends a message to another user').action(async function(_, callback) {
  const answers = await this.prompt([
    {
      type: 'input',
      name: 'to',
      message: 'Enter the alias or publicKey of the target: ',
    },
    {
      type: 'input',
      name: 'message',
      message: 'Enter the message: ',
    },
  ]);
  const to = await getAddress(answers.to);
  const data = await getAccountData(USER.address);
  const handle = data.account.alias;
  if (to === undefined || to === null) {
    this.log("Account doesn't exist for: ", answers.to);
    callback();
  }
  const result = await getToll(to, USER.address);
  if (result.error) {
    this.log(`There was an error retrieving the toll for ${answers.to}`);
    this.log(result.error);
    callback();
  } else {
    const answer = await this.prompt({
      type: 'list',
      name: 'confirm',
      message: `The toll for sending this user a message is ${result.toll}, continue? `,
      choices: [
        { name: 'yes', value: true, short: true },
        { name: 'no', value: false, short: false },
      ],
      default: 'yes',
    });
    if (answer.confirm) {
      const message = stringify({
        body: answers.message,
        handle,
        timestamp: Date.now(),
      });
      const encryptedMsg = crypto.encrypt(message, crypto.convertSkToCurve(USER.keys.secretKey), crypto.convertPkToCurve(to));
      const tx = {
        type: 'message',
        from: USER.address,
        to: to,
        chatId: crypto.hash([USER.address, to].sort().join``),
        message: encryptedMsg,
        timestamp: Date.now(),
      };
      crypto.signObj(tx, USER.keys.secretKey, USER.keys.publicKey);
      injectTx(tx).then((res) => {
        this.log(res);
        callback();
      });
    } else {
      callback();
    }
  }
});
```

## `toll` command

```javascript
// COMMAND TO SET A TOLL FOR PEOPLE NOT ON YOUR FRIENDS LIST THAT SEND YOU MESSAGES
vorpal.command('toll', 'sets a toll people must you in order to send you messages').action(async function(_, callback) {
  const answer = await this.prompt({
    type: 'number',
    name: 'toll',
    message: 'Enter the toll: ',
    filter: (value) => parseInt(value),
  });
  const tx = {
    type: 'toll',
    from: USER.address,
    toll: answer.toll,
    timestamp: Date.now(),
  };
  crypto.signObj(tx, USER.keys.secretKey, USER.keys.publicKey);
  injectTx(tx).then((res) => {
    this.log(res);
    callback();
  });
});
```

## `add friend` command

```javascript
// COMMAND TO ADD A FRIEND TO YOUR USER ACCOUNT'S FRIEND LIST
vorpal.command('add friend', 'adds a friend to your account').action(async function(args, callback) {
  const answer = await this.prompt({
    type: 'input',
    name: 'friend',
    message: 'Enter the alias or publicKey of the friend: ',
  });
  const to = await getAddress(answer.friend);
  if (to === undefined || to === null) {
    this.log("Target account doesn't exist for: ", answer.friend);
    callback();
  }
  const tx = {
    type: 'friend',
    alias: answer.friend,
    from: USER.address,
    to: to,
    timestamp: Date.now(),
  };
  crypto.signObj(tx, USER.keys.secretKey, USER.keys.publicKey);
  injectTx(tx).then((res) => {
    this.log(res);
    callback();
  });
});
```

## `remove friend` command

```javascript
// COMMAND TO REMOVE A FRIEND FROM YOUR USER ACCOUNT'S FRIEND LIST
vorpal.command('remove friend', 'removes a friend from your account').action(async function(_, callback) {
  const answer = await this.prompt({
    type: 'input',
    name: 'friend',
    message: 'Enter the alias or publicKey of the friend to remove: ',
  });
  const to = await getAddress(answer.friend);
  if (to === undefined || to === null) {
    this.log("Target account doesn't exist for:", answer.friend);
    callback();
  }
  const tx = {
    type: 'remove_friend',
    from: USER.address,
    to: to,
    timestamp: Date.now(),
  };
  crypto.signObj(tx, USER.keys.secretKey, USER.keys.publicKey);
  injectTx(tx).then((res) => {
    this.log(res);
    callback();
  });
});
```

## `message poll` command

> In order to decrypt the messages between two users, you need to call the `decrypt` function on the [crypto module](../tools/crypto-utils.md) for each message object. We can use our `queryMessages` function we created earlier to get the `messages`, then map each message to the result of `JSON.parse(crypto.decrypt(message, crypto.convertSkToCurve(<your secret key>), crypto.convertPkToCurve(<target's public key>)).message))`.

```javascript
// COMMAND TO POLL FOR MESSAGES BETWEEN 2 USERS AFTER A SPECIFIED TIMESTAMP
vorpal.command('message poll <to>', 'gets messages between you and <to>').action(async function(args, callback) {
  const to = await getAddress(args.to);
  let messages = await queryMessages(USER.address, to);
  messages = messages.map((message) =>
    JSON.parse(crypto.decrypt(message, crypto.convertSkToCurve(USER.keys.secretKey), crypto.convertPkToCurve(to)).message)
  );
  this.log(messages);
  callback();
});
```

## Interact

Now run the CLI and interact using the following commands:

```sh
> help

  Commands:

    help [command...]     Provides help for a given command.
    exit                  Exits application.
    register              registers a unique alias for your account
    create                creates tokens for an account
    transfer              transfers tokens to another account
    message               sends a message to another user
    toll                  sets a toll people must you in order to send you messages

    add friend            adds a friend to your account
    remove friend         removes a friend from your account
    message poll <to>     gets messages between you and <to>
    query [account]       gets data for the account associated with the given [wallet]. Otherwise, gets all network data.

    wallet create <name>  creates a wallet <name>
    wallet list [name]    lists wallet for [name]. Otherwise, lists all wallets
    use <name>            uses <name> wallet for transactions
    use host <host>       uses <host> as the node for queries and transactions
    init                  sets the user wallet if it exists, else creates it
```

<Callout emoji="🧪" type="default">

Here's an example of me testing out all the transaction functionality we just added.

</Callout>

```sh
❯ node client
Loaded wallet entries from '/home/kyle/Code/shardus/applications/test/wallet.json'.
Using localhost:9001 as coin-app node for queries and transactions.
>
Enter wallet name: kyle

> register
Enter the alias you want: kyle
{result: { success: true, reason: 'Transaction queued, poll for results.' }}

> use test
Now using wallet: test

> register
Enter the alias you want: test
{result: { success: true, reason: 'Transaction queued, poll for results.' }}

> add friend
Enter the alias or publicKey of the friend: kyle
{result: { success: true, reason: 'Transaction queued, poll for results.' }}

> toll
Enter the toll: 10
{result: { success: true, reason: 'Transaction queued, poll for results.' }}

> use kyle
Now using wallet: kyle

> message
Enter the alias or publicKey of the target: test
Enter the message: yo
? The toll for sending this user a message is 0, continue?  true
{result: { success: true, reason: 'Transaction queued, poll for results.' }}

> use test
Now using wallet: test

> remove friend
Enter the alias or publicKey of the friend to remove: kyle
{result: { success: true, reason: 'Transaction queued, poll for results.' }}

> use kyle
Now using wallet: kyle

> message
Enter the alias or publicKey of the target: test
Enter the message: yo 2
? The toll for sending this user a message is 10, continue?  true
{result: { success: true, reason: 'Transaction queued, poll for results.' }}

> message poll test
[{ body: 'yo', handle: 'kyle', timestamp: 1597800151040 },{ body: 'yo 2', handle: 'kyle', timestamp: 1597800187558 }]

> use test
Now using wallet: test

> message poll kyle
[{ body: 'yo', handle: 'kyle', timestamp: 1597800151040 },{ body: 'yo 2', handle: 'kyle', timestamp: 1597800187558 }]
```

## Encryption and Decryption

<Callout emoji="🚨" type="error">

When we query the "chat" account on the server that was created in the example above, you can see that they're encrypted and nobody other than the two users who belong to that chat can decode any of the messages you see here:

</Callout>

```sh
{
  account: {
    id: '4187f99aae66a79a96727aad302f71cb07033130d000524cdff352c4e3125c3a',
    messages: [
      '["9875fbcbc0a376c24f162962da0a17da67d5a66e50f02cc2dfcb20d5f488743406788f8de787bd03a885cb0c513be5894102860c8b91cb249e65c3468ba12bf9b99d8c8f19b3ac","71c428a0fd2c1d506b15ec39396313f11a6c0708be0c73de"]',
      '["1e96886f837c9ea4a4fd3ba498e71009bc462ed33c1561d8b59fadb63f7bbdeaee393bf76a86338668bc488930e62316f74a706995224969b3a0fe98875bc69c8711bde8a35e438097","0260018df3afaf12938e0f067f39a6ba6947caf3a2e51253"]'
    ],
    timestamp: 1597800187558,
    hash: '5ba70e88d7eac3d301e0089d16a8b7d82be9579215378314d465fa6a81feb9b7'
  }
}
```

> That just about wraps it up for the second example. By now, you're probably familiar with the process of creating transactions and extending functionality within a shardus network. Extra credit for those who extend this chat application with group messaging on their own ;)

<Callout type="warning" emoji="💥">

Seriously build something cool with this! You're going to be surprised how easy it is and how much you can do with this library.

</Callout>
