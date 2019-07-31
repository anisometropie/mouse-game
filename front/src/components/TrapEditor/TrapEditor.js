import React from 'react'
import { last } from 'lodash'

import Interval from 'objects/Interval'
import RectangleBuilder from 'objects/Rectangle'
import TrapSystem from 'objects/TrapSystem'

import ListEditor from 'core.ui/ListEditor'
import GroupDisplay from './GroupDisplay'

import styles from './TrapEditor.css'

class TrapEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      trapSystemSelection: null,
      groupSelection: null
    }
  }

  componentDidUpdate(prevProps) {
    const { list } = this.props
    if (
      prevProps.list !== list &&
      !this.props.list.includes(this.state.trapSystemSelection)
    ) {
      this.setState({ trapSystemSelection: null, groupSelection: null })
    }
  }

  addGroup = () => {
    const { list, updateItem } = this.props
    const { trapSystemSelection } = this.state
    const trapIndex = list.indexOf(trapSystemSelection)
    const updatedTrapSystem = trapSystemSelection.addedGroup()
    updateItem(trapIndex, updatedTrapSystem)
    this.setState({ trapSystemSelection: updatedTrapSystem })
  }

  deleteGroup = () => {
    const { trapSystemSelection, groupSelection } = this.state
    const trapIndex = list.indexOf(trapSystemSelection)
    const groupIndex = trapSystemSelection.groups.indexOf(groupSelection)
    const updatedTrapSystem = trapSystemSelection.deletedGroup(groupIndex)
    updateItem(trapIndex, updatedTrapSystem)
    this.setState({ trapSystemSelection: updatedTrapSystem })
  }

  handleTrapSelection = selection => {
    if (selection !== this.state.trapSystemSelection) {
      this.setState({ trapSystemSelection: selection, groupSelection: null })
    }
  }

  handleGroupSelection = selection => {
    if (selection !== this.state.groupSelection) {
      this.setState({ groupSelection: selection })
    }
  }

  render() {
    const { trapSystemSelection, groupSelection } = this.state
    const { list, addItem, deleteItem } = this.props
    return (
      <div id={styles.mainContainer}>
        {/* SELECT TRAP SYSTEM */}
        <ListEditor
          itemName="Trap system"
          list={list}
          addItem={() => {
            addItem(new TrapSystem())
          }}
          deleteItem={deleteItem}
          selection={trapSystemSelection}
          onSelection={this.handleTrapSelection}
        />
        {trapSystemSelection && (
          <div>
            <div className={styles.section}>
              <label className={styles.sectionLabel} htmlFor="cycleLengthInput">
                Cycle length (ms)
              </label>
              <input
                className={styles.cycleLengthInput}
                id="cycleLengthInput"
                type="number"
                min="0"
              />
            </div>
            <div className={styles.section}>
              <label className={styles.sectionLabel} htmlFor="cycleLengthInput">
                Groups
              </label>
              <ListEditor
                row
                itemName="Group"
                list={trapSystemSelection.groups}
                addItem={this.addGroup}
                deleteItem={this.deleteGroup}
                onSelection={this.handleGroupSelection}
              />
              {groupSelection && <GroupDisplay group={groupSelection} />}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default TrapEditor
