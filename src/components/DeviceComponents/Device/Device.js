import React, { useState, useEffect } from 'react'
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
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { socket } from '../../../api/io'
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
  const axios = useAxiosPrivate()
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
      const response = await axios.get(`/device/getInitState/${device.id}`)
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
      let response = await axios.put(`/device/${device.id}`, device)
      setDevice(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (lastAvailable != device.available) {
      //get_inital_state()
    }
    if (socket) {
      const updateDeviceHandler = (data) => {
        if (data.device.mqtt_name === device.mqtt_name) {
          //there are an isssue that multiple device of type smartIR are updating(they have same mqtt_name)
          if (data.device.device_type === 'smartIR') {
            setDevice((prev) => {
              return {
                ...prev,
                available: data.device.available,
              }
            })
          } else {
            setDevice(data.device)
          }
        }
      }
      socket.on('update_device', updateDeviceHandler)
      // Cleanup function to remove the listener when the component unmounts
      return () => {
        socket.off('update_device', updateDeviceHandler)
      }
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
    final_device = <SmartStrip device={device} />
  } else if (init_device.device_type === 'smartIR') {
    final_device = <SmartIR device={device} />
  } else if (init_device.device_type === 'smartTempSensor') {
    final_device = <SmartTempSensor device={device} />
  } else if (init_device.device_type === 'smartDoorSensor') {
    final_device = <SmartDoorSensor device={device} />
  } else if (init_device.device_type === 'smartSirenAlarm') {
    final_device = <SmartSirenAlarm device={device} />
  } else if (init_device.device_type === 'smartLed') {
    final_device = <SmartLed device={device} />
  } else if (init_device.device_type === 'smartMotionSensor') {
    final_device = <SmartMotionSensor device={device} />
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
          src={init_device.img}
          alt='device-img'
          className='device-img'
          onClick={() => {
            setVisibility(!visibility)
          }}
        />
        <div
          className={
            device.available
              ? 'device-info active-color'
              : 'device-info inactive-color'
          }
          onClick={() => {
            setVisibility(!visibility)
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
      <div
        className={
          visibility === true
            ? 'final-device'
            : 'final-device final-device-hidden'
        }
      >
        {final_device}
      </div>
    </div>
  )
}

export default Device
