const { name } = require('./package')

// todo 修改成业务名
const publicPath = '/cpis-provider-RPOJECTNAME/'
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = function (config) {
  return import('@unocss/webpack').then(unocss => {
    const UnoCss = unocss.default
    return {
      publicPath,
      lintOnSave: false,
      css: {
        extract:
          process.env.NODE_ENV === 'development'
            ? {
                filename: 'css/[name].css',
                chunkFilename: 'css/[name].css'
              }
            : true
      },
      devServer: {
        hot: true,
        client: {
          overlay: false
        },
        // 修改成对应端口
        port: 10118,
        static: {
          directory: path.join(__dirname, 'public'),
          publicPath
        },
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
          index: '/index.html' //与output的publicPath
        }
      },
      productionSourceMap: false, // 不输出 map 文件
      configureWebpack: {
        output: { library: `${name}-[name]`, libraryTarget: 'umd', chunkLoadingGlobal: `webpackJsonp_${name}` }, // 把微应用打包成 umd 库格式
        plugins: [new UnoCss()],
        resolve: {
          alias: {
            '@': resolve('src'),
            '@cupu': resolve('node_modules/@cpis/cupubase/src'),
            '@platform': resolve('node_modules/@cpis/platformbase/src'),
            '@api': resolve('src/api'),
            vue$: 'vue/dist/vue.esm.js'
          }
        }
      },
      transpileDependencies: ['@cpis/cupubase', '@cpis/platformbase'],
      chainWebpack: config => {
        config.plugins['delete']('prefetch-index')
        config.plugins['delete']('preload-index')
      }
    }
  })
}
