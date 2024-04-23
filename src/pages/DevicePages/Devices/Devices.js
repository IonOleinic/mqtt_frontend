import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Device from '../../../components/DeviceComponents/Device/Device'
import DropDownMenu from '../../../components/DropDownMenu/DropDownMenu'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { VscTriangleRight } from 'react-icons/vsc'
import { MdDateRange } from 'react-icons/md'
import { TbArrowsUpDown } from 'react-icons/tb'
import { TbFilter } from 'react-icons/tb'
import { TiSortAlphabetically } from 'react-icons/ti'
import AddBtn from '../../../components/AddBtn/AddBtn'
import { Button } from 'primereact/button'
import DeletedDevices from '../../../components/DeviceComponents/DeletedDevices/DeletedDevices'
import './Devices.css'

const Devices = () => {
  const navigate = useNavigate()
  const [devices, setDevices] = useState([])
  const [filterList, setFilterList] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('General')
  const [selectedOrder, setSelectedOrder] = useState('Date')

  const axios = useAxiosPrivate()
  const getDevices = async (filter) => {
    try {
      if (filter === undefined || filter === '') {
        filter = selectedGroup
      }
      let response = await axios.get(`/devices?filter=${filter}`)
      sortDevicesBy(selectedOrder, response.data)
      console.log(response.data)
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
          <DropDownMenu
            className='drop-down-menu'
            title={selectedGroup}
            setTitle={setSelectedGroup}
            items={filterList.map((item) => {
              return {
                name: item,
                icon: <VscTriangleRight />,
                action: (filter) => {
                  getDevices(filter)
                },
              }
            })}
          />
        </div>
        <div className='toolbar-item'>
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
