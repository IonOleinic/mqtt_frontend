import { useState, useEffect } from 'react'
//device icons
import SmartIrIcon from '../components/DeviceComponents/DeviceTypeImages/SmartIRIcon'
import SmartDoorIcon from '../components/DeviceComponents/DeviceTypeImages/SmartDoorSensorIcon'
import SmartBulbIcon from '../components/DeviceComponents/DeviceTypeImages/SmartBulbIcon'
import SmartRGBControllerIcon from '../components/DeviceComponents/DeviceTypeImages/SmartRGBControllerIcon'
import SmartMotionIcon from '../components/DeviceComponents/DeviceTypeImages/SmartMotionSensorIcon'
import SmartVibrationIcon from '../components/DeviceComponents/DeviceTypeImages/SmartVibrationSensorIcon'
import SmartStripIcon from '../components/DeviceComponents/DeviceTypeImages/SmartStripIcon'
import SmartPlugIcon from '../components/DeviceComponents/DeviceTypeImages/SmartPlugIcon'
import SmartSwitchIcon from '../components/DeviceComponents/DeviceTypeImages/SmartSwitchIcon'
import SmartWallSwitchIcon from '../components/DeviceComponents/DeviceTypeImages/SmartWallSwitchIcon'
import SmartTempSensorIcon from '../components/DeviceComponents/DeviceTypeImages/SmartThermometerIcon'
import SmartSirenAlarmIcon from '../components/DeviceComponents/DeviceTypeImages/SmartSirenAlarmIcon'
import SmartValveIcon from '../components/DeviceComponents/DeviceTypeImages/SmartValveIcon'
import ZbHubIcon from '../components/DeviceComponents/DeviceTypeImages/ZbHubIcon'

function useDeviceTypes(group) {
  const [subTypeGroups, setSubTypeGroups] = useState([])

  const typeGroups = [
    {
      label: 'Switch & Relay',
      type: 'smartStrip',
      icon: (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <SmartSwitchIcon />
          <span
            style={{
              width: 1,
              height: 30,
              backgroundColor: 'black',
              transform: 'rotate(20deg)',
            }}
          />
          <SmartValveIcon />
        </div>
      ),
    },
    {
      label: 'IR',
      type: 'smartIR',
      icon: <SmartIrIcon />,
    },
    {
      label: 'Door & Window',
      type: 'smartTempSensor',
      icon: <SmartDoorIcon />,
    },
    {
      label: 'Temp & Humidity',
      type: 'smartTempSensor',
      icon: <SmartTempSensorIcon />,
    },
    {
      label: 'Motion',
      type: 'smartMotionSensor',
      icon: (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SmartMotionIcon />
          <span
            style={{
              width: 1,
              height: 30,
              backgroundColor: 'black',
              transform: 'rotate(20deg)',
            }}
          />
          <SmartVibrationIcon />
        </div>
      ),
    },
    {
      label: 'Alarm',
      type: 'smartSirenAlarm',
      icon: <SmartSirenAlarmIcon />,
    },
    {
      label: 'Led',
      type: 'smartLed',
      icon: (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
          }}
        >
          <SmartBulbIcon />
          <span
            style={{
              width: 1,
              height: 30,
              backgroundColor: 'black',
              transform: 'rotate(20deg)',
            }}
          />
          <SmartRGBControllerIcon style={{ marginLeft: '3px' }} />
        </div>
      ),
    },
    {
      label: 'Hub',
      type: 'zbHub',
      icon: <ZbHubIcon />,
    },
  ]

  useEffect(() => {
    setSubTypeGroups(getSubTypeGroups(group))
  }, [group])

  const getSubTypeGroups = (group) => {
    switch (group?.label) {
      case 'Switch & Relay':
        return [
          {
            label: 'Wifi Switch',
            type: 'smartSwitch',
            sub_type: 'switch',
            icon: <SmartSwitchIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Wifi Wall Switch',
            type: 'smartSwitch',
            sub_type: 'wall_switch',
            icon: <SmartWallSwitchIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Wifi Plug',
            type: 'smartSwitch',
            sub_type: 'plug',
            icon: <SmartPlugIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Wifi Valve',
            type: 'smartSwitch',
            sub_type: 'valve',
            icon: <SmartValveIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Zigbee Switch',
            type: 'smartSwitch',
            sub_type: 'switch',
            icon: <SmartSwitchIcon />,
            connectionType: 'zigbee',
          },
          {
            label: 'Zb Wall Switch',
            type: 'smartSwitch',
            sub_type: 'wall_switch',
            icon: <SmartWallSwitchIcon />,
            connectionType: 'zigbee',
          },
          {
            label: 'Zigbee Plug',
            type: 'smartSwitch',
            sub_type: 'plug',
            icon: <SmartPlugIcon />,
            connectionType: 'zigbee',
          },
          {
            label: 'Zigbee Valve',
            type: 'smartSwitch',
            sub_type: 'valve',
            icon: <SmartValveIcon />,
            connectionType: 'zigbee',
          },
        ]
      case 'IR':
        return [
          {
            label: 'Wifi IR',
            type: 'smartIR',
            icon: <SmartIrIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Zigbee IR',
            type: 'smartIR',
            icon: <SmartIrIcon />,
            connectionType: 'zigbee',
            disabled: true,
          },
        ]
      case 'Door & Window':
        return [
          {
            label: 'Wifi Door Sensor',
            type: 'smartDoorSensor',
            icon: <SmartDoorIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Zb Door Sensor',
            type: 'smartDoorSensor',
            icon: <SmartDoorIcon />,
            connectionType: 'zigbee',
          },
        ]
      case 'Temp & Humidity':
        return [
          {
            label: 'Wifi Temp Sensor',
            type: 'smartTempSensor',
            icon: <SmartTempSensorIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Zb Temp Sensor',
            type: 'smartTempSensor',
            icon: <SmartTempSensorIcon />,
            connectionType: 'zigbee',
          },
        ]
      case 'Motion':
        return [
          {
            label: 'Wifi Pir Motion Sensor',
            type: 'smartMotionSensor',
            sub_type: 'pir',
            icon: <SmartMotionIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Wifi Vibration Sensor',
            type: 'smartMotionSensor',
            sub_type: 'vibration',
            icon: <SmartVibrationIcon />,
            connectionType: 'wifi',
            disabled: true,
          },
          {
            label: 'Zb Pir Motion Sensor',
            type: 'smartMotionSensor',
            sub_type: 'pir',
            icon: <SmartMotionIcon />,
            connectionType: 'zigbee',
          },
          {
            label: 'Zb Vibration Sensor',
            type: 'smartMotionSensor',
            sub_type: 'vibration',
            icon: <SmartVibrationIcon />,
            connectionType: 'zigbee',
          },
        ]
      case 'Alarm':
        return [
          {
            label: 'Wifi Siren Alarm',
            type: 'smartSirenAlarm',
            icon: <SmartSirenAlarmIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Zb Siren Alarm',
            type: 'smartSirenAlarm',
            icon: <SmartSirenAlarmIcon />,
            connectionType: 'zigbee',
            disabled: true,
          },
        ]
      case 'Led':
        return [
          {
            label: 'Wifi Bulb',
            type: 'smartLed',
            sub_type: 'bulb',
            icon: <SmartBulbIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Wifi Led Strip',
            type: 'smartLed',
            sub_type: 'ledStrip',
            icon: <SmartRGBControllerIcon />,
            connectionType: 'wifi',
          },
          {
            label: 'Zigbee Bulb',
            type: 'smartLed',
            sub_type: 'bulb',
            icon: <SmartBulbIcon />,
            connectionType: 'zigbee',
            disabled: true,
          },
          {
            label: 'Zigbee Led Strip',
            type: 'smartLed',
            sub_type: 'ledStrip',
            icon: <SmartRGBControllerIcon />,
            connectionType: 'zigbee',
            disabled: true,
          },
        ]
      case 'Hub':
        return [
          {
            label: 'Zigbee Hub',
            type: 'zbHub',
            icon: <ZbHubIcon />,
            connectionType: 'wifi',
          },
        ]
      default:
        return []
    }
  }

  const getSpecificDeviceIcon = (device, size = 30) => {
    switch (device.device_type) {
      case 'smartStrip':
        if (device.sub_type === 'plug') {
          return device.nr_of_sockets == 1 ? (
            <SmartPlugIcon size={size} />
          ) : (
            <SmartStripIcon size={size} />
          )
        } else if (device.sub_type === 'switch') {
          return <SmartSwitchIcon size={size} />
        } else if (device.sub_type === 'wall_switch') {
          return <SmartWallSwitchIcon size={size} />
        } else if (device.sub_type === 'valve') {
          return <SmartValveIcon size={size} />
        }
        break
      case 'smartIR':
        return <SmartIrIcon size={size} />
      case 'smartTempSensor':
        return <SmartTempSensorIcon size={size} />
      case 'smartDoorSensor':
        return <SmartDoorIcon size={size} />
      case 'smartSirenAlarm':
        return <SmartSirenAlarmIcon size={size} />
      case 'smartLed':
        return device.sub_type === 'bulb' ? (
          <SmartBulbIcon size={size} />
        ) : (
          <SmartRGBControllerIcon size={size} />
        )
      case 'smartMotionSensor':
        if (device.sub_type === 'pir') {
          return <SmartMotionIcon size={size} />
        } else if (device.sub_type === 'vibration') {
          return <SmartVibrationIcon size={size} />
        }
      case 'zbHub':
        return <ZbHubIcon size={size} />
      default:
        // Handle default case or set a default icon
        return <></>
    }
  }

  return {
    typeGroups,
    subTypeGroups,
    getSpecificDeviceIcon,
  }
}

export default useDeviceTypes
