const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const utils = require('./utils');

const antdCss = new ExtractTextWebpackPlugin({
  filename: utils.assetsPath('css/antd.[contenthash:8].css'),
});

module.exports = antdCss;
