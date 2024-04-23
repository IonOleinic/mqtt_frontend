import { useState, useEffect } from 'react'
import { CgBatteryFull } from 'react-icons/cg'
import { CgBattery } from 'react-icons/cg'
import { CgBatteryEmpty } from 'react-icons/cg'
import { TbBatteryOff } from 'react-icons/tb'
import { HiOutlineStatusOnline } from 'react-icons/hi'
import { HiOutlineStatusOffline } from 'react-icons/hi'
import { TbUsb } from 'react-icons/tb'
import { AiOutlineStar } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'
//device icons
import SmartIrIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartIRIcon'
import SmartDoorIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartDoorSensorIcon'
import SmartBulbIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartBulbIcon'
import SmartRGBControllerIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartRGBControllerIcon'
import SmartMotionIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartMotionSensorIcon'
import SmartStripIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartStripIcon'
import SmartPlugIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartPlugIcon'
import SmartSwitchIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartSwitchIcon'
import SmartWallSwitchIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartWallSwitchIcon'
import SmartTempSensorIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartThermometerIcon'
import SmartSirenAlarmIcon from '../components/DeviceComponents/AddDeviceComponents/DeviceTypeImages/SmartSirenAlarmIcon'

//available icons
let iconOnline = <HiOutlineStatusOnline size={20} />
let iconOffline = <HiOutlineStatusOffline size={20} />

//battery icons
let poweredUsbIcon = (
  <div className='battery-icon-usb-powered'>
    <CgBatteryFull size={20} color='green' />
    <p>
      <TbUsb size={8} />
      USB
    </p>
  </div>
)
let batteryFullIcon = <CgBatteryFull size={20} color='green' />
let batteryMediumIcon = <CgBattery size={20} color='gold' />
let batteryLowIcon = <CgBatteryEmpty size={20} color='red' />
let batteryNoDataIcon = <TbBatteryOff size={20} color='#ccc' />

//favorite icons
let favIconEnabled = <AiFillStar size={26} style={{ color: 'gold' }} />
let favIconDisabled = <AiOutlineStar size={26} style={{ color: 'black' }} />

const useDeviceIcon = (device) => {
  const [deviceIcon, setDeviceIcon] = useState(<></>)
  const [availableIcon, setAvailableIcon] = useState(iconOffline)
  const [batteryIcon, setBatteryIcon] = useState(batteryNoDataIcon)
  const [favIcon, setFavIcon] = useState(favIconDisabled)
  const [favBool, setFavBool] = useState(false)

  useEffect(() => {
    switch (device.device_type) {
      case 'smartStrip':
        if (device.switch_type === 'plug') {
          setDeviceIcon(
            device.nr_of_sockets == 1 ? <SmartPlugIcon /> : <SmartStripIcon />
          )
        } else if (device.switch_type === 'switch') {
          setDeviceIcon(<SmartSwitchIcon />)
        } else if (device.switch_type === 'wall_switch') {
          setDeviceIcon(<SmartWallSwitchIcon />)
        }
        break
      case 'smartIR':
        setDeviceIcon(<SmartIrIcon />)
        break
      case 'smartTempSensor':
        setDeviceIcon(<SmartTempSensorIcon />)
        break
      case 'smartDoorSensor':
        setDeviceIcon(<SmartDoorIcon />)
        break
      case 'smartSirenAlarm':
        setDeviceIcon(<SmartSirenAlarmIcon />)
        break
      case 'smartLed':
        setDeviceIcon(
          device.sub_type === 'bulb' ? (
            <SmartBulbIcon />
          ) : (
            <SmartRGBControllerIcon />
          )
        )
        break
      case 'smartMotionSensor':
        setDeviceIcon(<SmartMotionIcon />)
        break
      default:
        // Handle default case or set a default icon
        setDeviceIcon(<></>)
        break
    }
  }, [device.device_type])
  // useEffect(() => {
  //   console.log(deviceIcon)
  // }, [deviceIcon])
  useEffect(() => {
    setAvailableIcon(device.available ? iconOnline : iconOffline)
  }, [device.available])

  useEffect(() => {
    setFavIcon(device.favorite ? favIconEnabled : favIconDisabled)
    setFavBool(device.favorite)
  }, [device.favorite])

  useEffect(() => {
    switch (device.battery_level) {
      case 1:
        setBatteryIcon(batteryLowIcon)
        break
      case 2:
        setBatteryIcon(batteryMediumIcon)
        break
      case 3:
        setBatteryIcon(batteryFullIcon)
        break
      case 4:
        setBatteryIcon(poweredUsbIcon)
        break
      default:
        setBatteryIcon(batteryNoDataIcon)
        break
    }
  }, [device.battery_level])

  return { deviceIcon, availableIcon, batteryIcon, favIcon, favBool }
}

export default useDeviceIcon
