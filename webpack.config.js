const path = require("path");
module.exports = {
  module: {
    rules: [
      {
        test: /\.(css|html)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  }
};

