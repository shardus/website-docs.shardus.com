# [Shardus Developer Documentation](https://shardus.com)

The official documentation for the Shardus API.

The project uses [pnpm](https://pnpm.io), [Nextra](https://nextra.vercel.app) and deploys via [Vercel](https://vercel.com). The latest version of pnpm is incompatible with the node.js engine we are currently using(16.11.1), so make sure to install the correct version of pnpm globally:

```bash
npm install -g pnpm@7.18.0
```

To develop it locally, clone this repository and run the following command to start the local dev server:

```bash
pnpm install
pnpm dev
```
And visit `localhost:3000` or `localhost:[port]` (if you set different port) to preview your changes. 

`NOTE:`Sometimes, we'd have shardus network running in background while working on this resulting in port `3000` collision. `pnpm dev` command will automatically occupy available port but if it is still failing, try setting custom port. To run the dev docs on different port number please do `pnpm customPort 8888`.

## Contributors

- Aamir Syed
- Aaron Sullivan
- Erik Xavier
- Gabriel Romualdo
- [Kyle Shifflett](https://github.com/theDigg)
- [Kaung Myatthu](https://github.com/kgmyatthu)