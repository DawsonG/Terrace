module.exports = {
    entry: './admin/src/index.jsx',
    output: {
        filename: './admin/bundle.js', //this is the default name, so you can skip it
        //at this directory our bundle file will be available
        //make sure port 8090 is used when launching webpack-dev-server
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            },
            {
                test: /\.s?css$/,
                loaders: ["style", "css", "sass"]
            },
            { 
                test: /\.(png|jpe?g)$/, 
                loader: 'url-loader?limit=8192'
            }
        ],
        noParse: /node_modules\/quill\/dist/
    },
    sassLoader: {
        includePaths: ["./admin/src/scss"]
    },
    externals: {
        //don't bundle the 'react' npm package with our bundle.js
        //but get it from a global 'React' variable
        //'react': 'React'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};