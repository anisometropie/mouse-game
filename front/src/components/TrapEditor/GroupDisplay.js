import React from 'react'
import { get } from 'lodash'
import styles from './TrapEditor.css'

class GroupDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getGroupTiming()
  }

  getGroupTiming = () => {
    const {
      group: {
        timing: { leftBound, rightBound }
      }
    } = this.props
    return { leftBound, rightBound }
  }

  componentDidUpdate(prevProps) {
    const { group } = this.props
    if (group !== prevProps.group) {
      this.setState(this.getGroupTiming())
    }
  }

  handleBoundChange = event => {
    const { id, value } = event.target
    this.setState({
      [id]: +value
    })
  }

  handleSubmit = () => {
    const { leftBound, rightBound } = this.state
    this.props.editGroupTiming(leftBound, rightBound)
  }

  render() {
    const { group } = this.props
    const { leftBound, rightBound } = this.state
    const rectangles = group.traps.map((rectangle, i) => (
      <li
        style={{ background: get(rectangle, 'color.hexString') }}
        key={`rect_${i}`}
      >{`${rectangle.x},${rectangle.y}`}</li>
    ))
    return (
      <div className={styles.groupContainer}>
        <div className={styles.timingContainer}>
          <label className={styles.groupSectionLabel}>Timing (ms)</label>
          <div className={styles.timingInputContainer}>
            <input
              id="leftBound"
              value={leftBound}
              onChange={this.handleBoundChange}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.handleSubmit()
                }
              }}
              onBlur={this.handleSubmit}
              className={styles.timingInput}
              type="number"
              min="0"
            />
            <input
              id="rightBound"
              value={rightBound}
              onChange={this.handleBoundChange}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.handleSubmit()
                }
              }}
              onBlur={this.handleSubmit}
              className={styles.timingInput}
              type="number"
              min="0"
            />
          </div>
        </div>
        <div className={styles.rectangleListContainer}>
          <label className={styles.groupSectionLabel}>Rectangles</label>
          <ul>{rectangles}</ul>
        </div>
      </div>
    )
  }
}

export default GroupDisplay
