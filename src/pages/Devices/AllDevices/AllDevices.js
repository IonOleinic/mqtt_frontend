import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BiRefresh } from 'react-icons/bi'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GrClose } from 'react-icons/gr'
import { AiOutlinePlus } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import './AllDevices.css'
import Device from '../Device/Device'
import './AllDevices.css'
import DropDownMenu from './DropDownMenu/DropDownMenu'
import { app } from '../../api/api'

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
  const [filterOpen, setFilterOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [filterList, setFilterList] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedDevice, setSelectedDevice] = useState(initDevice)

  async function get_all_devices(filter) {
    try {
      if (filter === undefined || filter === '') {
        filter = selectedGroup
      }
      let result = await app.get(`/devices?filter=${filter}`)
      setDevices(result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  const sort_devices_by = (sortval) => {
    if (sortval === 'Nume') {
      setDevices(devices.sort((a, b) => (a.name > b.name ? 1 : -1)))
    }
  }
  async function get_all_groups() {
    try {
      let result = await app.get('/mqtt_groups')
      setFilterList(result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  const handleDeleteDevice = async (selected_device_id) => {
    console.log('handle delete')
    try {
      app.post(`/deleteDevice?device_id=${selected_device_id}`)
    } catch (error) {
      console.log(error.message)
    }
    get_all_devices(selectedGroup)
  }
  const updateSelectedGroup = (filter_name) => {
    setSelectedGroup(filter_name)
  }
  useEffect(() => {
    get_all_devices(selectedGroup)
    get_all_groups()
    if (devices[0]) {
      setSelectedDevice(devices[0])
      console.log(selectedDevice)
    }
  }, [])
  const toggleInfoBar = () => {
    setInfoOpen(!infoOpen)
  }
  const toggleSubMenu = () => {
    setFilterOpen(!filterOpen)
  }
  const updateSelectedDevice = (device) => {
    setSelectedDevice(device)
  }
  return (
    <div className='alldevices'>
      <div className='toolbar'>
        <div
          className='toolbar-item refresh-icon'
          onClick={() => {
            get_all_devices(selectedGroup)
          }}
        >
          <BiRefresh size={30} />
        </div>
        <div className='toolbar-item'>
          <p>Filter by</p>
          <DropDownMenu
            className='drop-down-menu'
            isOpen={filterOpen}
            toggleSubMenu={toggleSubMenu}
            message={'choose...'}
            items={filterList}
            action={get_all_devices}
            updateFunc={updateSelectedGroup}
          />
        </div>
        <div className='toolbar-item'>
          <p>Order by</p>
          <DropDownMenu
            className='drop-down-menu'
            isOpen={orderOpen}
            toggleSubMenu={() => {
              setOrderOpen(!orderOpen)
            }}
            message={'choose...'}
            items={['Nume', 'Data adaugarii']}
            action={sort_devices_by}
          />
        </div>
        <div className='toolbar-item'>
          <p>Add</p>
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

      <div
        className='alldevices-container'
        style={{ width: infoOpen === true ? '70%' : '90%' }}
      >
        {devices.map((device) => {
          return (
            <Device
              key={device.id}
              device={device}
              handleDeleteDevice={handleDeleteDevice}
              toggleInfoBar={toggleInfoBar}
              handleSelectDevice={updateSelectedDevice}
              isOpenInfoBar={infoOpen}
              refresh={get_all_devices}
            />
          )
        })}
      </div>
      <div
        className='sidebar'
        style={{
          right: infoOpen === true ? '0' : '100%',
          display: infoOpen === true ? 'flex' : 'none',
        }}
      >
        <input
          type='checkbox'
          name='close-icon'
          id='chk-exit'
          style={{ display: 'none' }}
          checked={infoOpen}
          onChange={() => {
            toggleInfoBar()
          }}
        />
        <label htmlFor='chk-exit' className='close-icon'>
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
