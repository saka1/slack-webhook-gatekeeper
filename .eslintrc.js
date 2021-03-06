module.exports = {
  extends: ["airbnb-base", "plugin:jest/recommended", "prettier"],
  env: {
    node: true,
  },
  rules: {
    "no-console": 0,
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "import/newline-after-import": 0,
    "import/order": 0,
    "no-underscore-dangle": ["error", { allowAfterThis: true }],
  },
  plugins: ["jest", "prettier"],
};
