const OptimizeCSSAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyPlugin = require("uglifyjs-webpack-plugin")
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const path = require("path")
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: "/",
  productionSourceMap: false,
  css: { extract: true }, // 是否使用css分离插件 ExtractTextPlugin
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()],
    plugins: [],
    optimization: { minimizer: [new OptimizeCSSAssetsWebpackPlugin()] } // 在这里配置 CSS 压缩
  },
  chainWebpack: config => {
    config.resolve.alias.set("@platform", resolve("src"))
    config.optimization.minimizer("terser").tap(args => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
    config.optimization.minimizer = [new UglifyPlugin({ uglifyOptions: { warnings: false, compress: { drop_console: true, drop_debugger: false, pure_funcs: ["console.log"] } } })]
  }
}
