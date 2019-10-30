const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const htmlPlugin = new HtmlWebpackPlugin({
  template: 'index.html'
});

const copyPlugin = new CopyWebpackPlugin([
  {from:'assets/media',to:'media'},,
  {from:'assets/data', to: 'data'}
]); 

module.exports = {
  entry: './app.ts',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  watch: true,
  devServer: {
    contentBase: path.resolve(__dirname, './src/assets'),
    stats: 'errors-only',
    port: 8000,
    compress: true
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.html$/, use: ['html-loader'] },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /(\.png|\.jpg|\.csv|\.ttf|\.woff|\.woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].[ext]' }
          }
        ]
      }
    ]
  },
  plugins: [htmlPlugin, copyPlugin]
};
