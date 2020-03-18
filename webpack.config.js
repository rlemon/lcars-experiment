const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { WebpackBundleSizeAnalyzerPlugin } = require('webpack-bundle-size-analyzer');

const MODE = process.env.NODE_ENV || 'development';

const config = {
	mode: MODE,

	entry: {
		app: [
			'./src'
		]
	},

	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'assets/entry.[name].[hash].js',
		chunkFilename: 'assets/dependancy.[id].[chunkhash].js',
		publicPath: '/'
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.s?css$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				],
				sideEffects: false
			},
			{
				test: /.(png|jpe?g|gif|svg|stl)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'assets/[hash].[ext]'
						}
					}
				]
			}
		]
	},

	plugins: [
		new WebpackBundleSizeAnalyzerPlugin('./webpack-report.txt'),
		new HtmlWebpackPlugin({
			chunks: ['app'],
			filename: 'index.html',
			template: 'src/template.html',
			title: 'lcars'
		})
	],

	devtool: 'source-map',

	devServer: {
		contentBase: './dist',
		watchContentBase: true
	}

};

if (MODE === 'production') {
	config.plugins.push(new CompressionPlugin({
		filename: '[path].gz[query]',
		algorithm: 'gzip',
		test: /\.js$|\.html$/,
		threshold: 10240,
		minRatio: 0.8
	}));
}

module.exports = config;