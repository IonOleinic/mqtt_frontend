import { useState, useEffect } from 'react'
import './SubSwitch.css'

function SubSwitch({ setSubProps, disable_add_btn }) {
  const [nrOfSockets, setNrOfSockets] = useState(1)
  const [switchType, setSwitchType] = useState('plug')
  useEffect(() => {
    disable_add_btn(false)
  }, [])

  useEffect(() => {
    setSubProps({
      switch_type: switchType,
      nr_of_sockets: nrOfSockets,
    })
  }, [switchType, nrOfSockets])
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
            setNrOfSockets(1)
            disable_add_btn(false)
          }}
        >
          <option value='plug'>{'Plug (Power Monitor)'}</option>
          <option value='switch'>{'Switch (No Power Monitor)'}</option>
          <option value='wall_switch'>Wall Switch</option>
          <option value='valve'>Valve Switch</option>
        </select>
      </div>
      <div className='form-group mt-3'>
        <label htmlFor='input nr-sockets'>Nr. of Sockets</label>
        <input
          id='input nr-sockets'
          pattern='[0-9]{1,5}'
          maxLength={1}
          type='number'
          value={nrOfSockets}
          className='form-control mt-1'
          placeholder='Enter number of sockets'
          onChange={(e) => {
            setNrOfSockets(e.target.value)
            if (Number(e.target.value) > 0 && e.target.value <= 6) {
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
