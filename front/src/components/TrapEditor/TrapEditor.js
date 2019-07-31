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

  updateTrapSystem = updatedTrapSystem => {
    const { list, updateItem } = this.props
    const trapIndex = list.indexOf(this.state.trapSystemSelection)
    updateItem(trapIndex, updatedTrapSystem)
    this.setState({ trapSystemSelection: updatedTrapSystem })
  }

  addGroup = () => {
    const updatedTrapSystem = this.state.trapSystemSelection.addedGroup()
    this.updateTrapSystem(updatedTrapSystem)
  }

  deleteGroup = () => {
    const { trapSystemSelection, groupSelection } = this.state
    if (trapSystemSelection && groupSelection) {
      const groupIndex = trapSystemSelection.groups.indexOf(groupSelection)
      const updatedTrapSystem = trapSystemSelection.deletedGroup(groupIndex)
      this.updateTrapSystem(updatedTrapSystem)
    }
  }

  editGroupTiming = (leftBound, rightBound) => {
    const { trapSystemSelection, groupSelection } = this.state
    const groupIndex = trapSystemSelection.groups.indexOf(groupSelection)
    const updatedTrapSystem = trapSystemSelection.editedTiming(
      groupIndex,
      leftBound,
      rightBound
    )
    this.updateTrapSystem(updatedTrapSystem)
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
                Cycle (ms)
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
              {groupSelection && (
                <GroupDisplay
                  editGroupTiming={this.editGroupTiming}
                  group={groupSelection}
                />
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default TrapEditor
