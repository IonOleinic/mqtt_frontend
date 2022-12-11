import React, { useState } from 'react'
import './Device.css'
import { useNavigate } from 'react-router-dom'
import SmartStrip from './SmartStrip/SmartStrip'
import SmartIR from './SmartIR/SmartIR'
import { MdOutlineExpandMore } from 'react-icons/md'
import { AiOutlineStar } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'
import { AiOutlineEdit } from 'react-icons/ai'
import { useEffect } from 'react'
import { app } from '../../api/api'
const iconMore = (
  <MdOutlineExpandMore size={30} style={{ margin: '0', padding: '0' }} />
)
const favIconEnabled = <AiFillStar size={26} style={{ color: 'gold' }} />
const favIconDisabled = <AiOutlineStar size={26} style={{ color: 'black' }} />
function Device({
  handleDeleteDevice,
  device,
  toggleInfoBar,
  handleSelectDevice,
  isOpenInfoBar,
  refresh,
}) {
  const navigate = useNavigate()
  const [openSubMenu, setOpenSubMenu] = useState(false)
  const [visibility, setVisibility] = useState(false)
  const [expandIcon, setExpandIcon] = useState(iconMore)
  const [favIcon, setFavIcon] = useState(favIconDisabled)
  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu)
  }
  async function update_fav(fav_bool) {
    device.favorite = fav_bool
    try {
      let result = await app.post(`/updateDevice`, device)
      console.log(result.data)
      refresh()
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    if (device.favorite) {
      setFavIcon(favIconEnabled)
    } else {
      setFavIcon(favIconDisabled)
    }
  }, [device.favorite])
  let final_device = <></>
  if (
    device.device_type === 'smartStrip' ||
    device.device_type === 'smartSwitch'
  ) {
    final_device = <SmartStrip visibility={visibility} device={device} />
  } else if (device.device_type === 'smartIR') {
    final_device = <SmartIR visibility={visibility} device={device} />
  }
  const togglevisibility = () => {
    setVisibility(!visibility)
  }
  return (
    <div className='device-item' key={device.mqtt_name}>
      <div className='device-top'>
        <input
          type='checkbox'
          name='chk-visibility'
          id='chk-visibility'
          checked={visibility}
          style={{ display: 'none' }}
        />
        <label
          className='icon-expand'
          onClick={() => {
            togglevisibility()
          }}
        >
          {expandIcon}
        </label>
        <img
          src={`${device.img}`}
          alt='device-img'
          className='device-img'
          onClick={() => {
            togglevisibility()
          }}
        />
        <span
          className='device-name'
          onClick={() => {
            togglevisibility()
          }}
        >
          <h3>{device.name} </h3>
          <br />
          <h4>{device.mqtt_group.toString()}</h4>
        </span>
        <span
          className='fav-icon'
          onClick={() => {
            if (device.favorite === true) {
              update_fav(false)
            } else {
              update_fav(true)
            }
          }}
        >
          {favIcon}
        </span>
        <span className='vertical-menu'>
          <input
            type='checkbox'
            id={`check-sub-menu${device.id}`}
            className='checkbox-sub-menu'
            checked={openSubMenu}
            onChange={() => {
              toggleSubMenu()
            }}
          />
          <label
            htmlFor={`check-sub-menu${device.id}`}
            className='label-sub-menu'
          >
            <img src='https://img.icons8.com/material-rounded/24/null/menu-2.png' />
          </label>
          <span className='vertical-menu-item'>
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
      </div>
      {final_device}
    </div>
  )
}

export default Device
