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
import { TbUsb } from 'react-icons/tb'
import { useEffect } from 'react'
import { app } from '../../api/api'
import { socket } from '../../api/io'
import SmartSirenAlarm from './SmartAlarmSiren/SmartSirenAlarm'
import SmartBulb from './SmartBulb/SmartBulb'
import SmartMotionSensor from './SmartMotionSensor/SmartMotionSensor'
const iconMore = (
  <MdOutlineExpandMore size={30} style={{ margin: '0', padding: '0' }} />
)
const favIconEnabled = <AiFillStar size={26} style={{ color: 'gold' }} />
const favIconDisabled = <AiOutlineStar size={26} style={{ color: 'black' }} />

let battery_full = <CgBatteryFull size={25} color='green' />
let powered_usb = (
  <div className='battery-icon-usb-powered'>
    <CgBatteryFull size={25} color='green' />
    <p>
      <TbUsb size={10} />
      USB
    </p>
  </div>
)
let battery_medium = <CgBattery size={25} color='gold' />
let battery_low = <CgBatteryEmpty size={25} color='red' />
let battery_no_data = <TbBatteryOff size={24} color='#ccc' />
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
  const [expandIcon, setExpandIcon] = useState(iconMore)
  const [favIcon, setFavIcon] = useState(favIconDisabled)
  const [device, setDevice] = useState(init_device)
  const [favBool, setFavBool] = useState(false)
  const [batteryIcon, setBatteryIcon] = useState(battery_no_data)
  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu)
  }
  const set_battery_icon = (battery_level) => {
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
  async function update_device() {
    try {
      let result = await app.put(`/device/${device.id}`, device)
      setDevice(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (socket) {
      socket.on('update_device', (data) => {
        if (data.device.mqtt_name === device.mqtt_name) {
          setDevice(data.device)
        }
      })
    }
  }, [])
  useEffect(() => {
    if (device.favorite) {
      setFavIcon(favIconEnabled)
      setFavBool(true)
    } else {
      setFavIcon(favIconDisabled)
      setFavBool(false)
    }
    set_battery_icon(device.battery_level)
  }, [device])
  let final_device = <></>
  if (
    device.device_type === 'smartStrip' ||
    device.device_type === 'smartSwitch'
  ) {
    final_device = <SmartStrip visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartIR') {
    final_device = <SmartIR visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartTempSensor') {
    final_device = <SmartTempSensor visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartDoorSensor') {
    final_device = <SmartDoorSensor visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartSirenAlarm') {
    final_device = <SmartSirenAlarm visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartBulb') {
    final_device = <SmartBulb visibility={visibility} device={device} />
  } else if (init_device.device_type === 'smartMotionSensor') {
    final_device = <SmartMotionSensor visibility={visibility} device={device} />
  }
  const togglevisibility = () => {
    setVisibility(!visibility)
  }
  const get_date_from_str = (date) => {
    const addZero = (i) => {
      if (i <= 9) {
        return '0' + i
      } else {
        return i
      }
    }
    let temp_date = new Date(date)
    return (
      temp_date.getFullYear() +
      '-' +
      addZero(temp_date.getMonth()) +
      '-' +
      addZero(temp_date.getDate())
    )
  }
  return (
    <div className='device-item' key={device.mqtt_name}>
      <div className='device-top'>
        <label
          className='icon-expand'
          onClick={() => {
            togglevisibility()
          }}
          style={{
            transform: visibility ? 'rotate(180deg)' : 'rotate(0)',
          }}
        >
          {expandIcon}
        </label>
        <img
          src={`${init_device.img}`}
          alt='device-img'
          className='device-img'
          onClick={() => {
            togglevisibility()
          }}
        />
        <div
          className='device-info'
          onClick={() => {
            togglevisibility()
          }}
        >
          <h3>{device.name} </h3>
          <span>{device.mqtt_group.toString().slice(0, 20)}</span>
        </div>
        <span
          className='fav-icon'
          onClick={() => {
            device.favorite = !favBool
            update_device()
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
      </div>
      {final_device}
    </div>
  )
}

export default Device
