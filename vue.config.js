const {defineConfig} = require('@vue/cli-service')
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = defineConfig({
    configureWebpack: {
        plugins: [new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css', chunkFilename: 'css/[name].[contenthash:8].css',
        }),],
    }, devServer: {
        client: {
            overlay: false
        }, proxy: {
            '/api': {
                target: 'http://54.222.173.61:8081', changeOrigin: true, pathRewrite: {'^/api': ''}
            }
        }, compress: false
    }, transpileDependencies: true, lintOnSave: false, chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude.add(path.join(__dirname, './src/assets/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.join(__dirname, './src/assets/icons'))
            .end()
            .use('svg-sprite')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    },
})
