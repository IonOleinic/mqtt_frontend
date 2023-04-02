import React from 'react'
import { useEffect } from 'react'

function SubEventDoorSensor({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setConditionalText,
}) {
  useEffect(() => {
    setConditionalTopic(device.receive_status_topic)
    setConditionalPayload('OFF')
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
          setConditionalPayload(e.target.value)
          if (e.target.value == 'ON') {
            setConditionalText(`Opened`)
          } else if (e.target.value == 'OFF') {
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

export default SubEventDoorSensor
