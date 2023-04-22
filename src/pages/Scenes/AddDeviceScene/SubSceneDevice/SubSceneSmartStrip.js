import React from 'react'
import { useEffect, useState } from 'react'

function SubSceneSmartStrip({
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
  const [state, setState] = useState('OFF')
  useEffect(() => {
    if (event_or_action == 'event') {
      setConditionalTopic(device.stat_power_topics[0])
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('OFF')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('0')
      }
      if (device.cmnd_power_topics.length == 1) {
        setConditionalText(`Power OFF`)
      } else {
        setConditionalText(`Power 1 OFF`)
      }
    } else if (event_or_action == 'action') {
      setExecutableTopic(device.cmnd_power_topics[0])
      setExecutablePayload('OFF')
      if (device.cmnd_power_topics.length == 1) {
        setExecutableText(`Power OFF`)
      } else {
        setExecutableText(`Power 1 OFF`)
      }
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
              if (device.cmnd_power_topics.length == 1) {
                setSelectedSocket('')
              } else {
                setSelectedSocket(` ${Number(e.target.value) + 1} `)
                setConditionalText(
                  `Power ${Number(e.target.value) + 1} ${state}`
                )
              }
            } else if (event_or_action == 'action') {
              setExecutableTopic(device.cmnd_power_topics[e.target.value])
              if (device.cmnd_power_topics.length == 1) {
                setSelectedSocket('')
              } else {
                setSelectedSocket(` ${Number(e.target.value) + 1} `)
                setExecutableText(
                  `Power ${Number(e.target.value) + 1} ${state}`
                )
              }
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
            setState(e.target.value)
            if (event_or_action == 'event') {
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
              setConditionalText(`Power${selectedSocket} ${e.target.value}`)
            } else if (event_or_action == 'action') {
              setExecutablePayload(e.target.value)
              setExecutableText(`Power${selectedSocket} ${e.target.value}`)
              if (e.target.value == 'TOGGLE') {
                setExecutableText(`${e.target.value}${selectedSocket}`)
              } else {
                setExecutableText(`Power${selectedSocket} ${e.target.value}`)
              }
            }
          }}
        >
          <option value='OFF'>OFF</option>
          <option value='ON'>ON</option>
          <option
            value='TOGGLE'
            style={{ display: event_or_action == 'action' ? 'revert' : 'none' }}
          >
            TOGGLE
          </option>
        </select>
      </div>
    </div>
  )
}

export default SubSceneSmartStrip
