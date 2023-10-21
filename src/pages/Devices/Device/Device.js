import React, { useState } from 'react'
import './Device.css'
import { useNavigate } from 'react-router-dom'
import SmartStrip from './SmartStrip/SmartStrip'
import SmartIR from './SmartIR/SmartIR'
import SmartTempSensor from './SmartTempSensor/SmartTempSensor'
import SmartDoorSensor from './SmartDoorSensor/SmartDoorSensor'
import { MdOutlineExpandMore } from 'react-icons/md'
import { AiOutlineStar } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'
import { AiOutlineEdit } from 'react-icons/ai'
import { FiMoreVertical } from 'react-icons/fi'
import { CgBatteryFull } from 'react-icons/cg'
import { CgBattery } from 'react-icons/cg'
import { CgBatteryEmpty } from 'react-icons/cg'
import { TbBatteryOff } from 'react-icons/tb'
import { HiOutlineStatusOnline } from 'react-icons/hi'
import { HiOutlineStatusOffline } from 'react-icons/hi'
import { TbUsb } from 'react-icons/tb'
import { useEffect } from 'react'
import { app } from '../../api/api'
import { socket } from '../../api/io'
import SmartSirenAlarm from './SmartAlarmSiren/SmartSirenAlarm'
import SmartLed from './SmartLed/SmartLed'
import SmartMotionSensor from './SmartMotionSensor/SmartMotionSensor'

let favIconEnabled = <AiFillStar size={26} style={{ color: 'gold' }} />
let favIconDisabled = <AiOutlineStar size={26} style={{ color: 'black' }} />

let battery_full = <CgBatteryFull size={20} color='green' />
let powered_usb = (
  <div className='battery-icon-usb-powered'>
    <CgBatteryFull size={20} color='green' />
    <p>
      <TbUsb size={8} />
      USB
    </p>
  </div>
)
let battery_medium = <CgBattery size={20} color='gold' />
let battery_low = <CgBatteryEmpty size={20} color='red' />
let battery_no_data = <TbBatteryOff size={20} color='#ccc' />

let icon_online = <HiOutlineStatusOnline size={20} color='green' />
let icon_offline = <HiOutlineStatusOffline size={20} color='#ccc' />
function Device({
  handleDeleteDevice,
  init_device,
  toggleInfoBar,
  handleSelectDevice,
  isOpenInfoBar,
}) {
  const navigate = useNavigate()
  const [openSubMenu, setOpenSubMenu] = useState(false)
  const [visibility, setVisibility] = useState(false)
  const [favIcon, setFavIcon] = useState(favIconDisabled)
  const [device, setDevice] = useState(init_device)
  const [favBool, setFavBool] = useState(false)
  const [batteryIcon, setBatteryIcon] = useState(battery_no_data)
  const [lastAvailable, setLastAvailable] = useState(false)
  const [availableIcon, setAvailableIcon] = useState(icon_offline)
  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu)
  }
  const getInitalState = async () => {
    console.log('get init state')
    try {
      const response = await app.get(`/device/getInitState/${device.id}`)
    } catch (error) {
      console.log(error)
    }
  }
  const setBatteryIconFunc = (battery_level) => {
    if (battery_level == 1) {
      setBatteryIcon(battery_low)
    } else if (battery_level == 2) {
      setBatteryIcon(battery_medium)
    } else if (battery_level == 3) {
      setBatteryIcon(battery_full)
    } else if (battery_level == 4) {
      setBatteryIcon(powered_usb)
    }
  }
  const updateDevice = async () => {
    try {
      let result = await app.put(`/device/${device.id}`, device)
      setDevice(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (lastAvailable != device.available) {
      //get_inital_state()
    }
    if (socket) {
      socket.on('update_device', (data) => {
        if (data.device.mqtt_name === device.mqtt_name) {
          setDevice(data.device)
        }
      })
    }
  }, [])

  useEffect(() => {
    setLastAvailable(device.available)
    if (device.available) {
      setAvailableIcon(icon_online)
    } else {
      setAvailableIcon(icon_offline)
    }
    if (device.favorite) {
      setFavIcon(favIconEnabled)
      setFavBool(true)
    } else {
      setFavIcon(favIconDisabled)
      setFavBool(false)
    }
    setBatteryIconFunc(device.battery_level)
    // device.mqtt_group = device.mqtt_group.split(',')
  }, [device])
  let final_device = <></>
  if (device.device_type === 'smartStrip') {
    final_device = <SmartStrip visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartIR') {
    final_device = <SmartIR visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartTempSensor') {
    final_device = <SmartTempSensor visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartDoorSensor') {
    final_device = <SmartDoorSensor visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartSirenAlarm') {
    final_device = <SmartSirenAlarm visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartLed') {
    final_device = <SmartLed visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartMotionSensor') {
    final_device = <SmartMotionSensor visibility={visibility} device={device} />
  }
  return (
    <div className='device-item' key={device.mqtt_name}>
      <div className='device-top'>
        <label
          className='icon-expand'
          onClick={() => {
            setVisibility(!visibility)
          }}
          style={{
            transform: visibility ? 'rotate(180deg)' : 'rotate(0)',
          }}
        >
          <MdOutlineExpandMore
            size={30}
            style={{ margin: '0', padding: '0' }}
          />
        </label>
        <img
          src={`${init_device.img}`}
          alt='device-img'
          className='device-img'
          onClick={() => {
            setVisibility(!visibility)
          }}
        />
        <div
          className='device-info'
          onClick={() => {
            setVisibility(!visibility)
          }}
          style={{
            color: device.available == false ? '#ccc' : 'revert',
          }}
        >
          <h3>{device.name} </h3>
          <span>{device.mqtt_group.toString().slice(0, 20)}</span>
        </div>
        <span
          className='fav-icon'
          onClick={() => {
            device.favorite = !favBool
            updateDevice()
          }}
        >
          {favIcon}
        </span>
        <span className='vertical-menu'>
          <label
            className='label-sub-menu'
            onClick={() => {
              setOpenSubMenu(!openSubMenu)
            }}
            tabIndex={0}
            onBlur={() => {
              setTimeout(() => {
                setOpenSubMenu(false)
              }, 250)
            }}
          >
            <img src='https://img.icons8.com/material-rounded/24/null/menu-2.png' />
            {/* <FiMoreVertical size={25} className='more-vertical' /> */}
          </label>
          <span
            className='vertical-menu-item'
            style={{ display: openSubMenu ? 'block' : 'none' }}
          >
            <ul>
              <li
                onClick={() => {
                  toggleSubMenu()
                  if (!isOpenInfoBar) {
                    toggleInfoBar()
                  }
                  handleSelectDevice(device)
                }}
              >
                Info
              </li>
              <li
                onClick={() => {
                  toggleSubMenu()
                }}
              >
                blalvla
              </li>

              <li
                onClick={() => {
                  toggleSubMenu()
                  handleDeleteDevice(device.id)
                }}
              >
                Delete
              </li>
              <li
                onClick={() => {
                  toggleSubMenu()
                }}
              >
                Cancel
              </li>
            </ul>
          </span>
        </span>
        <span
          className='icon-edit'
          onClick={() => {
            navigate(`/devices/editdevice/${device.id}`)
          }}
        >
          <AiOutlineEdit size={25} />
        </span>
        <div
          className='battery-level-icon'
          style={{ display: device.battery == false ? 'none' : 'revert' }}
        >
          {batteryIcon}
        </div>
        <div className='device-available-icon'>{availableIcon}</div>
      </div>
      {final_device}
    </div>
  )
}

export default Device
