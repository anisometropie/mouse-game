import React from 'react'

import TextField from '@material-ui/core/TextField'
import Popper from '@material-ui/core/Popper'

import { TwitterPicker } from 'react-color'
import styles from './ColorPicker.css'

export default class ColorPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: props.value,
      isBeingEdited: false,
      anchorEl: null
    }
    this.pickerRef = React.createRef()
  }

  componentDidUpdate(prevProps, prevState) {
    const { color, isBeingEdited } = this.state
    if (isBeingEdited) {
      this.pickerRef.current.focus()
    }
  }

  handleBlur = () => {
    setTimeout(() => {
      if (
        this.pickerRef.current !== null &&
        !this.pickerRef.current.contains(document.activeElement)
      ) {
        this.setState({
          isBeingEdited: false
        })
      }
    }, 1)
  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
      isBeingEdited: !this.state.isBeingEdited
    })
  }

  handleChange = value => {
    this.setState({
      isBeingEdited: false,
      color: value
    })
  }

  render() {
    const {
      label,
      name,
      onChangeComplete,
      noTextField = false,
      pickerTriangle
    } = this.props
    return (
      <div className={styles.colorPickerContainer}>
        <div className={styles.buttonContainer}>
          <button
            style={{ backgroundColor: this.state.color }}
            className={styles.button}
            onClick={this.handleClick}
            onBlur={this.handleBlur}
          />
        </div>
        {!noTextField && (
          <TextField
            label={label}
            name={name}
            value={this.state.color}
            onChange={e => {
              this.handleChange(e.target.value)
            }}
            onBlur={this.handleBlur}
            margin="normal"
          />
        )}
        <Popper
          open={this.state.isBeingEdited}
          anchorEl={this.state.anchorEl}
          disablePortal={true}
          placement="bottom-start"
          modifiers={{
            flip: {
              enabled: false
            }
          }}
          className={styles.colorPicker}
        >
          <div ref={this.pickerRef} onBlur={this.handleBlur}>
            <TwitterPicker
              color={this.state.color}
              onChangeComplete={color => {
                this.handleChange(color.hex)
                onChangeComplete(color.hex)
              }}
              colors={[
                '#000000',
                '#ffffff',
                '#f44336',
                '#E91E63',
                '#9C27B0',
                '#673AB7',
                '#3F51B5',
                '#2196F3',
                '#03A9F4',
                '#00BCD4',
                '#4CAF50',
                '#8BC34A',
                '#CDDC39',
                '#FFEB3B',
                '#FFC107',
                '#FF9800',
                '#FF5722'
              ]}
              triangle={pickerTriangle}
            />
          </div>
        </Popper>
      </div>
    )
  }
}
