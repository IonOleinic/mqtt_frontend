import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VerticalMenu from '../../VerticalMenu/VerticalMenu'
import { MdOutlineExpandMore } from 'react-icons/md'
import { MdOutlineCancel } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { CgArrowTopRightR } from 'react-icons/cg'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { socket } from '../../../api/io'
import useDeviceIcon from '../../../hooks/useDeviceIcon'
import useFinalDevice from '../../../hooks/useFinalDevice'
import { confirmDialog } from 'primereact/confirmdialog'
import { CiWarning } from 'react-icons/ci'
import './Device.css'
import InactiveLayer from '../../CSSLayers/InactiveLayer/InactiveLayer'

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
          <span>{device.mqtt_group.toString().slice(0, 20)}</span>
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
        <VerticalMenu
          items={[
            { name: 'Info', icon: <AiOutlineInfoCircle /> },
            {
              name: 'Edit',
              icon: <CiEdit />,
              action: () => {
                navigate(`/devices/edit-device/${device.id}`)
              },
            },
            {
              name: 'Delete',
              icon: <AiOutlineDelete />,
              action: () => {
                confirmDialog({
                  message: `Do you want to delete device ${device.name}?`,
                  header: 'Delete Confirmation',
                  icon: 'pi pi-trash',
                  defaultfocus: 'reject',
                  acceptClassName: 'p-button-danger',
                  accept: () => {
                    handleDeleteDevice(device.id)
                  },
                  reject: () => {},
                })
              },
              isRed: true,
            },
            { name: 'Cancel', icon: <MdOutlineCancel /> },
          ]}
        />
        <button className='device-expand'>
          <CgArrowTopRightR size={20} />
        </button>
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
      </div>
      <div
        className={
          visibility === true
            ? 'final-device'
            : 'final-device final-device-hidden'
        }
      >
        {finalDevice}
        <InactiveLayer
          visibility={!device.available}
          // message='Device is offline.'
          // icon={<CiWarning color='gold' />}
        />
      </div>
    </div>
  )
}

export default Device
