import React from 'react'
import Game from 'components/Game'

class App extends React.Component {
  render() {
    return (
      <div>
        <Game />
        <input id="userName" type="text" />
      </div>
    )
  }
}

export default App
