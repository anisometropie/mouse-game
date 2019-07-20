const chalk = require('chalk')

const withColor = (color, text) => {
  if (color) {
    const { red, green, blue } = color
    return chalk.rgb(red, green, blue)(text)
  } else {
    return text
  }
}

module.exports = { withColor }
