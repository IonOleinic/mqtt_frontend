import React from 'react'
import './SubSwitch.css'
function SubSwitch({ setSubProps, disable_add_btn }) {
  return (
    <>
      <div className='form-group mt-3'>
        <label htmlFor='input nr-sockets'>Nr. of Sockets</label>
        <input
          id='input nr-sockets'
          pattern='[0-9]{1,5}'
          maxLength={1}
          type='number'
          className='form-control mt-1'
          placeholder='Enter number of sockets'
          onChange={(e) => {
            setSubProps({ nr_of_sockets: e.target.value })
            if (Number(e.target.value) > 0 && e.target.value < 10) {
              disable_add_btn(false)
            } else {
              disable_add_btn(true)
            }
          }}
        />
      </div>
    </>
  )
}

export default SubSwitch
