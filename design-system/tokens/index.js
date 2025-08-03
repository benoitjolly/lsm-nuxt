import colors from './colors.json' with { type: 'json' }
import spacing from './spacing.json' with { type: 'json' }
import typography from './typography.json' with { type: 'json' }
import effects from './effects.json' with { type: 'json' }
import themes from './themes.json' with { type: 'json' }

/**
 * Résout une référence de token (ex: "indigo.600" -> "#4f46e5")
 */
function resolveTokenRef(ref, tokens) {
  if (typeof ref !== 'string' || !ref.includes('.')) {
    return ref
  }
  
  const path = ref.split('.')
  let value = tokens
  
  for (const key of path) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      console.warn(`Token reference not found: ${ref}`)
      return ref
    }
  }
  
  return value
}

/**
 * Résout récursivement toutes les références de tokens
 */
function resolveAllRefs(obj, allTokens, visited = new Set(), path = '') {
  if (typeof obj === 'string') {
    const currentPath = `${path}.${obj}`
    if (visited.has(currentPath)) {
      console.warn(`Circular reference detected: ${currentPath}`)
      return obj
    }
    visited.add(currentPath)
    const resolved = resolveTokenRef(obj, allTokens)
    if (resolved === obj) {
      visited.delete(currentPath)
      return obj
    }
    const final = resolveAllRefs(resolved, allTokens, visited, path)
    visited.delete(currentPath)
    return final
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item, index) => resolveAllRefs(item, allTokens, visited, `${path}[${index}]`))
  }
  
  if (obj && typeof obj === 'object') {
    const resolved = {}
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveAllRefs(value, allTokens, visited, `${path}.${key}`)
    }
    return resolved
  }
  
  return obj
}

// Combine tous les tokens
const allTokens = {
  colors: colors.colors,
  spacing: spacing.spacing,
  typography: typography.typography,
  effects: effects,
  themes: themes.themes
}

// Résout les références sémantiques pour chaque thème
const resolvedTokens = {
  ...allTokens,
  colors: {
    ...allTokens.colors,
    semantic: resolveAllRefs(colors.semantic, allTokens)
  },
  spacing: {
    ...allTokens.spacing,
    semantic: resolveAllRefs(spacing.semantic, allTokens)
  },
  typography: {
    ...allTokens.typography,
    semantic: resolveAllRefs(typography.semantic, allTokens)
  },
  effects: {
    ...allTokens.effects,
    semantic: resolveAllRefs(effects.semantic, allTokens)
  },
  themes: {
    light: resolveAllRefs(themes.themes.light, allTokens),
    dark: resolveAllRefs(themes.themes.dark, allTokens),
    semantic: {
      light: resolveAllRefs(themes.semantic.light, allTokens),
      dark: resolveAllRefs(themes.semantic.dark, allTokens)
    }
  }
}

export { resolvedTokens as tokens }
export default resolvedTokens