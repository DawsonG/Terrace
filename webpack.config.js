var webpack = require('webpack');
module.exports = {
    entry: './admin/src/Admin.js',
    output: {
        // path: __dirname + '/build',
        filename: "admin/dist/bundle.js"
    },
    module: {
        loaders: [
            {
                exlude: /(node_modules|terrace.js)/,
                loader: 'babel'
            }
            // { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]

};
