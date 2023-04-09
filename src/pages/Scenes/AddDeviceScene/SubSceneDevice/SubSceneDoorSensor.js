import React from 'react'
import { useEffect } from 'react'

function SubSceneDoorSensor({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setConditionalText,
}) {
  useEffect(() => {
    setConditionalTopic(device.receive_status_topic)
    if (device.manufacter == 'tasmota') {
      setConditionalPayload('OFF')
    } else if (device.manufacter == 'openBeken') {
      setConditionalPayload('0')
    }
    setConditionalText(`Closed`)
  }, [])
  return (
    <div className='form-group mt-3'>
      <label htmlFor='select-event-state'>Door State</label>
      <select
        // value={eventDeviceState}
        id='select-event-state'
        className='form-select select-type'
        aria-label='Default select example'
        onChange={(e) => {
          if (e.target.value == 'ON') {
            if (device.manufacter == 'tasmota') {
              setConditionalPayload('ON')
            } else if (device.manufacter == 'openBeken') {
              setConditionalPayload('1')
            }
            setConditionalText(`Opened`)
          } else {
            if (device.manufacter == 'tasmota') {
              setConditionalPayload('OFF')
            } else if (device.manufacter == 'openBeken') {
              setConditionalPayload('0')
            }
            setConditionalText(`Closed`)
          }
        }}
      >
        <option value='OFF'>Closed</option>
        <option value='ON'>Opened</option>
      </select>
    </div>
  )
}

export default SubSceneDoorSensor
