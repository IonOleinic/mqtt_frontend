import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
function SubSceneSmartStrip({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setExecutableTopic,
  setExecutablePayload,
  setConditionalText,
  setExecutableText,
  eventOrAction,
}) {
  const [selectedSocket, setSelectedSocket] = useState(1)
  const [state, setState] = useState('OFF')

  useEffect(() => {
    if (eventOrAction == 'event') {
      setConditionalTopic(device.attributes.stat_power_topics[0])
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('OFF')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('0')
      }
      if (device.attributes.nr_of_sockets == 1) {
        setConditionalText(`Power OFF`)
      } else {
        setConditionalText(`Power 1 OFF`)
      }
    } else if (eventOrAction == 'action') {
      setExecutableTopic(device.attributes.cmnd_power_topics[0])
      setExecutablePayload('OFF')
      if (device.attributes.nr_of_sockets == 1) {
        setExecutableText(`Power OFF`)
      } else {
        setExecutableText(`Power 1 OFF`)
      }
    }
  }, [])
  return (
    <div className='form-input-group-inline'>
      <div
        className='form-input-group'
        style={{
          width: '45%',
        }}
      >
        <label htmlFor='sub-scene-strip-socket-dropdown'>Socket</label>
        <Dropdown
          id='sub-scene-strip-socket-dropdown'
          value={selectedSocket}
          options={device.attributes.cmnd_power_topics.map((_, index) => {
            return index + 1
          })}
          onChange={(e) => {
            setSelectedSocket(e.target.value)
            if (eventOrAction == 'event') {
              setConditionalTopic(
                device.attributes.stat_power_topics[e.target.value]
              )
              setConditionalText(`Power ${e.target.value} ${state}`)
            } else if (eventOrAction == 'action') {
              setExecutableTopic(
                device.attributes.cmnd_power_topics[e.target.value]
              )
              setExecutableText(`Power ${e.target.value} ${state}`)
            }
          }}
        />
      </div>
      <div
        className='form-input-group'
        style={{
          width: '45%',
        }}
      >
        <label htmlFor='sub-scene-strip-state-dropdown'>Power State</label>
        <Dropdown
          id='sub-scene-strip-state-dropdown'
          value={state}
          options={['OFF', 'ON']}
          onChange={(e) => {
            setState(e.target.value)
            if (eventOrAction == 'event') {
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
            } else if (eventOrAction == 'action') {
              setExecutablePayload(e.target.value)
              setExecutableText(`Power${selectedSocket} ${e.target.value}`)
            }
          }}
        />
      </div>
    </div>
  )
}

export default SubSceneSmartStrip
