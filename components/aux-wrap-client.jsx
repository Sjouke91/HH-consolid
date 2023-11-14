"use client"

import React from 'react'

function AuxWrapClient(props) {
  return (
    <props.componentToRender {...props}>
      {props.children}
    </props.componentToRender>
  )
}

export default AuxWrapClient