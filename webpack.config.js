"use strict";

const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');
const Case = require('case');
const name = Case.kebab(pkg.name);
const date = new Date().toISOString().slice(0, 10);
const author = pkg.author.slice(0, pkg.author.indexOf(' <'));
const banner = `${name} ${pkg.version} by ${author} ${date}
${pkg.homepage}
License ${pkg.license}`;

module.exports = {
	entry: {
		[name]: './sg2d.js',
		[name + '.min']: './sg2d.js'
	},
	output: {
		library: Case.pascal(name),
		path: path.resolve(__dirname, './build'),
		publicPath: '/libs',
		filename: '[name].js',
		libraryTarget: 'module'
	},
	/*externals: {
		'matter-js': {
			commonjs: 'matter-js',
			commonjs2: 'matter-js',
			amd: 'matter-js',
			root: 'Matter'
		},
		'pixi-js': {
			commonjs: 'pixi-js',
			commonjs2: 'pixi-js',
			amd: 'pixi-js',
			root: 'PIXI'
		}
	},*/
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			minimize: true
		}),
		new webpack.BannerPlugin(banner)
	]
};