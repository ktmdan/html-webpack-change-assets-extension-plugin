(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.htmlWebpackChangeAssetsExtensionPlugin = factory());
}(this, (function () { 'use strict';

  var HtmlWebpackPlugin = require('html-webpack-plugin');
  var HtmlWebpackChangeAssetsExtensionPlugin = /** @class */ (function () {
      function HtmlWebpackChangeAssetsExtensionPlugin(options) {
          this.options = options || {};
      }
      HtmlWebpackChangeAssetsExtensionPlugin.prototype.apply = function (compiler) {
          compiler.hooks.compilation.tap('HtmlWebpackChangeAssetsExtensionPlugin', function (compilation) {
              var beforeGenerationHook;
              if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
                  // HtmlWebpackPlugin 3
                  var hooks = compilation.hooks;
                  beforeGenerationHook = hooks.htmlWebpackPluginBeforeHtmlGeneration;
              }
              else if (HtmlWebpackPlugin.version === 4) {
                  // HtmlWebpackPlugin >= 4
                  var hooks = HtmlWebpackPlugin.getHooks(compilation);
                  beforeGenerationHook = hooks.beforeAssetTagGeneration;
              }
              beforeGenerationHook.tapAsync('HtmlWebpackChangeAssetsExtensionPlugin', function (data, cb) {
                  // Skip if the plugin configuration didn't set `jsExtension`
                  if (!data.plugin.options.jsExtension) {
                      return cb(null, data);
                  }
                  var jsExtension = data.plugin.options.jsExtension;
                  var tempArray = data.assets.js;
                  data.assets.js = tempArray.map(function (scriptFile) {
                      if (data.plugin.options.localonly) {
                          if (scriptFile instanceof String) {
                              var s = scriptFile;
                              if (s.includes('http'))
                                  return scriptFile;
                          }
                      }
                      return "" + scriptFile + jsExtension;
                  });
                  return cb(null, data);
              });
          });
      };
      return HtmlWebpackChangeAssetsExtensionPlugin;
  }());

  return HtmlWebpackChangeAssetsExtensionPlugin;

})));
//# sourceMappingURL=html-webpack-change-assets-extension-plugin.umd.js.map
