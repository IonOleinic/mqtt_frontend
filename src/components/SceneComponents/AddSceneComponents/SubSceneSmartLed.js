import { useEffect, useState } from 'react'
import { ColorPicker } from 'primereact/colorpicker'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'

function SubSceneSmartLed({
  device,
  setConditionalTopic,
  setConditionalPayload,
  setExecutableTopic,
  setExecutablePayload,
  setConditionalText,
  setExecutableText,
  eventOrAction,
}) {
  const [selectedPowerValue, setSelectedPowerValue] = useState('OFF')
  const [selectedColorValue, setSelectedColorValue] = useState('1976D2')
  const [selectedDimmerValue, setSelectedDimmerValue] = useState(50)

  const [chanelDropdownOptions, setChanelDropdownOptions] = useState(['Power'])
  const [selectedChanel, setSelectedChanel] = useState('Power')

  useEffect(() => {
    if (eventOrAction == 'action') {
      setChanelDropdownOptions(['Power', 'Dimmer'])
      if (device.attributes.led_type?.includes('rgb')) {
        setChanelDropdownOptions(['Power', 'Color', 'Dimmer'])
      }
    }
  }, [])
  const setDefaultPowerValues = () => {
    if (eventOrAction == 'event') {
      setConditionalTopic(device.attributes.receive_status_topic)
      if (device.manufacter == 'tasmota') {
        setConditionalPayload('OFF')
      } else if (device.manufacter == 'openBeken') {
        setConditionalPayload('0')
      }
      setConditionalText(`Power OFF`)
    } else if (eventOrAction == 'action') {
      setExecutableTopic(`cmnd/${device.mqtt_name}/POWER`)
      setExecutablePayload('OFF')
      setExecutableText(`Power OFF`)
    }
  }
  useEffect(() => {
    setDefaultPowerValues()
  }, [])

  return (
    <div className='form-input-group-inline'>
      <div
        className='form-input-group'
        style={{
          width: '45%',
        }}
      >
        <label htmlFor='sub-scene-led-chanel-dropdown'>Chanel</label>
        <Dropdown
          id='sub-scene-led-chanel-dropdown'
          placeholder='Select a channel'
          options={chanelDropdownOptions}
          value={selectedChanel}
          onChange={(e) => {
            setSelectedChanel(e.target.value)
            switch (e.target.value) {
              case 'Power':
                setDefaultPowerValues()
                break
              case 'Color':
                setExecutableTopic(`cmnd/${device.mqtt_name}/Color`)
                setExecutablePayload(selectedColorValue)
                setExecutableText(`Color ${selectedColorValue}`)
                break
              case 'Dimmer':
                setExecutableTopic(`cmnd/${device.mqtt_name}/Dimmer`)
                setExecutablePayload(50)
                setExecutableText(`Dimmer 50`)
                break

              default:
                break
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
        <label htmlFor='sub-scene-led-value-dropdown' style={{ width: '100%' }}>
          Value
        </label>
        {selectedChanel == 'Power' ? (
          <Dropdown
            id='sub-scene-led-pwr-dropdown'
            placeholder='Select a state'
            value={selectedPowerValue}
            options={['OFF', 'ON']}
            onChange={(e) => {
              console.log(e.value)
              setSelectedPowerValue(e.value)
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
                setConditionalText(`Power ${e.target.value}`)
              } else if (eventOrAction == 'action') {
                setExecutablePayload(e.target.value)
                setExecutableText(`Power ${e.target.value}`)
              }
            }}
          />
        ) : selectedChanel == 'Color' ? (
          <ColorPicker
            value={selectedColorValue}
            onChange={(e) => {
              setSelectedColorValue(e.target.value)
              if (eventOrAction == 'event') {
                // setConditionalTopic(device.receive_status_topic)
                // setConditionalText(`Color ${payload}`)
              } else if (eventOrAction == 'action') {
                setExecutableTopic(`cmnd/${device.mqtt_name}/Color`)
                setExecutablePayload(e.target.value)
                setExecutableText('Color ' + e.target.value)
              }
            }}
          />
        ) : (
          <InputNumber
            id='sub-scene-led-dimmer-input'
            min={0}
            max={100}
            defaultValue={50}
            placeholder='Dimmer value'
            value={selectedDimmerValue}
            onValueChange={(e) => {
              setSelectedDimmerValue(e.target.value)
              if (eventOrAction == 'event') {
                // setConditionalTopic(device.receive_dimmer_topic)
                // setConditionalText(`Color ${payload}`)
              } else if (eventOrAction == 'action') {
                setExecutableTopic(`cmnd/${device.mqtt_name}/Dimmer`)
                setExecutablePayload(e.target.value)
                setExecutableText(`Dimmer ${e.target.value}`)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

export default SubSceneSmartLed
