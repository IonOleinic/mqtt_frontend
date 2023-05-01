import React from 'react'
import './SubBulb.css'
function SubBulb({ setSubProps, disable_add_btn }) {
  return (
    <>
      <div className='form-group mt-3'>
        <label htmlFor='select-bulb-type'>Bulb Type</label>
        <select
          id='select-bulb-type'
          className='form-select select-type'
          aria-label='Default select example'
          onChange={(e) => {
            if (e.target.value == 'none') {
              disable_add_btn(true)
            } else {
              disable_add_btn(false)
              setSubProps({ bulb_type: e.target.value })
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

export default SubBulb
