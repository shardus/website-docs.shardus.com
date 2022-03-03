# ShardusDB

## A simple wrapper for the [shardus](https://shardus.com/) [code](https://gitlab.com/shardus).

ShardusDB was invented to simplify developing dapps on top of `shardus`.

Using ShardusDB is easy:

```ts
import shardusDB from 'shardus-db'

type State = {
  your: string
  state: number
  goes: Array
  here: any
}

const db = shardusDB<State>()

// Wait a minute or two for the network to start up ...

const res = db.set({
  your: 'beautiful',
  state: 508,
  goes: ['right'],
  here: '!'
})

if (res.success) console.log('Alright! We instructed the network to set some state!')

const state = db.get()

console.log(state) // The same beautiful state we set above, assuming all went well in the network.
```

---

ShardusDB takes a naive approach to spreading your data across different
shardus nodes. `db.set` takes an object. Every top level key in that object
gets split into its own shardus account. In this way shardusDB takes advantage
of shardus' robust decentralized storage, including node swapping and data
redundancy. However, `shardusDB` offering `db.get` precludes the option of
taking advantage of shardus' sharding capabilities.  This means the developer
is faced with a tradeoff:

If you want to use `db.get()` in your project, your app will not be linearly
scalable as more nodes join the network.

However, if you are keen to use `db.set` but intend to use an explorer in lieu
of using `db.get`, as you would writing a dapp on top of native `shardus`,
`shardusDB` will still work to deposit data into a full fledged, sharded and
linearly scalable Shardus network. In this network, `db.get()` would only
return a random portion of your state.

---

### Expositions

```ts
const db = shardusDB<State>()

// `db` has a few properties. It exports the `shardus-crypto-utils` as `db.crypto`, for
// your cryptographic pleasure.

console.log(
  db.crypto.hashObj({ woah: 'holy cow' })
) // -> some random 32 byte hex string

// But more importantly, `db` exposes the entire `shardus` object. This includes
// its native `registerExternal{Get,Post,Put,Patch,Delete}`
// methods, which make for the trivial exposing of of an HTTP based API.

// This is all it takes to make an endpoint that returns the entire state
// of the world.
db.shardus.registerExternalGet('state', (req, res) => {
  res.json(db.get())
}) // Accessible via localhost:9001/state
```

---

### Efficiently utilizing the Shardus network

`shardusDB` allows you to use the Shardus network efficiently. A naive approach
to saving using `shardusDB` could be as follows:

```ts
const state = db.get()

console.log(
  Object.keys(state)
) // Whole lotta top level keys

state.firstKey.subKey = "new value"
state.secondKey.subKey = "another value"

db.set(state)
```

This is perfectly valid and works. However, shardus, under the hood, will re-save
every top level key in the object you give to `db.set`. This means the network will have
to perform its protocols on a "whole lotta top level keys", even though it only
changed two of them. To get around this, `shardusDB` supports a kind of PATCH-like
approach, whereby setting some keys does not delete others. So the more efficient
approach would look like:

```ts
const state = db.get()

console.log(
  Object.keys(state)
) // Whole lotta top level keys

state.firstKey.subKey = "new value"
state.secondKey.subKey = "another value"

const { firstKey, secondKey } = state
db.set({ firstKey, secondKey })
```

Now only `firstKey` and `secondKey` will be sent into the network. All else still
remains and is still accessible with `db.get()`.

### Additional Considerations

* shardusDB does not (yet) allow you to operate with global accounts.
* shardusDB does not (yet) allow the colocation of data within shards. This may be implemented
  by allowing a prefix to be passed in for each account key, taking advantage of shardus' supplied
  mechanism to colocate data.
