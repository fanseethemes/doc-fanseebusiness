// Webpack uses this to work with directories
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var outpFileName= 'doc';
var sourcePath= './src/';
var outputPath= 'dist';

// This is main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = (env, argv) => {

    const config = {
        // Path to your entry point. From this file Webpack will begin his work
        entry: sourcePath+'js/index.js',

        // Path and filename of your result bundle.
        // Webpack will bundle all JavaScript into this file
        output: {
            path: path.resolve(__dirname, outputPath),
            filename: 'development' === argv.mode ?  outpFileName+'.js' : outpFileName+'.min.js'
        },
        devtool: "source-map",
        module: {
            rules: [
                    {
                        test: /\.js$/,
                        exclude: /(node_modules)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                                plugins:[
                                    ["@babel/plugin-proposal-class-properties"],
                                    ["@babel/plugin-proposal-private-methods"]
                                ]
                            }
                        }
                    },
                    {
                        // Apply rule for .sass, .scss or .css files
                        test: /\.(sa|sc|c)ss$/,
                        // Set loaders to transform files.
                        // Loaders are applying from right to left(!)
                        // The first loader will be applied after others
                        exclude: /(node_modules)/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                // This loader resolves url() and @imports inside CSS
                                loader: "css-loader",
                                options: {
                                    sourceMap: true,
                                    url: false, 
                                }
                            },
                            {
                                // Then we apply postCSS fixes like autoprefixer and minifying
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: true,
                                }
                            }, 
                            {
                                // First we transform SASS to standard CSS
                                loader: "sass-loader",
                                options: {
                                    implementation: require("sass"),
                                    sourceMap: true,
                                    sassOptions: (loaderContext) => {
                                        const {resourcePath, rootContext}= loaderContext;
                                        const relativePath= path.relative( rootContext, resourcePath);
                                        const returnObj = {
                                            outputStyle: 'expanded',
                                            includePaths: [rootContext+'/src/scss/base']
                                        };
                                        console.log(returnObj, 'return Objects');
                                        return returnObj;

                                   }
                                }
                            }
                        ]
                    }
                ]
        },

        plugins: [
            
            new MiniCssExtractPlugin({
                filename: 'development' === argv.mode ? outpFileName+".css" : outpFileName+".min.css",
                chunkFilename: '[id].css'
            }),

            new CopyPlugin([
                { from: sourcePath+'img', to: './img/' },
            ]),

            new CopyPlugin([
                { from: sourcePath+'venders', to: './venders/' },
            ]),

            new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                server: '.'// { baseDir: ['index.html'] }
            })
        ]

    };

    return config;

}