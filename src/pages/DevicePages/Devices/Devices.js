import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Device from '../../../components/DeviceComponents/Device/Device'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { TbArrowsUpDown } from 'react-icons/tb'
import AddBtn from '../../../components/AddBtn/AddBtn'
import { Button } from 'primereact/button'
import DeletedDevices from '../../../components/DeviceComponents/DeletedDevices/DeletedDevices'
import { Dropdown } from 'primereact/dropdown'
import { TiSortAlphabetically } from 'react-icons/ti'
import { TiCalendar } from 'react-icons/ti'
import { GrCubes } from 'react-icons/gr'
import { TiStarFullOutline } from 'react-icons/ti'
import { TiStarHalfOutline } from 'react-icons/ti'
import { TiStarOutline } from 'react-icons/ti'
import { InputText } from 'primereact/inputtext'
import { VscChromeClose } from 'react-icons/vsc'
import { VscFilter } from 'react-icons/vsc'
import './Devices.css'

const tiCalendarIcon = <TiCalendar size={20} />
const tiSortAlphabeticallyIcon = <TiSortAlphabetically size={20} />

const tiStarHalfOutlineIcon = <TiStarHalfOutline color='black' />
const tiStarFullOutlineIcon = <TiStarFullOutline color='gold' />
const tiStarOutlineIcon = <TiStarOutline color='black' />

const selectedOrderOptions = [
  { name: 'Date', icon: tiCalendarIcon },
  { name: 'Name', icon: tiSortAlphabeticallyIcon },
]

const selectedFavoriteOptions = [
  { name: 'All', icon: tiStarHalfOutlineIcon },
  { name: 'Yes', icon: tiStarFullOutlineIcon },
  { name: 'No', icon: tiStarOutlineIcon },
]

const Devices = () => {
  const navigate = useNavigate()
  const [devices, setDevices] = useState([])
  const [filter, setFilter] = useState({
    group: 'General',
    favorite: undefined,
    name: '',
  })
  const [mqttGroups, setMqttGroups] = useState(['General'])
  const [selectedOrder, setSelectedOrder] = useState(selectedOrderOptions[0])
  const [selectedFavorite, setSelectedFavorite] = useState(
    selectedFavoriteOptions[0]
  )
  const [toolbarExpanded, setToolbarExpanded] = useState(false)

  const axios = useAxiosPrivate()

  const getDevices = async (usedFilter = filter, usedOrder = selectedOrder) => {
    try {
      const response = await axios.get(
        `/devices?filter=${JSON.stringify(usedFilter)}&order=${usedOrder?.name}`
      )
      setDevices(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getMqttGroups() {
    try {
      let response = await axios.get('/mqttGroups')
      setMqttGroups(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getDevices(filter)
  }, [])
  useEffect(() => {
    getMqttGroups()
  }, [devices])

  const handleDeleteDevice = async (deviceId) => {
    try {
      await axios.delete(`/device/${deviceId}`)
      getDevices()
    } catch (error) {
      console.log(error.message)
    }
  }

  const resetFIlter = () => {
    setFilter({ ...filter, name: '', group: 'General', favorite: undefined })
    getDevices(
      {
        ...filter,
        name: '',
        group: 'General',
        favorite: undefined,
      },
      selectedOrderOptions[0]
    )
    setSelectedFavorite(selectedFavoriteOptions[0])
    setSelectedOrder(selectedOrderOptions[0])
  }

  const selectedOptionTemplate = (option, props) => {
    if (option) {
      return (
        <div className='dropdown-template'>
          {option.icon}
          <div className='dropdown-template-name'>{option.name}</div>
        </div>
      )
    }
    return <span>{props.placeholder}</span>
  }

  const optionTemplate = (option) => {
    return (
      <div className='dropdown-template'>
        {option.icon}
        <div className='dropdown-template-name'>{option.name}</div>
      </div>
    )
  }

  return (
    <div className='devices-container'>
      <div className={toolbarExpanded ? 'toolbar toolbar-expanded' : 'toolbar'}>
        <div className='toolbar-section'>
          <div className='toolbar-item toolbar-item-filter'>
            <button
              className='toolbar-filter-btn'
              onClick={() => setToolbarExpanded((prev) => !prev)}
            >
              <VscFilter size={30} />
            </button>
          </div>
          <div className='toolbar-item'>
            <label>Add</label>
            <Button
              icon='pi pi-plus'
              className='mr-2 toolbar-add-btn'
              onClick={() => {
                navigate('/devices/add-device')
              }}
            />
          </div>
          <div className='toolbar-item'>
            <label>
              <TbArrowsUpDown size={22} />
            </label>
            <Dropdown
              value={selectedOrder}
              onChange={(e) => {
                setSelectedOrder(e.value)
                getDevices(filter, e.value)
              }}
              options={selectedOrderOptions}
              optionLabel='name'
              placeholder='Select a order'
              valueTemplate={selectedOptionTemplate}
              itemTemplate={optionTemplate}
              className='w-full md:w-14rem'
            />
          </div>
        </div>
        <div className='toolbar-section device-filters-section'>
          <div className='toolbar-item'>
            <label>Reset</label>
            <Button
              icon='pi pi-refresh'
              outlined
              onClick={() => {
                resetFIlter()
              }}
            />
          </div>
          <div className='toolbar-item'>
            <label>Name</label>
            <InputText
              value={filter.name}
              onChange={(e) => {
                setFilter({ ...filter, name: e.target.value })
                getDevices({ ...filter, name: e.target.value })
              }}
            />
          </div>
          <div className='toolbar-item'>
            <label>
              <GrCubes size={22} />
            </label>
            <Dropdown
              value={filter.group}
              onChange={(e) => {
                setFilter({ ...filter, group: e.value })
                getDevices({ ...filter, group: e.value })
              }}
              options={mqttGroups}
              optionLabel='name'
              placeholder='Select a group'
              className='w-full md:w-14rem'
            />
          </div>
          <div className='toolbar-item'>
            <label>
              <TiStarOutline size={22} />
            </label>
            <Dropdown
              value={selectedFavorite}
              onChange={(e) => {
                setSelectedFavorite(e.value)
                setFilter({
                  ...filter,
                  favorite:
                    e.value.name === 'Yes'
                      ? true
                      : e.value.name === 'No'
                      ? false
                      : undefined,
                })
                getDevices({
                  ...filter,
                  favorite:
                    e.value.name === 'Yes'
                      ? true
                      : e.value.name === 'No'
                      ? false
                      : undefined,
                })
              }}
              options={selectedFavoriteOptions}
              valueTemplate={selectedOptionTemplate}
              itemTemplate={optionTemplate}
              optionLabel='name'
              placeholder='Favorite filter'
              className='w-full md:w-14rem'
            />
          </div>
        </div>
        <div className='toolbar-section apply-filters-section'>
          <div className='toolbar-item toolbar-item-refresh'>
            <Button
              icon='pi pi-sync'
              outlined
              onClick={() => {
                getDevices()
              }}
            />
          </div>
          <div className='toolbar-item toolbar-item-apply'>
            <Button
              label='Apply & Close'
              icon='pi pi-check'
              className='mr-2'
              onClick={() => {
                setToolbarExpanded(false)
              }}
            />
          </div>
        </div>
        <div className='colapse-toolbar-btn'>
          <button
            onClick={() => {
              setToolbarExpanded(false)
            }}
          >
            <VscChromeClose size={25} />
          </button>
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
