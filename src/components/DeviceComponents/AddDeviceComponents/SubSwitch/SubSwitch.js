import { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import './SubSwitch.css'

function SubSwitch({ sub_type, setAttributes }) {
  const [nrOfSockets, setNrOfSockets] = useState(1)
  const [powerMonitor, setPowerMonitor] = useState(undefined)

  useEffect(() => {
    setAttributes({
      nr_of_sockets: nrOfSockets,
      power_monitor: powerMonitor,
    })
  }, [powerMonitor, nrOfSockets])

  useEffect(() => {
    if (sub_type === 'plug') {
      setPowerMonitor(true)
    } else if (sub_type !== 'plug') {
      setPowerMonitor(undefined)
    } else {
      setPowerMonitor(false)
    }
  }, [sub_type])
  return (
    <div className='sub-switch'>
      <div className='form-input-group'>
        <label htmlFor='sub-switch-nr-sockets-dropdown'>Nr. of Sockets</label>
        <Dropdown
          id='sub-switch-nr-sockets-dropdown'
          value={nrOfSockets}
          options={[1, 2, 3, 4, 5, 6]}
          placeholder='Enter number of sockets'
          onChange={(e) => {
            setNrOfSockets(e.value)
          }}
        />
      </div>
      <div
        className={sub_type === 'plug' ? 'form-input-group-inline' : 'hidden'}
      >
        <label htmlFor='sub-switch-pwr-mon-checkbox'>With Power Monitor</label>
        <Checkbox
          id='sub-switch-pwr-mon-checkbox'
          checked={powerMonitor}
          disabled={sub_type !== 'plug'}
          onChange={(e) => {
            setPowerMonitor(e.checked)
          }}
        />
      </div>
    </div>
  )
}

export default SubSwitch
