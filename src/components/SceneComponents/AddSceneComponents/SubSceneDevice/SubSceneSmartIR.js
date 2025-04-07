import { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
function SubSceneSirenAlarm({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setExecutableTopic,
  setExecutablePayload,
  setConditionalText,
  setExecutableText,
  eventOrAction,
}) {
  const [selectedButton, setSelectedButton] = useState(
    device.attributes.preset?.buttons.btn_ok
  )
  useEffect(() => {
    if (eventOrAction == 'event') {
      setConditionalTopic(device.attributes.receive_topic)
      if (device.manufacter == 'tasmota') {
        const payload = {
          Protocol: device.attributes.preset?.protocol,
          Bits: device.attributes.preset?.bits,
          Data: device.attributes.preset?.buttons.btn_ok?.code,
        }
        setConditionalPayload(JSON.stringify(payload))
      } else if (device.manufacter == 'openBeken') {
        const payload = `IR_${device.attributes.preset?.protocol} ${device.attributes.preset?.bits} ${device.attributes.preset?.buttons?.btn_ok?.code} 1`
        setConditionalPayload(payload)
      }
      setConditionalText(
        `Button ${device.attributes.preset?.buttons?.btn_ok?.fullName}`
      )
    } else if (eventOrAction == 'action') {
      setExecutableTopic(device.attributes.cmnd_topic)
      const payload = `${device.attributes.preset?.protocol} ${device.attributes.preset?.bits} ${device.attributes.preset?.buttons?.btn_ok?.code} ${device.attributes.preset?.repeats}`
      setExecutablePayload(payload)
      setExecutableText(
        `Button ${device.attributes.preset?.buttons?.btn_ok?.fullName}`
      )
    }
  }, [])
  return (
    <div className='form-input-group'>
      <label htmlFor='sub-scene-ir-button-dropdown'>IR Button</label>
      <Dropdown
        id='sub-scene-ir-button-dropdown'
        placeholder='Select IR Button'
        value={selectedButton}
        options={Object.keys(device.attributes.preset?.buttons).map(
          (key) => device.attributes.preset?.buttons[key]
        )}
        optionLabel='fullName'
        onChange={(e) => {
          setSelectedButton(e.value)
          const button = e.value || {}
          if (eventOrAction == 'event') {
            if (device.manufacter == 'tasmota') {
              const payload = {
                Protocol: device.attributes.preset?.protocol,
                Bits: device.attributes.preset?.bits,
                Data: button?.code,
              }
              setConditionalPayload(JSON.stringify(payload))
            } else if (device.manufacter == 'openBeken') {
              const payload = `IR_${device.attributes.preset?.protocol} ${device.attributes.preset?.bits} ${button.code} 1`
              setConditionalPayload(payload)
            }
            setConditionalText(`Button ${button.fullName}`)
          } else if (eventOrAction == 'action') {
            const payload = `${device.attributes.preset?.protocol} ${device.attributes.preset?.bits} ${button.code} ${device.attributes.preset?.repeats}`
            setExecutablePayload(payload)
            setExecutableText(`Button ${button.fullName}`)
          }
        }}
      />
    </div>
  )
}

export default SubSceneSirenAlarm
