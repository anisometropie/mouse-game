function* idGenerator() {
  let index = 10
  while (true) {
    const newId = index.toString(36)
    if (!newId.substring(0, 1).match(/[0-9]/)) {
      yield newId
    }
    index++
  }
}

const gen = idGenerator()

const generateID = name => {
  const number = new Date() * 10000000 * Math.random()
  const prefix = name ? `${name}_` : ''
  return `${prefix}${number.toString(36)}_${gen.next().value}`
}

export default generateID
