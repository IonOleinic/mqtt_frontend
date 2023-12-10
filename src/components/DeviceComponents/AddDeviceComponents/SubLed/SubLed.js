import React, { useState, useEffect } from 'react'
import './SubLed.css'
function SubLed({ setSubProps, disable_add_btn }) {
  const [subType, setSubType] = useState('bulb')
  const [ledType, setLedType] = useState('rgb')
  useEffect(() => {
    setSubProps({
      led_type: ledType,
      sub_type: subType,
    })
  }, [ledType, subType])

  return (
    <>
      <div className='form-group mt-3'>
        <label htmlFor='select-sub-type'>Sub Type</label>
        <select
          id='select-sub-type'
          className='form-select select-type'
          aria-label='Default select example'
          onChange={(e) => {
            setSubType(e.target.value)
          }}
        >
          <option value='bulb'>Bulb</option>
          <option value='ledStrip'>Led Strip</option>
        </select>
      </div>
      <div className='form-group mt-3'>
        <label htmlFor='select-led-type'>Led Type</label>
        <select
          id='select-led-type'
          className='form-select select-type'
          aria-label='Default select example'
          onChange={(e) => {
            if (e.target.value == 'none') {
              disable_add_btn(true)
            } else {
              disable_add_btn(false)
              setLedType(e.target.value)
            }
          }}
        >
          <option value='none'>None</option>
          <option value='simple'>White</option>
          <option value='rgb'>RGB</option>
          <option value='rgbc'>RGBW</option>
          <option value='rgbcw'>RGBCW</option>
        </select>
      </div>
    </>
  )
}

export default SubLed
