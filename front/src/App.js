import React from 'react'
import Game from 'components/Game'
import MapEditor from 'components/MapEditor'

class App extends React.Component {
  render() {
    return (
      <div>
        {/* <Game /> */}
        <MapEditor />
        <input id="userName" type="text" />
      </div>
    )
  }
}

export default App
