var webpack = require('webpack');

module.exports = {
    entry: './lib/index.js',
    output: {
        libraryTarget: 'umd',
        library: 'scriptHelp',
        path: __dirname,
        filename: 'script-help.umd.js'
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        })
    ],
    target: 'node'
};