import baseConfig from './vite.config.js'
import cardioSearch302 from './vite302.js'
import cardioBackgroundFix325 from './vite325.js'
import cardioProgress326 from './vite326.js'
import smartDayPlanner328 from './vite328.js'

export default {
  ...baseConfig,
  plugins:[...(baseConfig.plugins||[]),cardioSearch302(),cardioBackgroundFix325(),cardioProgress326(),smartDayPlanner328()],
}
