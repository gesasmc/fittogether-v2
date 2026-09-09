import baseConfig from './vite.config.js'
import cardioSearch302 from './vite302.js'

export default {
  ...baseConfig,
  plugins:[...(baseConfig.plugins||[]),cardioSearch302()],
}
