import React from 'react'
import { get } from 'lodash'
import styles from './CheckboxList.css'

class CheckboxList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: this.getValuesFromProps()
    }
  }

  getValuesFromProps = () => {
    const { ids, values } = this.props
    return Object.fromEntries(ids.map(id => [id, get(values, id, false)]))
  }

  componentDidUpdate(prevProps, prevState) {
    const { ids, values } = this.props
    if (values !== prevProps.values) {
      this.setState({
        values: this.getValuesFromProps()
      })
    }
  }

  handleChange = event => {
    const { value } = event.target
    const { values } = this.state
    this.setState({
      values: {
        ...values,
        [value]: !values[value]
      }
    })
    this.props.onChange(event)
  }

  render() {
    const { title, ids, labels } = this.props
    const checkboxes = ids.map((id, index) => {
      return (
        <div key={id}>
          <input
            onChange={this.handleChange}
            type="checkbox"
            id={id}
            value={id}
            checked={this.state.values[id]}
          />
          <label htmlFor={id}>{labels[index]}</label>
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
}

export default CheckboxList
