var webpack = require('webpack');

module.exports = {
    entry: './lib/npm-run-help.js',
    output: {
        libraryTarget: 'umd',
        library: 'npmRunHelp',
        path: __dirname,
        filename: 'npm-run-help.umd.js'
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
    ]
};