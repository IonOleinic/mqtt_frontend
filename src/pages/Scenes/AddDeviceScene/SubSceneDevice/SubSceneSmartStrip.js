import React from 'react'
import { useEffect, useState } from 'react'

function SubEventSmartStrip({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setExecutableTopic,
  setExecutablePayload,
  setConditionalText,
  setExecutableText,
  event_or_action,
}) {
  const [selectedSocket, setSelectedSocket] = useState('')
  useEffect(() => {
    if (event_or_action == 'event') {
      setConditionalTopic(device.stat_power_topics[0])
      setConditionalPayload('OFF')
      setConditionalText(`Power${selectedSocket} OFF`)
    } else if (event_or_action == 'action') {
      setExecutableTopic(device.cmnd_power_topics[0])
      setExecutablePayload('OFF')
      setExecutableText(`Power${selectedSocket} OFF`)
    }
  }, [])
  return (
    <div
      className='sub-event-smart-strip'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <div
        className='form-group mt-3'
        style={{
          width: '45%',
        }}
      >
        <label htmlFor='select-socket'>Socket</label>
        <select
          id='select-socket'
          className='form-select select-type'
          aria-label='Default select example'
          onChange={(e) => {
            if (event_or_action == 'event') {
              setConditionalTopic(device.stat_power_topics[e.target.value])
            } else if (event_or_action == 'action') {
              setExecutableTopic(device.cmnd_power_topics[e.target.value])
            }
            if (e.target.value == 0) {
              setSelectedSocket('')
            } else {
              setSelectedSocket(` ${e.target.value}`)
            }
          }}
        >
          {device.stat_power_topics.map((topic, index) => {
            return (
              <option key={topic} value={index}>
                {index + 1}
              </option>
            )
          })}
        </select>
      </div>
      <div
        className='form-group mt-3'
        style={{
          width: '45%',
        }}
      >
        <label htmlFor='select-event-state'>Power State</label>
        <select
          id='select-event-state'
          className='form-select select-type'
          aria-label='Default select example'
          onChange={(e) => {
            if (event_or_action == 'event') {
              setConditionalPayload(e.target.value)
              setConditionalText(`Power${selectedSocket} ${e.target.value}`)
            } else if (event_or_action == 'action') {
              setExecutablePayload(e.target.value)
              setExecutableText(`Power${selectedSocket} ${e.target.value}`)
            }
          }}
        >
          <option value='OFF'>OFF</option>
          <option value='ON'>ON</option>
        </select>
      </div>
    </div>
  )
}

export default SubEventSmartStrip
