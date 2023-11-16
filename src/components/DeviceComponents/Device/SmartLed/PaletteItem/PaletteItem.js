import React, { useState, useEffect } from 'react'
import './PaletteItem.css'
import plusToX from 'react-useanimations/lib/plusToX'
import UseAnimations from 'react-useanimations'
import { HexColorPicker } from 'react-colorful'
function PaletteItem({ initColor, handlePaletteChange, position, id }) {
  const [checked, setChecked] = useState(false)
  const [clear, setClear] = useState(false)
  const [iconVisibility, setIconVisibility] = useState(true)
  const [pickerVisibility, setPickerVisibility] = useState(false)
  const [color, setColor] = useState('#ffffff')
  useEffect(() => {
    if (initColor != '') {
      setChecked(true)
      setColor('#' + initColor)
      setClear(true)
      setIconVisibility(false)
    }
  }, [])

  return (
    <div
      className='palette-color-item'
      onBlur={() => {
        setTimeout(() => {
          setPickerVisibility(false)
          handlePaletteChange(id, color)
          setIconVisibility(false)
        }, 200)
      }}
      onMouseEnter={() => {
        setIconVisibility(true)
      }}
      onMouseLeave={() => {
        if (clear == false) {
          setIconVisibility(true)
        } else if (pickerVisibility == false) {
          setIconVisibility(false)
        }
      }}
    >
      <div className='palette-box'>
        <div
          className='palette-box-add'
          onClick={() => {
            if (clear == false) {
              setColor('#efab89')
              setPickerVisibility(true)
            } else {
              setColor('#ffffff')
              setPickerVisibility(false)
              handlePaletteChange(id, '')
            }
            setClear(!clear)
          }}
          style={{ display: iconVisibility == false ? 'none' : 'flex' }}
        >
          <UseAnimations reverse={checked} size={50} animation={plusToX} />
        </div>
        <div
          className='palette-box-color'
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <div
        className={`palette-color-picker palette-color-picker-position-${position}`}
        style={{ display: pickerVisibility == false ? 'none' : 'flex' }}
      >
        <HexColorPicker
          color={color}
          onChange={(clr) => {
            setColor(clr)
          }}
        />
      </div>
    </div>
  )
}

export default PaletteItem
