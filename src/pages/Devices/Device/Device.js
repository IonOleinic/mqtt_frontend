import React, { useState } from 'react'
import './Device.css'
import SmartStrip from './SmartStrip/SmartStrip'
import SmartIR from './SmartIR/SmartIR'
import { MdOutlineExpandMore } from 'react-icons/md'
import Favorite from './Favorite/Favorite'

const iconMore = (
  <MdOutlineExpandMore size={30} style={{ margin: '0', padding: '0' }} />
)
function Device({
  handleAddToFavorite,
  handleDeleteDevice,
  device,
  toggleInfoBar,
}) {
  const [openSubMenu, setOpenSubMenu] = useState(false)
  const [visibility, setVisibility] = useState(false)
  const [expandIcon, setExpandIcon] = useState(iconMore)
  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu)
  }
  let final_device
  if (
    device.device_type === 'smartStrip' ||
    device.device_type === 'smartSwitch'
  ) {
    final_device = (
      <SmartStrip
        mqtt_name={device.mqtt_name}
        device_type={device.device_type}
        device_name={device.name}
        nr_of_sochets={device.nr_of_plugs}
        visibility={visibility}
      />
    )
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
        <span className='vertical-menu'>
          <input
            type='checkbox'
            id={`check-sub-menu${device.mqtt_name}`}
            className='checkbox-sub-menu'
            checked={openSubMenu}
            onChange={() => {
              toggleSubMenu()
            }}
          />
          <label
            htmlFor={`check-sub-menu${device.mqtt_name}`}
            className='label-sub-menu'
          >
            <img src='https://img.icons8.com/material-rounded/24/null/menu-2.png' />
          </label>
          <span className='vertical-menu-item'>
            <ul>
              <li
                onClick={() => {
                  toggleSubMenu()
                  toggleInfoBar()
                }}
              >
                Info
              </li>
              <li
                onClick={() => {
                  toggleSubMenu()
                  handleAddToFavorite()
                }}
              >
                Add to Favorite
              </li>

              <li
                onClick={() => {
                  toggleSubMenu()
                  handleDeleteDevice(device.mqtt_name)
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
      </div>
      {final_device}
    </div>
  )
}

export default Device
