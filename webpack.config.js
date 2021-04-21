const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require("cssnano");
const UgliFyJsPlugin = require('uglifyjs-webpack-plugin');

const JS_DIR = path.resolve(__dirname,'src/js');
const IMG_DIR = path.resolve(__dirname,'src/images');
const BUILD_DIR = path.resolve(__dirname,'build');

const entry = {
    main : JS_DIR + '/main.js'
};

const output = {
    path: BUILD_DIR,
    filename: 'js/[name].js'
};

const rules = [
    {
        test: /\.js$/,
        include: [JS_DIR],
        exclude: /node_modules/,
        use:{
            loader:'babel-loader',
            options:{
                presets:['@babel/preset-env'],
                plugins:['@babel/plugin-proposal-class-properties']
            }
        }
    },
    {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader','sass-loader']
    },
    {
        test: /\.(png|jpg|svg|jpeg|gif|ico)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name:' [path][name].[ext]',
                    // publicPath: 'production' === process.env.NODE_ENV ? '../' : '../../'
                }
            }
        ]
    }
];

const plugins = (argv) => {

    return [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: ('production' === argv.mode)
        }),
        new MiniCssExtractPlugin({
            filename : 'css/[name].css'
        })
    ]
}

module.exports = (env,argv) => ({
    entry: entry,
    output: output,
    devtool: 'source-map',
    plugins: plugins(argv),
    module: {
        rules: rules
    },
    optimization:{
        minimizer:[
            new OptimizeCssAssetsPlugin({
                cssProcessor:cssnano
            }),
            new UgliFyJsPlugin({
                cache:false,
                parallel:true,
                sourceMap:false
            })
        ]
    },
    externals:{
        jquery:'jQuery'
    }
});