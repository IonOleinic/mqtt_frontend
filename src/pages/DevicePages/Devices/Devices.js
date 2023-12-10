import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import { GrClose } from 'react-icons/gr'
import { AiOutlinePlus } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import './Devices.css'
import Device from '../../../components/DeviceComponents/Device/Device'
import DropDownMenu from '../../../components/DropDownMenu/DropDownMenu'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { VscTriangleRight } from 'react-icons/vsc'
import { MdDateRange } from 'react-icons/md'
import { TbArrowsUpDown } from 'react-icons/tb'
import { TbFilter } from 'react-icons/tb'
import { TiSortAlphabetically } from 'react-icons/ti'
import add_btn_img from './images/add_btn.png'

const initDevice = {
  name: 'unknown',
  manufacter: 'unknown',
  mqtt_name: 'unknown',
  mqtt_group: 'unknown',
  device_type: 'unknown',
  MAC: 'unknown',
  IP: 'unknown',
  battery: 'unknown',
}
const Devices = () => {
  const navigate = useNavigate()
  const [devices, setDevices] = useState([])
  const [infoOpen, setInfoOpen] = useState(false)
  const [filterList, setFilterList] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('General')
  const [selectedOrder, setSelectedOrder] = useState('Date')
  const [selectedDevice, setSelectedDevice] = useState(initDevice)
  const axios = useAxiosPrivate()
  const getAllDevices = async (filter) => {
    try {
      if (filter === undefined || filter === '') {
        filter = selectedGroup
      }
      let result = await axios.get(`/devices?filter=${filter}`)
      // setDevices(result.data)
      sortDevicesBy(selectedOrder, result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  const sortDevicesBy = (sortval, deviceList = devices) => {
    if (sortval.toUpperCase() === 'NAME') {
      setDevices(deviceList.sort((a, b) => (a.name > b.name ? 1 : -1)))
    } else {
      setDevices(deviceList.sort((a, b) => (a.date < b.date ? 1 : -1)))
    }
  }
  async function getAllGroups() {
    try {
      let response = await axios.get('/mqttGroups')
      setFilterList(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  const handleDeleteDevice = async (selected_device_id) => {
    try {
      const response = await axios.delete(`/device/${selected_device_id}`)
      setDevices(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getAllDevices(selectedGroup)
    getAllGroups()
    if (devices[0]) {
      setSelectedDevice(devices[0])
      // console.log(selectedDevice)
    }
  }, [])
  const toggleInfoBar = () => {
    setInfoOpen(!infoOpen)
  }
  const updateSelectedDevice = (device) => {
    setSelectedDevice(device)
  }
  return (
    <div className='devices-container'>
      <div className='toolbar-devices'>
        <div className='toolbar-devices-item'>
          <span>
            <TbFilter size={30} />
          </span>
          <DropDownMenu
            className='drop-down-menu'
            title={selectedGroup}
            setTitle={setSelectedGroup}
            items={filterList.map((item) => {
              return {
                name: item,
                icon: <VscTriangleRight />,
                action: (filter) => {
                  getAllDevices(filter)
                },
              }
            })}
          />
        </div>
        <div className='toolbar-devices-item'>
          <span>
            <TbArrowsUpDown size={25} />
          </span>
          <DropDownMenu
            className='drop-down-menu'
            title={selectedOrder}
            setTitle={setSelectedOrder}
            items={[
              {
                name: 'Date',
                icon: <MdDateRange />,
                action: () => {
                  sortDevicesBy('Date')
                },
              },
              {
                name: 'Name',
                icon: <TiSortAlphabetically />,
                action: () => {
                  sortDevicesBy('Name')
                },
              },
            ]}
            showTitleIcon={true}
          />
        </div>
        <div className='toolbar-devices-item'>
          <span>Add</span>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => {
              navigate('/devices/adddevice')
            }}
          >
            <AiOutlinePlus size={20} color='white' />
          </button>
        </div>
      </div>
      {devices.length === 0 ? (
        <div className='empty-page'>
          <div
            className='empty-page-inner'
            onClick={() => {
              navigate('/devices/adddevice')
            }}
          >
            <p>Your Device List is Empty. Please click to add one.</p>
            <img src={add_btn_img} alt='add device button' />
          </div>
        </div>
      ) : (
        <div
          className='devices'
          // style={{ width: infoOpen === true ? '70%' : '90%' }}
        >
          {devices.map((device) => {
            return (
              <Device
                key={device.id}
                initDevice={device}
                handleDeleteDevice={handleDeleteDevice}
                toggleInfoBar={toggleInfoBar}
                handleSelectDevice={updateSelectedDevice}
                isOpenInfoBar={infoOpen}
              />
            )
          })}
        </div>
      )}
      <div
        className='sidebar'
        style={{
          right: infoOpen === true ? '0' : '100%',
          display: infoOpen === true ? 'flex' : 'none',
        }}
      >
        <label
          htmlFor='chk-exit'
          className='close-icon'
          onClick={() => {
            toggleInfoBar()
          }}
        >
          <GrClose size={20} />
        </label>
        <div className='sidebar-item'>
          <h1 style={{ textAlign: 'center' }}>Device Info</h1>
        </div>
        <div className='sidebar-item'>
          <span className='sidebar-item-title'>Name : </span>
          <p>{selectedDevice.name}</p>
        </div>
        <div className='sidebar-item'>
          <span className='sidebar-item-title'>MQTT Name : </span>
          <p>{selectedDevice.mqtt_name}</p>
        </div>
        <div className='sidebar-item'>
          <span className='sidebar-item-title'>Firmware Manufacter : </span>
          <p>{selectedDevice.manufacter}</p>
        </div>
        <div className='sidebar-item'>
          <span className='sidebar-item-title'>Groups : </span>
          <p>{selectedDevice.mqtt_group.toString()}</p>
        </div>
        <div className='sidebar-item'>
          <span className='sidebar-item-title'>Device Type : </span>
          <p>{selectedDevice.device_type}</p>
        </div>
        <div className='sidebar-item'>
          <span className='sidebar-item-title'>MAC :</span>
          <p>{selectedDevice.MAC}</p>
        </div>
        <div className='sidebar-item'>
          <span className='sidebar-item-title'>IP :</span>
          <p>{selectedDevice.IP}</p>
        </div>
        <div className='sidebar-item'>
          <span className='sidebar-item-title'>Battery :</span>
          <p>{selectedDevice.battery}</p>
        </div>
      </div>
    </div>
  )
}

export default Devices
