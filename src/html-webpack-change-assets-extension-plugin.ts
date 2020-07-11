const HtmlWebpackPlugin = require('html-webpack-plugin')

export default class HtmlWebpackChangeAssetsExtensionPlugin {
  options: object

  constructor(options?: object) {
    this.options = options || {}
  }

  apply(compiler: any) {
    compiler.hooks.compilation.tap('HtmlWebpackChangeAssetsExtensionPlugin', (compilation: any) => {
      let beforeGenerationHook
      if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
        // HtmlWebpackPlugin 3
        const { hooks } = compilation
        beforeGenerationHook = hooks.htmlWebpackPluginBeforeHtmlGeneration
      } else if (HtmlWebpackPlugin.version === 4) {
        // HtmlWebpackPlugin >= 4
        const hooks = HtmlWebpackPlugin.getHooks(compilation)
        beforeGenerationHook = hooks.beforeAssetTagGeneration
      }

      beforeGenerationHook.tapAsync(
        'HtmlWebpackChangeAssetsExtensionPlugin',
        (data: any, cb: Function) => {
          // Skip if the plugin configuration didn't set `jsExtension`
          if (!data.plugin.options.jsExtension) {
            return cb(null, data)
          }
          const jsExtension = data.plugin.options.jsExtension
          const tempArray = data.assets.js
          data.assets.js = tempArray.map((scriptFile: any) => {
            if (data.plugin.options.extdebug) {
              console.log('ext', scriptFile)
            }
            const s = scriptFile as string
            if (s) {
              if (data.plugin.options.extlocalonly) {
                if (data.plugin.options.extdebug) console.log('extlocalonly', s)
                if (s.includes('http')) {
                  if (data.plugin.options.extdebug) console.log('extlocalonly return', s)
                  return scriptFile
                }
              }
              let ret = `${scriptFile}${jsExtension}`
              if (s.includes('?')) {
                const fileSplit = s.split('?')
                ret = `${fileSplit[0]}${jsExtension}?${fileSplit[1]}`
              }
              return ret
            }

            return `${scriptFile}${jsExtension}`
          })
          return cb(null, data)
        }
      )
    })
  }
}
