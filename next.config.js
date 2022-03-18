const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  unstable_stork: true,
  unstable_contentDump: true,
  unstable_staticImage: true,
});

module.exports = withNextra({
  presets: ['@next/babel'],  
  // assetPrefix: process.env.NODE_ENV === 'gitlab' ? '/docs/shardus-developer-docs' : '',
  // basePath: process.env.NODE_ENV === 'gitlab' ? '/docs/shardus-developer-docs' : '',
  images: {
    loader: 'akamai',
    path: '',
  },
});
