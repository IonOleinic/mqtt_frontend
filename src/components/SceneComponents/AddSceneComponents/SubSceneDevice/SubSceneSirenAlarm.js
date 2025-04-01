import { useEffect } from 'react'

function SubSceneSirenAlarm({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setExecutableTopic,
  setExecutablePayload,
  setConditionalText,
  setExecutableText,
  event_or_action,
}) {
  useEffect(() => {
    if (event_or_action == 'event') {
      setConditionalTopic(device.attributes.receive_status_topic)
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('OFF')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('0')
      }
      setConditionalText(`Sound OFF`)
    } else if (event_or_action == 'action') {
      setExecutableTopic(device.attributes.cmnd_status_topic)
      setExecutablePayload('OFF')
      setExecutableText(`Sound OFF`)
    }
  }, [])
  return (
    <div className='form-group mt-3'>
      <label htmlFor='select-event-state'>Siren State</label>
      <select
        id='select-event-state'
        className='form-select select-type'
        aria-label='Default select example'
        onChange={(e) => {
          if (event_or_action == 'event') {
            if (e.target.value == 'OFF') {
              setConditionalText(`Sound OFF`)
              if (device.manufacter == 'tasmota') {
                setConditionalPayload('OFF')
              } else if (device.manufacter == 'openBeken') {
                setConditionalPayload('0')
              }
            } else {
              setConditionalText(`Sound ON`)
              if (device.manufacter == 'tasmota') {
                setConditionalPayload('ON')
              } else if (device.manufacter == 'openBeken') {
                setConditionalPayload('1')
              }
            }
          } else if (event_or_action == 'action') {
            setExecutablePayload(e.target.value)
            if (e.target.value == 'TOGGLE') {
              setExecutableText(`${e.target.value}`)
            } else {
              setExecutableText(`Sound ${e.target.value}`)
            }
          }
        }}
      >
        <option value='OFF'>Sound OFF</option>
        <option value='ON'>Sound ON</option>
        <option
          value='TOGGLE'
          style={{ display: event_or_action == 'action' ? 'revert' : 'none' }}
        >
          Sound TOGGLE
        </option>
      </select>
    </div>
  )
}

export default SubSceneSirenAlarm
