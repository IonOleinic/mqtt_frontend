import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
function SubSceneSirenAlarm({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setExecutableTopic,
  setExecutablePayload,
  setConditionalText,
  setExecutableText,
  eventOrAction,
}) {
  const [state, setState] = useState('OFF')
  useEffect(() => {
    if (eventOrAction == 'event') {
      setConditionalTopic(device.attributes.receive_status_topic)
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('OFF')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('0')
      }
      setConditionalText(`Sound OFF`)
    } else if (eventOrAction == 'action') {
      setExecutableTopic(device.attributes.cmnd_status_topic)
      setExecutablePayload('OFF')
      setExecutableText(`Sound OFF`)
    }
  }, [])
  return (
    <div className='form-input-group'>
      <label htmlFor='sub-scene-siren-state-dropdown'>Siren State</label>
      <Dropdown
        id='sub-scene-siren-state-dropdown'
        value={state}
        options={['OFF', 'ON']}
        onChange={(e) => {
          setState(e.target.value)
          if (eventOrAction == 'event') {
            setConditionalText(`Sound ${e.target.value}`)
            if (e.target.value == 'OFF') {
              if (device.manufacter == 'tasmota') {
                setConditionalPayload('OFF')
              } else if (device.manufacter == 'openBeken') {
                setConditionalPayload('0')
              }
            } else {
              if (device.manufacter == 'tasmota') {
                setConditionalPayload('ON')
              } else if (device.manufacter == 'openBeken') {
                setConditionalPayload('1')
              }
            }
          } else if (eventOrAction == 'action') {
            setExecutableText(`Sound ${e.target.value}`)
            setExecutablePayload(e.target.value)
          }
        }}
      />
    </div>
  )
}

export default SubSceneSirenAlarm
