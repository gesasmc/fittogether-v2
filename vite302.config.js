import baseConfig from './vite.config.js'
import cardioSearch302 from './vite302.js'
import cardioBackgroundFix325 from './vite325.js'

export default {
  ...baseConfig,
  plugins:[...(baseConfig.plugins||[]),cardioSearch302(),cardioBackgroundFix325()],
}
