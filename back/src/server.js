const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
})
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())

const users = {
  // —— example ——
  // center: {previousX: 120, previousY: 280, x: 120, y: 280}
  // color: {red: 77, green: 204, blue: 121, hexString: "#4dcc79"}
  // id: "UEWGEPZMPQgHYguAAAAO"
  // name: ""
  // radius: 12
}

const maps = {}

module.exports = { app, server, users, maps }
