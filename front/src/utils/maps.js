import maps from 'maps'
import { getMap } from 'network/api'

export const loadMap = mapName => {
  getMap(mapName).then(data => {
    maps[mapName].traps.forEach(trap => {
      trap.setTimestamp(data.timestamp)
    })
  })
  document.onvisibilitychange = () => {
    if (!document.hidden) {
      maps[mapName].traps.forEach(trap => {
        trap.setTimeShift()
      })
    }
  }
  return maps[mapName]
}
