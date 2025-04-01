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
    } else if (event_or_action == 'action') {
      setExecutableTopic(device.attributes.cmnd_topic)
      const payload = `${device.attributes.preset?.protocol} ${device.attributes.preset?.bits} ${device.attributes.preset?.buttons?.btn_ok?.code} ${device.attributes.preset?.repeats}`
      setExecutablePayload(payload)
      setExecutableText(
        `Button ${device.attributes.preset?.buttons?.btn_ok?.fullName}`
      )
    }
  }, [])
  return (
    <div className='form-group mt-3'>
      <label htmlFor='select-event-ir-state'>IR Button</label>
      <select
        id='select-event-ir-state'
        className='form-select select-type'
        aria-label='Default select example'
        placeholder='Select IR Button'
        onChange={(e) => {
          const button = JSON.parse(e.target.value) || {}
          if (event_or_action == 'event') {
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
          } else if (event_or_action == 'action') {
            const payload = `${device.attributes.preset?.protocol} ${device.attributes.preset?.bits} ${button.code} ${device.attributes.preset?.repeats}`
            setExecutablePayload(payload)
            setExecutableText(`Button ${button.fullName}`)
          }
        }}
      >
        {Object.keys(device.attributes.preset?.buttons).map((button, index) => {
          return (
            <option
              key={index}
              value={JSON.stringify(device.attributes.preset?.buttons[button])}
            >
              {device.attributes.preset?.buttons[button].fullName}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default SubSceneSirenAlarm
