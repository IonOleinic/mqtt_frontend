import React from 'react'
import { useState } from 'react'
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
      setConditionalTopic(device.receive_topic)
      if (device.manufacter == 'tasmota') {
        //TODO
      } else if (device.manufacter == 'openBeken') {
        let payload = `IR_${device.IR_protocol} ${device.bits} ${device.buttons.btn_power.code} 1`
        setConditionalPayload(payload)
      }
      setConditionalText(`Button ${device.buttons.btn_power.fullName}`)
    } else if (event_or_action == 'action') {
      setExecutableTopic(device.cmnd_topic)
      let payload = `${device.IR_protocol} ${device.bits} ${device.buttons.btn_power.code} ${device.repeats}`
      setExecutablePayload(payload)
      setExecutableText(`Button ${device.buttons.btn_power.fullName}`)
    }
  }, [])
  return (
    <div className='form-group mt-3'>
      <label htmlFor='select-event-ir-state'>IR Button</label>
      <select
        id='select-event-ir-state'
        className='form-select select-type'
        aria-label='Default select example'
        onChange={(e) => {
          let button = JSON.parse(e.target.value)
          if (event_or_action == 'event') {
            let payload = `IR_${device.IR_protocol} ${device.bits} ${button.code} 1`
            setConditionalPayload(payload)
            setConditionalText(`Button ${button.fullName}`)
          } else if (event_or_action == 'action') {
            let payload = `${device.IR_protocol} ${device.bits} ${button.code} ${device.repeats}`
            setExecutablePayload(payload)
            setExecutableText(`Button ${button.fullName}`)
          }
        }}
      >
        {Object.keys(device.buttons).map((button, index) => {
          return (
            <option key={index} value={JSON.stringify(device.buttons[button])}>
              {device.buttons[button].fullName}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default SubSceneSirenAlarm
