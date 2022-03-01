const path = require('path');
module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'app', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'app', 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
};