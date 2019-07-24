import React from 'react'

const CheckboxList = ({ list, onChange }) => {
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
  return checkboxes
}

export default CheckboxList
