import React, { useState } from 'react'
import './SubSwitch.css'
function SubSwitch({ setSubProps, disable_add_btn }) {
  const [nrOfSockets, setNrOfSockets] = useState(1)
  const [switchType, setSwitchType] = useState('plug')
  return (
    <>
      <div className='form-group mt-3'>
        <label htmlFor='select-switch-type'>Switch Type</label>
        <select
          id='select-switch-type'
          className='form-select select-type'
          aria-label='Default select example'
          onChange={(e) => {
            setSwitchType(e.target.value)
            setSubProps({
              switch_type: e.target.value,
              nr_of_sockets: nrOfSockets,
            })
          }}
        >
          <option value='plug'>{'Plug (Power Monitor)'}</option>
          <option value='switch'>{'Switch (No Power Monitor)'}</option>
          <option value='wall_switch'>Wall Switch</option>
        </select>
      </div>
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
            setNrOfSockets(e.target.value)
            setSubProps({
              switch_type: switchType,
              nr_of_sockets: e.target.value,
            })
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
