import React from 'react'

/**
 * this components helps to wrap onChange, onKeyPress, onBlur behaviour
 * @function onChangeComplete is called when pressing enter or blurring
 */

class InputWithControls extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props
    if (value !== prevProps.value) {
      this.setState({ value })
    }
  }

  handleChange = event => {
    const { onChange } = this.props
    if (onChange) {
      onChange(event)
    } else {
      this.setState({
        value: event.target.value
      })
    }
  }

  handleSubmit = () => {
    const { onChange, onChangeComplete } = this.props
    if (onChange) {
      onChangeComplete()
    } else {
      onChangeComplete(this.state.value)
    }
  }

  render() {
    const {
      id,
      onChange,
      onChangeComplete,
      className,
      type,
      min,
      max,
      step
    } = this.props
    return (
      <input
        id={id}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            this.handleSubmit()
          }
        }}
        onBlur={this.handleSubmit}
        className={className}
        type={type}
        min={min}
        max={max}
        step={step}
      />
    )
  }
}
export default InputWithControls
