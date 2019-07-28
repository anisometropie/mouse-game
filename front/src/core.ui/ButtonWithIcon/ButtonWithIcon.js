import React from 'react'
import { Tooltip } from '@material-ui/core'
import * as reactFeather from 'react-feather'

import styles from './ButtonWithIcon.css'

const ButtonWithIcon = ({
  value,
  onClick = () => {},
  icon = 'Settings',
  selected,
  tooltip = '',
  width = 42,
  height = 42,
  iconSize = 24
}) => {
  const Icon = reactFeather[icon]
  return (
    <Tooltip title={tooltip} enterDelay={150}>
      <div
        style={{ width, height, background: selected ? '#ccd9ff' : null }}
        onClick={() => onClick(value)}
        id={styles.container}
        width={width}
        height={height}
      >
        <Icon size={iconSize} />
      </div>
    </Tooltip>
  )
}

export default ButtonWithIcon
