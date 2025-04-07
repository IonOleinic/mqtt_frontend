import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'

function SubSceneMotionSensor({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setConditionalText,
}) {
  const [state, setState] = useState('Motion Start')
  useEffect(() => {
    setConditionalTopic(device.attributes.receive_status_topic)
    setConditionalText(state)
    if (state == 'Motion Start') {
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('ON')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('1')
      }
    } else if (state == 'Motion End') {
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('OFF')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('0')
      }
    }
  }, [state])
  return (
    <div className='form-input-group'>
      <label htmlFor='sub-motion-state-dropdown'>Motion State</label>
      <Dropdown
        id='sub-motion-state-dropdown'
        value={state}
        options={['Motion Start', 'Motion End']}
        onChange={(e) => {
          setState(e.target.value)
        }}
      />
    </div>
  )
}

export default SubSceneMotionSensor
