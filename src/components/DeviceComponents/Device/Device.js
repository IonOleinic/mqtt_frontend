import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineExpandMore } from 'react-icons/md'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { socket } from '../../../api/io'
import useDeviceIcon from '../../../hooks/useDeviceIcon'
import useFinalDevice from '../../../hooks/useFinalDevice'
import { confirmDialog } from 'primereact/confirmdialog'
import InactiveLayer from '../../CSSLayers/InactiveLayer/InactiveLayer'
import { Menu } from 'primereact/menu'
import { FiMoreVertical } from 'react-icons/fi'
import { LiaCubesSolid } from 'react-icons/lia'
import wifiLogo from '../ConnectionTypeImages/wifi-logo.png'
import zigbeeLogo from '../ConnectionTypeImages/zigbee-logo.png'
import bluetoothLogo from '../ConnectionTypeImages/bluetooth-logo.png'
import './Device.css'

function Device({ handleDeleteDevice, initDevice }) {
  const menuRight = useRef(null)
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const [visibility, setVisibility] = useState(false)
  const [device, setDevice] = useState(initDevice)
  const { deviceIcon, batteryIcon, availableIcon, favBool, favIcon } =
    useDeviceIcon(device)
  const finalDevice = useFinalDevice(device)

  const updateDevice = async () => {
    try {
      const response = await axios.put(`/device/${device.id}`, device)
      setDevice(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (socket) {
      const updateDeviceHandler = (data) => {
        if (data.device.mqtt_name === device.mqtt_name) {
          //there are an isssue that multiple devices of type smartIR are updating(they have same mqtt_name)
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
  const menuItems = [
    { label: 'Info', icon: 'pi pi-info-circle' },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        navigate(`/devices/edit-device/${device.id}`)
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        confirmDialog({
          message: `Do you want to move to trash device ${device.name}?`,
          header: 'Delete Confirmation',
          icon: 'pi pi-trash',
          defaultFocus: 'reject',
          acceptClassName: 'p-button-danger',
          accept: () => {
            handleDeleteDevice(device.id)
          },
          reject: () => {},
        })
      },
    },
    { label: 'Cancel', icon: 'pi pi-times-circle' },
  ]

  return (
    <div
      className='device'
      key={device.id}
      style={{
        borderColor:
          device.connection_type === 'wifi'
            ? 'rgba(20, 20, 250, 0.8)'
            : 'rgba(250, 20, 20, 0.8)',
      }}
    >
      <div className='device-top'>
        <button
          className={
            visibility ? 'icon-expand icon-expand-rotated' : 'icon-expand'
          }
          onClick={() => {
            setVisibility(!visibility)
          }}
        >
          <MdOutlineExpandMore
            size={30}
            style={{ margin: '0', padding: '0' }}
          />
        </button>
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
          <div
            className={
              device.group_name
                ? 'device-group-container'
                : 'device-group-container-hidden'
            }
          >
            <LiaCubesSolid size={18} />
            <p>{device.group_name}</p>
          </div>
        </div>
        <button
          className='fav-icon'
          onClick={() => {
            device.favorite = !favBool
            updateDevice()
          }}
        >
          {favIcon}
        </button>
        <div className='vertical-menu'>
          <Menu
            model={menuItems}
            popup
            ref={menuRight}
            id='popup_menu_right'
            aria-controls='popup_menu_right'
            aria-haspopup
          />
          <span
            onClick={(e) => menuRight.current.toggle(e)}
            className='vertical-menu-dots'
          >
            <FiMoreVertical size={26} />
          </span>
        </div>
        <div className='device-status-icons'>
          <div
            className={
              device.available
                ? 'device-available-icon green-active-color'
                : 'device-available-icon inactive-color'
            }
          >
            {availableIcon}
            <p>{device.available ? 'online' : 'offline'}</p>
          </div>
          <div
            className={
              device.battery && device.available
                ? 'battery-level-icon'
                : 'battery-level-icon-hidden'
            }
          >
            {batteryIcon}
          </div>
        </div>
        <div className='device-right-icons'>
          <img
            src={device.connection_type === 'wifi' ? wifiLogo : zigbeeLogo}
            style={{
              width: device.connection_type === 'wifi' ? '30px' : '20px',
              height: '20px',
            }}
          />
        </div>
      </div>
      <div
        className={
          visibility === true
            ? 'final-device'
            : 'final-device final-device-hidden'
        }
      >
        {finalDevice}
        {/* <InactiveLayer visibility={!device.available} /> */}
      </div>
    </div>
  )
}

export default Device
