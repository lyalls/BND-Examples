/**
 * Created by sunlin on 30/03/2017.
 */
const path = require('path');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV;
const publicPath = '/resources/';
const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
        babelrc: false,
    }),
];
module.exports = {
    entry: {
        app: [
            'eventsource-polyfill',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
            './example1/client/app.js',
        ],
        vendors: [
            //'babel-polyfill', 
            'react', 'react-dom', 
        ],
    },
    output: {
        path: path.join(__dirname, '../lib/client/resources'),
        filename: '[name].js',
        publicPath,
    },

    plugins,
    module: {
        loaders: [{
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader',
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192&name=./image/[name].[ext]',
        }, {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'es2016', 'stage-0', 'react'],
                plugins: ['transform-runtime'],
                env: {
                    development: {
                        presets: ['react-hmre'],
                    },
                },
            },
        }, {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            loader: 'url-loader?limit=10000&name=./font/[name].[ext]',
        }],
    },

};
