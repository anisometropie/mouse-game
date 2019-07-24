import React from 'react'
import Game from 'components/Game'
import MapEditor from 'components/MapEditor'
import { loadMap } from 'utils/maps'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { mode: 'editor' }
  }
  changeMode = mode => {
    this.setState({ mode })
  }

  render() {
    return (
      <div>
        <div>
          <button
            onClick={() => {
              this.changeMode('game')
            }}
          >
            Game
          </button>
          <button
            onClick={() => {
              this.changeMode('editor')
            }}
          >
            Editor
          </button>
        </div>
        {this.state.mode === 'game' ? (
          <Game world={loadMap('world1')} />
        ) : (
          <MapEditor />
        )}
      </div>
    )
  }
}

export default App
