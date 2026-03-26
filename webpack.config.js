import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (env, argv) => {
  const isDev = argv.mode !== 'production';

  return {
    entry: './src/main.js',

    output: {
      path: path.resolve('./dist'),
      filename: 'bundle.js',
      publicPath: '/',

      ...(isDev
        ? {}
        : {
            library: 'Vision',
            libraryTarget: 'umd',
            globalObject: 'this',
          }),

      clean: true
    },

    mode: isDev ? 'development' : 'production',

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },

        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },

        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        }
      ]
    },

    plugins: [
      ...(isDev
        ? [
            new HtmlWebpackPlugin({
              template: './src/index.html'
            })
          ]
        : [
            new MiniCssExtractPlugin({
              filename: 'vision.css'
            })
          ])
    ],

    devServer: isDev
      ? {
          static: {
            directory: path.resolve('./dist')
          },
          port: 8080,
          open: true,
          hot: true
        }
      : undefined,

    optimization: {
      minimize: !isDev
    }
  };
};