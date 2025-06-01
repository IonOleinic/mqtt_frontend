import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'

function SubSceneDoorSensor({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setConditionalText,
}) {
  const [state, setState] = useState('Closed')
  useEffect(() => {
    setConditionalTopic(device.attributes.receive_status_topic)
    setConditionalText(state)
    if (state == 'Opened') {
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('ON')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('1')
      }
    } else if (state == 'Closed') {
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('OFF')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('0')
      }
    }
  }, [state])
  return (
    <div className='form-input-group'>
      <label htmlFor='sub-door-state-dropdown'>Door State</label>
      <Dropdown
        id='sub-door-state-dropdown'
        value={state}
        options={['Closed', 'Opened']}
        placeholder='Select Door State'
        onChange={(e) => {
          setState(e.target.value)
        }}
      />
    </div>
  )
}

export default SubSceneDoorSensor
