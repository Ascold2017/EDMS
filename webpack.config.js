var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    entry: './src/main.js',
    styles: './src/styles/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            loaders: {
              sass: [
                'vue-style-loader',
                'css-loader',
                'svg-fill-loader/encodeSharp',
                'sass-loader?indentedSyntax',
                {
                  loader: 'sass-resources-loader',
                  options: {
                    resources: [
                      './src/styles/common/variables.sass',
                      './src/styles/common/mixins.sass'
                    ]
                  }
                }
              ]
            }
          }
        }]
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        test: /\.sass$/,
        use: ['style-loader', 'css-loader', 'sass-loader?indentedSyntax'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.svg$/,
        use: [
          'url-loader',
          {
            loader: 'svg-fill-loader?fill=white'
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'img': path.resolve(__dirname, 'src/assets/img'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'styles': path.resolve(__dirname, 'src/styles')
    },
    extensions: ['.js', '.vue'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src/components')
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash'
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = '#source-map'

  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
