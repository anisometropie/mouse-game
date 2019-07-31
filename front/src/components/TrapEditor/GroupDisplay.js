import React from 'react'
import { get } from 'lodash'
import styles from './TrapEditor.css'

const GroupDisplay = ({ group }) => {
  const rectangles = group.traps.map((rectangle, i) => (
    <li
      style={{ background: get(rectangle, 'color.hexString') }}
      key={`rect_${i}`}
    >{`${rectangle.x},${rectangle.y}`}</li>
  ))
  return (
    <div className={styles.groupContainer}>
      <div className={styles.timingContainer}>
        <label className={styles.groupSectionLabel}>Timing</label>
        <div className={styles.timingInputContainer}>
          <input className={styles.timingInput} type="text" />
          <input className={styles.timingInput} type="text" />
        </div>
      </div>
      <div className={styles.rectangleListContainer}>
        <label className={styles.groupSectionLabel}>Rectangles</label>
        <ul>{rectangles}</ul>
      </div>
    </div>
  )
}

export default GroupDisplay
