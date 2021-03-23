const path = require("path");

const pages = ["test-page"];

module.exports = {
  entry: Object.fromEntries(
    pages.map(pageName => [
      pageName,
      path.join(__dirname, "src", "pages", pageName, "client.ts")
    ])
  ),
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", "jsx"]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public", "script", "bundles")
  }
};
