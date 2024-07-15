const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const path = require('path')
const resolve = dir => path.join(process.cwd(), dir)
module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    optimization: { minimizer: [new OptimizeCSSAssetsWebpackPlugin()] } // 在这里配置 CSS 压缩
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@cupu', resolve('src'))
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
    // config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
  }
}
