import { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'
import './SubLed.css'

const ledTypes = [
  { name: 'White', code: 'white' },
  { name: 'RGB', code: 'rgb' },
  { name: 'RGBW', code: 'rgbw' },
  { name: 'RGBCW', code: 'rgbcw' },
]

function SubLed({ setAttributes }) {
  const [selectedLedType, setSelectedLedType] = useState(ledTypes[1])
  useEffect(() => {
    setAttributes({
      led_type: selectedLedType?.code,
    })
  }, [selectedLedType])

  return (
    <>
      <div className='form-input-group'>
        <label htmlFor='select-led-type'>Led Type</label>
        <Dropdown
          id='select-led-type'
          placeholder='Select a led type'
          optionLabel='name'
          options={ledTypes}
          value={selectedLedType}
          onChange={(e) => {
            setSelectedLedType(e.value)
          }}
        />
      </div>
    </>
  )
}

export default SubLed
