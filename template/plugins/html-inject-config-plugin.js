// class HtmlInjectConfigPlugin {
//   /**
//    * 构造函数
//    */
//   constructor(baseUrl = '') {
//     this.files = [baseUrl + 'config.js?t=' + new Date().getTime()]
//   }
//   apply(compiler) {
//     compiler.hooks.compilation.tap('HtmlInjectConfigPlugin', compilation => {
//       compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('HtmlInjectConfig', (data, callback) => {
//         data.assets.js = this.files.concat(data.assets.js)
//         callback(null, data)
//       })
//     })
//   }
// }


const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlInjectConfigPlugin {
  constructor(baseUrl = '') {
    this.files = [baseUrl + 'config.js?t=' + new Date().getTime()];
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlInjectConfigPlugin', (compilation) => {
      const HtmlWebpackPluginHooks = HtmlWebpackPlugin.getHooks(compilation);
      
      // 在合适的时机使用钩子
      HtmlWebpackPluginHooks.beforeEmit.tapAsync('HtmlInjectConfigPlugin', (data, callback) => {
        if (data && data.assets && data.assets.js) {
          // 确保 data.assets.js 存在
          data.assets.js = this.files.concat(data.assets.js);
        } else {
          console.warn('No js assets found to inject.');
        }
        callback(null, data);
      });
    });
  }
}

module.exports = HtmlInjectConfigPlugin;



