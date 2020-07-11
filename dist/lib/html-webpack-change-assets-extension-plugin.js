"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                    if (data.plugin.options.extdebug) {
                        console.log('ext', scriptFile);
                    }
                    var s = scriptFile;
                    if (s) {
                        if (data.plugin.options.extlocalonly) {
                            if (data.plugin.options.extdebug)
                                console.log('extlocalonly', s);
                            if (s.includes('http')) {
                                if (data.plugin.options.extdebug)
                                    console.log('extlocalonly return', s);
                                return scriptFile;
                            }
                        }
                        var ret = "" + scriptFile + jsExtension;
                        if (s.includes('?')) {
                            var fileSplit = s.split('?');
                            ret = "" + fileSplit[0] + jsExtension + "?" + fileSplit[1];
                        }
                        return ret;
                    }
                    return "" + scriptFile + jsExtension;
                });
                return cb(null, data);
            });
        });
    };
    return HtmlWebpackChangeAssetsExtensionPlugin;
}());
exports.default = HtmlWebpackChangeAssetsExtensionPlugin;
//# sourceMappingURL=html-webpack-change-assets-extension-plugin.js.map