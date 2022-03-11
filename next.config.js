const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  unstable_stork: true,
  unstable_contentDump: true,
  unstable_staticImage: true,
});

module.exports = withNextra({
  target: 'serverless',
  redirects: () => {
    return [
      {
        source: "/docs",
        destination: "/docs/quickstart",
        statusCode: 301,
      },
      {
        source: "/docs",
        destination: "/docs/quickstart",
        statusCode: 302,
      },
      {
        source: "/examples",
        destination: "/docs/examples/README",
        statusCode: 302,
      },
    ];
  },
});
