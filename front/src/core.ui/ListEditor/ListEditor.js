import React from 'react'
import { last } from 'lodash'
import styles from './ListEditor.css'

/**
 * Display a list of items
 * Allows to select, add, delete element
 */

class ListEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selection: null
    }
  }

  handleSelection = selection => {
    const { onSelection } = this.props
    this.setState({ selection })
    if (onSelection) {
      onSelection(selection)
    }
  }

  handleAdd = () => {
    const { list, addItem } = this.props
    addItem()
    this.setState({ selection: last(list) })
  }

  handleRemove = () => {
    const { list, deleteItem } = this.props
    const { selection } = this.state
    if (selection) {
      const index = list.indexOf(selection)
      deleteItem(index)
      this.setState({ selection: null })
    }
  }

  /**
    * @param {Object[]} list — the elements to display
    * @param {string} nameKey — the object property to display in the list

  */
  render() {
    const { list, itemName, nameKey = null, row = false } = this.props
    const listComponents = list.map((element, index) => (
      <li
        className={styles.listItem}
        style={{
          background: this.state.selection === element ? '#ccd9ff' : null
        }}
        key={index}
        onClick={() => this.handleSelection(element)}
      >
        {itemName}
      </li>
    ))
    return (
      <div id={styles.mainContainer}>
        <span />
        <div className={styles.buttons}>
          <button className={styles.button} onClick={this.handleAdd}>
            Add
          </button>
          <button className={styles.button} onClick={this.handleRemove}>
            Remove
          </button>
        </div>
        <ul
          style={{ flexDirection: row ? 'row' : 'column' }}
          className={styles.list}
        >
          {listComponents}
        </ul>
      </div>
    )
  }
}

export default ListEditor
