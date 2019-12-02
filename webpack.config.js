const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    'vue-build': './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[chunkhash:8].js',
  },
  optimization: {
    splitChunks: {
      // SplitChunks plugin by default only targets 'async' chunks. (Chunks
      // fetched client side, not those referenced in HTML). Here we tell
      // Webpack to pull vendor code out of entry chunks too.
      chunks: 'initial',
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ['vue-style-loader', 'css-loader', 'sass-loader']
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new ManifestPlugin()
  ]
}
