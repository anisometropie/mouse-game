import React from 'react'
import styles from './CheckboxList.css'

const CheckboxList = ({ title, list, onChange }) => {
  const checkboxes = list.map(l => {
    const id = l[0]
    const label = l[1]
    return (
      <div key={id}>
        <input onChange={onChange} type="checkbox" id={id} value={id} />
        <label htmlFor={id}>{label}</label>
      </div>
    )
  })
  return (
    <div className={styles.list}>
      <span id={styles.title}>{title}</span>
      {checkboxes}
    </div>
  )
}

export default CheckboxList
