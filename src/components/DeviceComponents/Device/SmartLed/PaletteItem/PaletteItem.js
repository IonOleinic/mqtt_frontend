import { useState, useEffect } from 'react'
import plusToX from 'react-useanimations/lib/plusToX'
import UseAnimations from 'react-useanimations'
import CustomColorPicker from '../../../../CustomColorPicker/CustomColorPicker'
import './PaletteItem.css'

function PaletteItem({ initColor, handlePaletteChange, id }) {
  const [isClear, setIsClear] = useState(false)
  const [iconVisibility, setIconVisibility] = useState(true)
  const [pickerVisibility, setPickerVisibility] = useState(false)
  const [color, setColor] = useState('#ffffff')

  useEffect(() => {
    if (initColor != '') {
      setColor('#' + initColor)
      setIsClear(true)
      setIconVisibility(false)
    }
  }, [])

  return (
    <div
      className='palette-color-item'
      onMouseEnter={() => {
        setIconVisibility(true)
      }}
      onMouseLeave={() => {
        if (isClear == false) {
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
            if (isClear == false) {
              setColor('#efab89')
              setPickerVisibility(true)
            } else {
              setColor('#ffffff')
              setPickerVisibility(false)
              handlePaletteChange(id, '')
            }
            setIsClear((prev) => !prev)
          }}
          style={{ display: iconVisibility == false ? 'none' : 'flex' }}
        >
          <UseAnimations reverse={isClear} size={50} animation={plusToX} />
        </div>
        <div
          className='palette-box-color'
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <CustomColorPicker
        color={color}
        onChange={setColor}
        visibility={pickerVisibility}
        setVisibility={setPickerVisibility}
        onFinish={() => {
          handlePaletteChange(id, color)
          setIconVisibility(false)
        }}
      />
    </div>
  )
}

export default PaletteItem
