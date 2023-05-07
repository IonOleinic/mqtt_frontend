import React from 'react'
import { useEffect, useState } from 'react'
import InputColor from 'react-input-color'

function SubSceneSmartBulb({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setExecutableTopic,
  setExecutablePayload,
  setConditionalText,
  setExecutableText,
  event_or_action,
}) {
  let powerValueType = (
    <select
      id='select-event-state'
      className='form-select select-type'
      aria-label='Default select example'
      onChange={(e) => {
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
          setConditionalText(`Power ${e.target.value}`)
        } else if (event_or_action == 'action') {
          setExecutablePayload(e.target.value)
          setExecutableText(`Power ${e.target.value}`)
          if (e.target.value == 'TOGGLE') {
            setExecutableText(`TOGGLE`)
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
  )
  let colorValueType = (
    <InputColor
      initialValue='#5e72e4'
      placement='right'
      onChange={(e) => {
        if (event_or_action == 'event') {
          // setConditionalTopic(device.receive_status_topic)
          // setConditionalText(`Color ${payload}`)
        } else if (event_or_action == 'action') {
          setExecutableTopic(`cmnd/${device.mqtt_name}/Color`)
          setExecutablePayload(e.hex.replace('#', '').substring(0, 6))
          let color = e.hex.replace('#', '').substring(0, 6)
          setExecutableText('Color ' + color.toString())
        }
      }}
    />
  )
  let dimmerValueType = (
    <input
      id='input-name'
      type='number'
      min={0}
      max={100}
      defaultValue={50}
      className='form-control mt-1'
      placeholder='Dimmer value'
      onChange={(e) => {
        if (event_or_action == 'event') {
          // setConditionalTopic(device.receive_dimmer_topic)
          // setConditionalText(`Color ${payload}`)
        } else if (event_or_action == 'action') {
          setExecutableTopic(`cmnd/${device.mqtt_name}/Dimmer`)
          setExecutablePayload(Number(e.target.value))
          setExecutableText(`Dimmer ${e.target.value}`)
        }
      }}
    />
  )
  const [valueType, setValueType] = useState(powerValueType)

  useEffect(() => {
    set_default_power_values()
  }, [])
  const set_default_power_values = () => {
    if (event_or_action == 'event') {
      setConditionalTopic(device.receive_status_topic)
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('OFF')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('0')
      }
      setConditionalText(`Power OFF`)
    } else if (event_or_action == 'action') {
      setExecutableTopic(`cmnd/${device.mqtt_name}/POWER`)
      setExecutablePayload('OFF')
      setExecutableText(`Power OFF`)
    }
  }
  return (
    <div
      className='sub-event-smart-bulb'
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
        <label htmlFor='select-chanel'>Chanel</label>
        <select
          id='select-chanel'
          className='form-select select-type'
          aria-label='Default select example'
          onChange={(e) => {
            switch (e.target.value) {
              case 'Power':
                setValueType(powerValueType)
                set_default_power_values()
                break
              case 'Color':
                setValueType(colorValueType)
                break
              case 'Dimmer':
                setValueType(dimmerValueType)
                setExecutableTopic(`cmnd/${device.mqtt_name}/Dimmer`)
                setExecutablePayload(50)
                setExecutableText(`Dimmer 50`)
                break

              default:
                setValueType(<></>)
                break
            }
          }}
        >
          <option value='Power'>Power</option>
          <option
            value='Color'
            style={{
              display:
                event_or_action == 'action' && device.bulb_type.includes('rgb')
                  ? 'revert'
                  : 'none',
            }}
          >
            Color
          </option>
          <option
            value='Dimmer'
            style={{
              display: event_or_action == 'action' ? 'revert' : 'none',
            }}
          >
            Dimmer
          </option>
        </select>
      </div>
      <div
        className='form-group mt-3'
        style={{
          width: '45%',
        }}
      >
        <label htmlFor='select-event-state' style={{ width: '100%' }}>
          Value
        </label>
        {valueType}
      </div>
    </div>
  )
}

export default SubSceneSmartBulb
