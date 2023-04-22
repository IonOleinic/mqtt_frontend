import React, { useState } from 'react'
import { ChromePicker } from 'react-color'
import './SmartBulb.css'
import rgbHex from 'rgb-hex'
function SmartBulb({ device, visibility }) {
  const [color, setColor] = useState('#fff')
  const [colorValues, setColorValues] = useState({
    r: 255,
    g: 0,
    b: 0,
    c: 0,
    w: 0,
    a: 1,
  })
  const handleChange = (updatedColor) => {
    const { r, g, b, a } = updatedColor.rgb
    const maxRgb = Math.max(r, g, b)
    const w = Math.round((1 - a) * (255 - maxRgb))
    const c = Math.round((1 - a) * 255)
    setColorValues({ r, g, b, c, w, a })
    setColor(
      '#' +
        rgbHex(
          updatedColor.rgb.r,
          updatedColor.rgb.g,
          updatedColor.rgb.b,
          updatedColor.rgb.a
        )
    )
  }
  return (
    <div
      className='smart-rgb-bulb'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
      <ChromePicker color={color} onChange={handleChange} />
      <div
        className='div'
        style={{
          backgroundColor: `rgba(${colorValues.r}, ${colorValues.g}, ${colorValues.b},${colorValues.a})`,
        }}
      />
    </div>
  )
}

export default SmartBulb
