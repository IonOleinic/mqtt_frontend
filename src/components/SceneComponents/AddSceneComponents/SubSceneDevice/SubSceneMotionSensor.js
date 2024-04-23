import { useEffect } from 'react'

function SubSceneMotionSensor({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setConditionalText,
}) {
  useEffect(() => {
    setConditionalTopic(device.receive_status_topic)
    if (device.manufacter == 'tasmota') {
      setConditionalPayload('ON')
    } else if (device.manufacter == 'openBeken') {
      setConditionalPayload('1')
    }
    setConditionalText(`Motion`)
  }, [])
  return (
    <div className='form-group mt-3'>
      <label htmlFor='select-event-state'>Motion State</label>
      <select
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
            setConditionalText(`Motion`)
          } else {
            if (device.manufacter == 'tasmota') {
              setConditionalPayload('OFF')
            } else if (device.manufacter == 'openBeken') {
              setConditionalPayload('0')
            }
            setConditionalText(`No Motion`)
          }
        }}
      >
        <option value='ON'>Motion</option>
        <option value='OFF'>No Motion</option>
      </select>
    </div>
  )
}

export default SubSceneMotionSensor
