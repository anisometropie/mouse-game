import React from 'react'
import { last } from 'lodash'

import Interval from 'objects/Interval'
import RectangleBuilder from 'objects/Rectangle'
import TrapSystem from 'objects/TrapSystem'
import InputWithControls from 'core.ui/InputWithControls'

import ListEditor from 'core.ui/ListEditor'
import GroupDisplay from './GroupDisplay'

import styles from './TrapEditor.css'

class TrapEditor extends React.Component {
  updateTrapSystem = (updatedTrapSystem, selectedGroup) => {
    const {
      list,
      updateTrap,
      trapSystemSelection,
      groupSelection,
      setTrapSelection
    } = this.props
    const trapIndex = list.indexOf(trapSystemSelection)
    const groupIndex = trapSystemSelection.groups.indexOf(groupSelection)
    updateTrap(trapIndex, updatedTrapSystem)
    setTrapSelection(updatedTrapSystem, updatedTrapSystem.groups[groupIndex])
  }

  addGroup = () => {
    const updatedTrapSystem = this.props.trapSystemSelection.addedGroup()
    this.updateTrapSystem(updatedTrapSystem)
  }

  deleteGroup = () => {
    const { trapSystemSelection, groupSelection } = this.props
    if (trapSystemSelection && groupSelection) {
      const groupIndex = trapSystemSelection.groups.indexOf(groupSelection)
      const updatedTrapSystem = trapSystemSelection.deletedGroup(groupIndex)
      this.updateTrapSystem(updatedTrapSystem)
    }
  }

  editCycleLength = cycleLength => {
    const updatedTrapSystem = this.props.trapSystemSelection.editedCycleLength(
      cycleLength
    )
    this.updateTrapSystem(updatedTrapSystem)
  }

  editGroupTiming = (leftBound, rightBound) => {
    const { trapSystemSelection, groupSelection } = this.props
    const groupIndex = trapSystemSelection.groups.indexOf(groupSelection)
    const updatedTrapSystem = trapSystemSelection.editedTiming(
      groupIndex,
      leftBound,
      rightBound
    )
    this.updateTrapSystem(updatedTrapSystem)
  }

  render() {
    const {
      list,
      addTrap,
      deleteTrap,
      trapSystemSelection,
      groupSelection,
      setTrapSelection
    } = this.props
    return (
      <div id={styles.mainContainer}>
        {/* SELECT TRAP SYSTEM */}
        <ListEditor
          itemName="Trap system"
          list={list}
          addItem={() => {
            addTrap(new TrapSystem())
          }}
          deleteItem={index => {
            deleteTrap(index)
            setTrapSelection(null, null)
          }}
          selection={trapSystemSelection}
          onSelection={setTrapSelection}
        />
        {trapSystemSelection && (
          <div>
            <div className={styles.section}>
              <label className={styles.sectionLabel} htmlFor="cycleLengthInput">
                Cycle (ms)
              </label>
              <InputWithControls
                id="cycleLengthInput"
                value={trapSystemSelection.cycleLength}
                className={styles.cycleLengthInput}
                onChangeComplete={this.editCycleLength}
                type="number"
                min="0"
                step="100"
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
                onSelection={selection => {
                  setTrapSelection(undefined, selection)
                }}
              />
              {groupSelection && (
                <GroupDisplay
                  editGroupTiming={this.editGroupTiming}
                  group={groupSelection}
                  cycleLength={trapSystemSelection.cycleLength}
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
