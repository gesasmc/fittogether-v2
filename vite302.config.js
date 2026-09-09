import baseConfig from './vite.config.js'
import cardioSearch302 from './vite302.js'
import trainingCompletion303 from './vite303.js'

export default {
  ...baseConfig,
  plugins:[...(baseConfig.plugins||[]),cardioSearch302(),trainingCompletion303()],
}
