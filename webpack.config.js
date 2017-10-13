const path = require('path');
const webpack = require("webpack");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: {
    app: './src/js/main.js',
    vendor: ['pixi', 'p2', 'phaser','webfontloader']
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'game.js'
  },
  plugins: [
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3005,
      proxy: 'http://localhost:3000/'
    }),
    new webpack.optimize.CommonsChunkPlugin({name:'vendor', filename:'vendor_bundle.js'}),
    extractSass
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] },
      { test: /\.sass$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }
    ]
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2
    }
  }
}
