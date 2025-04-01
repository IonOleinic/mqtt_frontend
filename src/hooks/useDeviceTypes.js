import { useState, useEffect } from 'react'
//device icons
import SmartIrIcon from '../components/DeviceComponents/DeviceTypeImages/SmartIRIcon'
import SmartDoorIcon from '../components/DeviceComponents/DeviceTypeImages/SmartDoorSensorIcon'
import SmartBulbIcon from '../components/DeviceComponents/DeviceTypeImages/SmartBulbIcon'
import SmartRGBControllerIcon from '../components/DeviceComponents/DeviceTypeImages/SmartRGBControllerIcon'
import SmartMotionIcon from '../components/DeviceComponents/DeviceTypeImages/SmartMotionSensorIcon'
import SmartStripIcon from '../components/DeviceComponents/DeviceTypeImages/SmartStripIcon'
import SmartPlugIcon from '../components/DeviceComponents/DeviceTypeImages/SmartPlugIcon'
import SmartSwitchIcon from '../components/DeviceComponents/DeviceTypeImages/SmartSwitchIcon'
import SmartWallSwitchIcon from '../components/DeviceComponents/DeviceTypeImages/SmartWallSwitchIcon'
import SmartTempSensorIcon from '../components/DeviceComponents/DeviceTypeImages/SmartThermometerIcon'
import SmartSirenAlarmIcon from '../components/DeviceComponents/DeviceTypeImages/SmartSirenAlarmIcon'
import SmartValveIcon from '../components/DeviceComponents/DeviceTypeImages/SmartValveIcon'

function useDeviceTypes(group) {
  const [subTypeGroups, setSubTypeGroups] = useState([])

  const typeGroups = [
    {
      label: 'Switch/Relay',
      type: 'smartStrip',
      icon: <SmartSwitchIcon />,
    },
    {
      label: 'IR',
      type: 'smartIR',
      icon: <SmartIrIcon />,
    },
    {
      label: 'Door/Window',
      type: 'smartTempSensor',
      icon: <SmartDoorIcon />,
    },
    {
      label: 'Temp/Humidity',
      type: 'smartTempSensor',
      icon: <SmartTempSensorIcon />,
    },
    {
      label: 'Pir Motion',
      type: 'smartMotionSensor',
      icon: <SmartMotionIcon />,
    },
    {
      label: 'Siren/Alarm',
      type: 'smartSirenAlarm',
      icon: <SmartSirenAlarmIcon />,
    },
    {
      label: 'Led',
      type: 'smartLed',
      icon: <SmartBulbIcon />,
    },
  ]
  useEffect(() => {
    setSubTypeGroups(getSubTypeGroups(group))
  }, [group])

  const getSubTypeGroups = (group) => {
    switch (group?.label) {
      case 'Switch/Relay':
        return [
          {
            label: 'Switch',
            type: 'smartStrip',
            sub_type: 'switch',
            icon: <SmartSwitchIcon />,
          },
          {
            label: 'Wall Switch',
            type: 'smartStrip',
            sub_type: 'wall_switch',
            icon: <SmartWallSwitchIcon />,
          },
          {
            label: 'Plug',
            type: 'smartStrip',
            sub_type: 'plug',
            icon: <SmartPlugIcon />,
          },
          {
            label: 'Valve',
            type: 'smartStrip',
            sub_type: 'valve',
            icon: <SmartValveIcon />,
          },
        ]
      case 'IR':
        return [{ label: 'IR', type: 'smartIR', icon: <SmartIrIcon /> }]
      case 'Door/Window':
        return [
          {
            label: 'Door Sensor',
            type: 'smartDoorSensor',
            icon: <SmartDoorIcon />,
          },
        ]
      case 'Temp/Humidity':
        return [
          {
            label: 'Temp Sensor',
            type: 'smartTempSensor',
            icon: <SmartTempSensorIcon />,
          },
        ]
      case 'Pir Motion':
        return [
          {
            label: 'Motion Sensor',
            type: 'smartMotionSensor',
            icon: <SmartMotionIcon />,
          },
        ]
      case 'Siren/Alarm':
        return [
          {
            label: 'Siren Alarm',
            type: 'smartSirenAlarm',
            icon: <SmartSirenAlarmIcon />,
          },
        ]
      case 'Led':
        return [
          {
            label: 'Bulb',
            type: 'smartLed',
            sub_type: 'bulb',
            icon: <SmartBulbIcon />,
          },
          {
            label: 'Led Strip',
            type: 'smartLed',
            sub_type: 'ledStrip',
            icon: <SmartRGBControllerIcon />,
          },
        ]
      default:
        return []
    }
  }

  const getSpecificDeviceIcon = (device) => {
    switch (device.device_type) {
      case 'smartStrip':
        if (device.sub_type === 'plug') {
          return device.nr_of_sockets == 1 ? (
            <SmartPlugIcon />
          ) : (
            <SmartStripIcon />
          )
        } else if (device.sub_type === 'switch') {
          return <SmartSwitchIcon />
        } else if (device.sub_type === 'wall_switch') {
          return <SmartWallSwitchIcon />
        } else if (device.sub_type === 'valve') {
          return <SmartValveIcon />
        }
        break
      case 'smartIR':
        return <SmartIrIcon />
      case 'smartTempSensor':
        return <SmartTempSensorIcon />
      case 'smartDoorSensor':
        return <SmartDoorIcon />
      case 'smartSirenAlarm':
        return <SmartSirenAlarmIcon />
      case 'smartLed':
        return device.sub_type === 'bulb' ? (
          <SmartBulbIcon />
        ) : (
          <SmartRGBControllerIcon />
        )
      case 'smartMotionSensor':
        return <SmartMotionIcon />
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
