import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Device from '../../../components/DeviceComponents/Device/Device'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { TbArrowsUpDown } from 'react-icons/tb'
import { TbFilter } from 'react-icons/tb'
import AddBtn from '../../../components/AddBtn/AddBtn'
import { Button } from 'primereact/button'
import DeletedDevices from '../../../components/DeviceComponents/DeletedDevices/DeletedDevices'
import { Dropdown } from 'primereact/dropdown'
import './Devices.css'

const Devices = () => {
  const navigate = useNavigate()
  const [devices, setDevices] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('General')
  const [selectedOrder, setSelectedOrder] = useState('Date')

  const axios = useAxiosPrivate()
  const getDevices = async (filter) => {
    try {
      if (filter === undefined || filter === '') {
        filter = selectedGroup
      }
      const response = await axios.get(`/devices?filter=${filter}`)
      sortDevicesBy(selectedOrder, response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const sortDevicesBy = (sortval, deviceList = devices) => {
    if (sortval.toUpperCase() === 'NAME') {
      setDevices(deviceList.sort((a, b) => (a.name > b.name ? 1 : -1)))
    } else if (sortval.toUpperCase() === 'DATE') {
      setDevices(
        deviceList.sort((a, b) =>
          new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
        )
      )
    }
  }
  async function getAllGroups() {
    try {
      let response = await axios.get('/mqttGroups')
      setGroups(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getDevices(selectedGroup)
  }, [])
  useEffect(() => {
    getAllGroups()
  }, [devices])

  const handleDeleteDevice = async (deviceId) => {
    try {
      const response = await axios.delete(`/device/${deviceId}`)
      sortDevicesBy(selectedOrder, response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className='devices-container'>
      <div className='toolbar'>
        <div className='toolbar-item'>
          <span>
            <TbFilter size={30} />
          </span>
          <Dropdown
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e.value)
              getDevices(e.value)
            }}
            options={groups}
            optionLabel='name'
            placeholder='Select a group'
            className='w-full md:w-14rem'
          />
        </div>
        <div className='toolbar-item'>
          <span>
            <TbArrowsUpDown size={25} />
          </span>
          <Dropdown
            value={selectedOrder}
            onChange={(e) => {
              setSelectedOrder(e.value)
              sortDevicesBy(e.value)
            }}
            options={['Date', 'Name']}
            optionLabel='name'
            placeholder='Select a order'
            className='w-full md:w-14rem'
          />
        </div>
        <div className='toolbar-item'>
          <span>Add</span>
          <Button
            icon='pi pi-plus'
            className='mr-2 toolbar-add-btn'
            onClick={() => {
              navigate('/devices/add-device')
            }}
          />
        </div>
      </div>
      {devices.length === 0 ? (
        <div className='empty-page'>
          <div
            className='empty-page-inner'
            onClick={() => {
              navigate('/devices/add-device')
            }}
          >
            <p>Your Device List is Empty. Please click to add one.</p>
            <AddBtn size={150} />
          </div>
        </div>
      ) : (
        <div className='devices'>
          {devices.map((device) => {
            return (
              <Device
                key={device.id}
                initDevice={device}
                handleDeleteDevice={handleDeleteDevice}
              />
            )
          })}
        </div>
      )}
      <DeletedDevices devices={devices} refreshDevices={getDevices} />
    </div>
  )
}

export default Devices
