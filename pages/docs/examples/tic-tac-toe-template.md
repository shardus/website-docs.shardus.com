import Callout from "nextra-theme-docs/callout"

# Tic Tac Toe

We've built a version of Tic Tac Toe to demonstrate using
[shardusDB](https://gitlab.com/shardus/applications/shardus-db).

This game is very naive - players can easily impersonate each other and
there's no win or loss logic. The purpose of this app is to demonstrate
how simple it is to use `shardusDB`.

## Context

Before we start with Tic Tac Toe, go ahead and read through [the shardusDB
README](https://gitlab.com/shardus/applications/hello-cloud/-/blob/master/README.md).

## Installation

As always, start by cloning and installing the repo.

```sh
git clone git@gitlab.com:shardus/applications/tic-tac-toe.git
cd tic-tac-toe
npm install
```

## Examination

Let's look first at what comes in the beginning.

### initialize

```ts
db.shardus.registerExternalPost('initialize', (req, res) => {
  // Initialize game state
  const dbRes = db.set({
    board: generateCleanGameBoard(),
    turn: 1
  })

  res.json(dbRes)
})
```

Before anything happens with our game, we need to instantiate our game state.
The reason we put this behind an API call, rather than calling it in-line as the
program starts, is that we need to wait for the network to spin up and become
ready to accept transactions. When developing, we often have to wait for the network
to spin up. But in the real world, this will only ever happen once. Once the mainnet
of your dapp is launched, it's launched. Just keep that in the back of your mind
as we continue our explorations.

<Callout emoji="💡" type="default">

You can already see how easy it is to use `shardusDB`. All we had to do was
call `db.set()` to put state into our network. Developing against the low level
shardus code, in order to do that, you'd need to shape transactions and
accounts, create tx validation, make the `apply` transformer, the `updateAccountFull`
call to update your state, and fill out the other 4/5ths of the `shardus.setup`
function.

</Callout>

### read our game state

```ts
db.shardus.registerExternalGet('game', (req, res) => {
  // Get our whole state.
  const gameState = db.get()

  // User needs to get the initial game state up and running after the nodes
  // sync up.
  if (!gameState) fail(res, 'Not yet initialized!')

  res.json(gameState)
})
```

Reading state from the network with `shardusDB` is as easy as setting state.
Just call `db.get()` and you'll have the whole state of your application.
If you want just some, `db.get().myTopLevelKey` is how you'd proceed.

### Make a tic tac toe move

```ts
db.shardus.registerExternalPost('move', (req, res) => {
  const { player, tile } = req.body

  // Do a little validation.. Emphasis on little
  if (!player)                     return fail(res, 'You must supply a player')
  if (![0, 1, 2].includes(player)) return fail(res, `Player must be 0, 1 or 2, you gave: ${player} [${typeof player}`)
  if (!tile)                       return fail(res, 'You must supply a title')
  if (!tileStrings.includes(tile)) return fail(res, 'Title must be valid, you supplied: ' + tile)

  // Getting our whole state is as easy as this.
  const gameState = db.get()

  // One more validation for safety's sake
  if (gameState.turn != player) return fail(res, 'It\'s not your turn, guy!')

  // Make that move
  gameState.board[tile] = player

  // toggle that turn
  gameState.turn = gameState.turn === 1 ? 2 : 1

  // Make the write! 1-2-3, easy peasy.
  const dbRes = db.set(gameState)

  res.json(dbRes)
})
```

The last piece of the puzzle. This is the endpoint a player calls to
make their move. Most of this code should be self explanatory.

<Callout emoji="💡" type="default">

If it isn't, please consider letting us know. [We always welcome feedback](/docs/contributing/feedback).

</Callout>

## In Conclusion

> Now you've seen how easy it is to use `shardusDB`. If you're having fun
> and want to explore further, we highly recommend the hacking of this Tic Tac Toe
> game. Can you use cryptographic techniques to ensure that only player 1
> can make a move for player 1? Can you add win/loss logic? What other inventive
> things can you do to this game?
