const { app, maps } = require('./server')
const { has } = require('lodash')

app.get('/map/:id', (req, res) => {
  const { id } = req.params
  if (!has(maps, id)) {
    const timestamp = new Date() * 1
    maps[id] = { id, timestamp }
  }
  res.json(maps[id])
})
