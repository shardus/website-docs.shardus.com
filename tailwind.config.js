const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./components/**/*.js",
    "./pages/**/*.md",
    "./pages/**/*.mdx",
    "./theme.config.js",
    "./styles/globals.css",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      orange: colors.orange,
      red: colors.red,
      pink: colors.pink,
      violet: colors.violet,
      purple: colors.purple,
      blue: colors.blue,
      cyan: colors.cyan,
      green: colors.green,
    },
  },
};
