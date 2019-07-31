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
      trapSelection: null,
      groupSelection: null
    }
  }

  componentDidUpdate(prevProps) {
    const { list } = this.props
    if (
      prevProps.list !== list &&
      !this.props.list.includes(this.state.trapSelection)
    ) {
      this.setState({ trapSelection: null, groupSelection: null })
    }
  }

  addGroup = () => {
    const { trapSelection } = this.state
    trapSelection.addGroup()
    this.setState({ groupSelection: last(trapSelection.groups) })
  }

  deleteGroup = () => {
    const { trapSelection, groupSelection } = this.state
    const index = trapSelection.groups.indexOf(groupSelection)
    trapSelection.deleteGroup(index)
    this.setState({ groupSelection: null })
  }

  handleTrapSelection = selection => {
    if (selection !== this.state.trapSelection) {
      this.setState({ trapSelection: selection, groupSelection: null })
    }
  }

  handleGroupSelection = selection => {
    if (selection !== this.state.groupSelection) {
      this.setState({ groupSelection: selection })
    }
  }

  render() {
    const { trapSelection, groupSelection } = this.state
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
          onSelection={this.handleTrapSelection}
        />
        {trapSelection && (
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
                list={trapSelection.groups}
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
