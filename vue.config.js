const {defineConfig} = require('@vue/cli-service')
const path = require("path");
module.exports = defineConfig({
    devServer: {
        client: {
            overlay: false
        }, proxy: {
            '/api': {
                target: 'http://54.222.173.61:8081', changeOrigin: true, pathRewrite: {'^/api': ''}
            }
        }
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
