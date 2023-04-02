import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

function SubEventSirenAlarm({
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
      setConditionalTopic(device.receive_status_topic)
      setConditionalPayload('OFF')
      setConditionalText(`Sound OFF`)
    } else if (event_or_action == 'action') {
      setExecutableTopic(device.cmnd_status_topic)
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
            setConditionalPayload(e.target.value)
            setConditionalText(`Sound ${e.target.value}`)
          } else if (event_or_action == 'action') {
            setExecutablePayload(e.target.value)
            setExecutableText(`Sound ${e.target.value}`)
          }
        }}
      >
        <option value='OFF'>Sound OFF</option>
        <option value='ON'>Sound ON</option>
      </select>
    </div>
  )
}

export default SubEventSirenAlarm
