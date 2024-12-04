function generateColorCSSVars(color) {
    return Object.entries(color)
      .map(([key, value]) => {
        return `--${key}: ${value};`
      })
      .filter(Boolean)
      .join('\n')
  }
  
  function colorCSSVarsStyles(lightVars, darkVars, { themeName }) {
    return `
    .theme-${themeName} {${lightVars}}
    .dark .theme-${themeName} {${darkVars}}`
  }
  
  export function generateCSSVars(themes) {
    if (!Array.isArray(themes)) {
      throw new Error(`themes must be an array`)
    }
    return themes.map(theme => {
      const { name = 'cpis-blue', cssVars = {} } = theme
      let cssStyle = ''
      const { light, dark } = cssVars
      const lightVars = generateColorCSSVars(light)
      const darkVars = generateColorCSSVars(dark)
    
      cssStyle += colorCSSVarsStyles(lightVars, darkVars, {
        themeName: name
      })
      return cssStyle
    }).join('\n')
  }
  