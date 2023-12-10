import React, { useState, useEffect } from 'react'
import './Device.css'
import { useNavigate } from 'react-router-dom'
import VerticalMenu from '../../VerticalMenu/VerticalMenu'
import { MdOutlineExpandMore } from 'react-icons/md'
import { MdOutlineCancel } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { socket } from '../../../api/io'
import useDeviceIcon from '../../../hooks/useDeviceIcon'
import useFinalDevice from '../../../hooks/useFinalDevice'

function Device({
  handleDeleteDevice,
  initDevice,
  toggleInfoBar,
  handleSelectDevice,
  isOpenInfoBar,
}) {
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const [visibility, setVisibility] = useState(false)
  const [device, setDevice] = useState(initDevice)
  const { deviceIcon, batteryIcon, availableIcon, favBool, favIcon } =
    useDeviceIcon(device)
  const finalDevice = useFinalDevice(device)

  const updateDevice = async () => {
    try {
      let response = await axios.put(`/device/${device.id}`, device)
      setDevice(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
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
        <div
          onClick={() => {
            setVisibility(!visibility)
          }}
          className={
            device.available
              ? 'device-img active-color'
              : 'device-img inactive-color'
          }
        >
          {deviceIcon}
        </div>
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
        <VerticalMenu
          items={[
            { name: 'Info', icon: <AiOutlineInfoCircle /> },
            {
              name: 'Edit',
              icon: <CiEdit />,
              action: () => {
                navigate(`/devices/editdevice/${device.id}`)
              },
            },
            { name: 'Blabla', icon: <AiOutlineInfoCircle /> },
            {
              name: 'Delete',
              icon: <AiOutlineDelete />,
              action: () => {
                handleDeleteDevice(device.id)
              },
              isRed: true,
            },
            { name: 'Cancel', icon: <MdOutlineCancel /> },
          ]}
        />
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
        {finalDevice}
      </div>
    </div>
  )
}

export default Device
