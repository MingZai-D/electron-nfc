const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const { name } = require("file-loader");

const PAGE_TITLE = "Light & Space";
// const VENDORS_LIBRARIES = [
//   "immutable",
//   "react",
//   "react-dom",
//   "react-redux",
//   "redux",
//   "three",
// ];

module.exports = () => {

  let config = {
    context: path.resolve(__dirname),
    entry: {
      app: "./src/main.js",
      // vendor: VENDORS_LIBRARIES,
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: process.env.NODE_ENV === 'production' ? "[chunkhash].[name].js" : '[name].[hash].js',
    },
    performance: {
      hints: process.env.NODE_ENV === 'production' ? "warning" : false,
    },
    devtool: process.env.NODE_ENV === 'production' ? "cheap-module-source-map" : "eval",
    devServer: {
      open: true,
      hot: !process.env.NODE_ENV === 'production',
      contentBase: path.join(__dirname, "./dist"),
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.css', '.node', 'scss'],
      alias: {
        "react-planner": path.join(__dirname, "./src/index"),
        "@": path.join(__dirname, "./src"),
      },
    },
    module: {
      rules: [{
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [{
            loader: "babel-loader",
            options: {
              compact: false,
              plugins: [
                "transform-object-rest-spread", ["import", {
                  libraryName: "antd",
                  style: 'css'
                }]
              ],
              presets: ["env", "react"],
            },
          }, ],
        },
        {
          test: /\.(jpe?g|png|gif|mtl|obj|ico|svg)$/i,
          use: [
            // 'file-loader',
            {
              loader: "file-loader",
              options: {
                hash: "sha512",
                digest: "hex",
                name: "[path][name].[ext]",
                context: "demo/src",
              },
            },
          ],
        },
        {
          test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
          loader: "file-loader?name=assets/[name].[ext]"
        },
        {
          test: /\.css$/,
          use: [{
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  modifyVars: {
                    'primary-color': '#FF6600',
                    'link-color': '#FF6600',
                  },
                  javascriptEnabled: true,
                }
              }
            },
          ]
          // loader: ["style-loader", "file-loader", "css-loader","", "sass-loader"],
        },
        {
          test: /\.scss$/,
          use: [{
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            },
            {
              loader: "sass-loader",
            },
            

          ],
        },
        {
          test: /\.svg/,
          loader: ["file-loader"],
        },
        {
          test: /\.pdf/,
          loader: ["file-loader"],
        },
        {
          test: /\.less$/,
          use: [{
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  modifyVars: {
                    'primary-color': '#FF6600',
                    'link-color': '#FF6600',
                  },
                  javascriptEnabled: true,
                }
              }
            },

          ]
        }
      ],
    },
    plugins: [
      new CompressionPlugin({
        // filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css)$/, // 压缩 js 与 css
        threshold: 10240, // 只处理比这个值大的资源。按字节计算
        minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
        // deleteOriginalAssets: true // 删除源文件
      }),
      new HtmlWebpackPlugin({
        title: PAGE_TITLE,
        template: "./src/index.html.ejs",
        filename: "index.html",
        inject: "body",
        production: process.env.NODE_ENV === 'production',
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: false,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        })
      ],
      minimize: process.env.NODE_ENV === 'production',
      splitChunks: {
        cacheGroups: {
          default: false,
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
            minSize: 10000,
            reuseExistingChunk: true,
          },
        },
      },
    },
  };

  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production"),
        },
      })
    );
  } else {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    )
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      isProduction: JSON.stringify(process.env.NODE_ENV === 'production'),
    })
  );

  return config;
};
