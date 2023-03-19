import React, { useState } from 'react'
import './Device.css'
import { useNavigate } from 'react-router-dom'
import SmartStrip from './SmartStrip/SmartStrip'
import SmartIR from './SmartIR/SmartIR'
import SmartTempSensor from './SmartTempSensor/SmartTempSensor'
import { MdOutlineExpandMore } from 'react-icons/md'
import { AiOutlineStar } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'
import { AiOutlineEdit } from 'react-icons/ai'
import { FiMoreVertical } from 'react-icons/fi'
import { useEffect } from 'react'
import { app } from '../../api/api'
const iconMore = (
  <MdOutlineExpandMore size={30} style={{ margin: '0', padding: '0' }} />
)
const favIconEnabled = <AiFillStar size={26} style={{ color: 'gold' }} />
const favIconDisabled = <AiOutlineStar size={26} style={{ color: 'black' }} />
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
  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu)
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
    if (device.favorite) {
      setFavIcon(favIconEnabled)
      setFavBool(true)
    } else {
      setFavIcon(favIconDisabled)
      setFavBool(false)
    }
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
        <span className='device-date'>
          {get_date_from_str(device.date.toString())}
        </span>
      </div>
      {final_device}
    </div>
  )
}

export default Device
