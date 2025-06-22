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
import { LiaCubesSolid } from 'react-icons/lia'
import { TiStarFullOutline } from 'react-icons/ti'
import { TiStarHalfOutline } from 'react-icons/ti'
import { TiStarOutline } from 'react-icons/ti'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { VscChromeClose } from 'react-icons/vsc'
import { VscFilter } from 'react-icons/vsc'
import useDebounce from '../../../hooks/useDebounce'
import useOptionTemplate from '../../../hooks/useOptionTemplate'
import './Devices.css'

const selectedOrderOptions = [
  { name: 'Date', icon: <TiCalendar size={20} /> },
  { name: 'Name', icon: <TiSortAlphabetically size={20} /> },
]
const selectedFavoriteOptions = [
  { name: 'All', icon: <TiStarHalfOutline color='black' /> },
  { name: 'Yes', icon: <TiStarFullOutline color='gold' /> },
  { name: 'No', icon: <TiStarOutline color='black' /> },
]

const Devices = () => {
  const navigate = useNavigate()
  const { selectedOptionTemplate, optionTemplate } = useOptionTemplate()
  const [devices, setDevices] = useState([])
  const [filter, setFilter] = useState({
    name: '',
    favorite: undefined,
    groups: [],
  })
  const debouncedFilterName = useDebounce(filter.name, 300)
  const [groups, setGroups] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(selectedOrderOptions[0])
  const [selectedFavorite, setSelectedFavorite] = useState(
    selectedFavoriteOptions[0]
  )
  const [toolbarExpanded, setToolbarExpanded] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [filterIndicator, setFilterIndicator] = useState({
    name: false,
    favorite: false,
    groups: false,
  })
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

  const getGroups = async () => {
    try {
      const response = await axios.get('/groups')
      setGroups([{ id: null, name: 'No group' }, ...response.data])
    } catch (error) {
      console.log(error.message)
    }
  }
  // useEffect(() => {
  //   getDevices(filter)
  // }, [])
  useEffect(() => {
    getGroups()
  }, [])

  useEffect(() => {
    getDevices({ ...filter, name: debouncedFilterName })
  }, [debouncedFilterName])

  useEffect(() => {
    setFilterIndicator({
      ...filterIndicator,
      name: filter.name !== '',
      favorite: filter.favorite !== undefined,
      groups: filter.groups !== undefined && filter.groups.length !== 0,
    })

    if (
      filter.name !== '' ||
      filter.favorite !== undefined ||
      (filter.groups !== undefined && filter.groups.length !== 0)
    )
      setIsFilterActive(true)
    else setIsFilterActive(false)
  }, [filter])

  const handleDeleteDevice = async (deviceId) => {
    try {
      await axios.delete(`/device/${deviceId}`)
      getDevices()
    } catch (error) {
      console.log(error.message)
    }
  }

  const resetFIlter = () => {
    setFilter({ ...filter, name: '', groups: [], favorite: undefined })
    getDevices(
      {
        ...filter,
        name: '',
        favorite: undefined,
        groups: [],
      },
      selectedOrderOptions[0]
    )
    setSelectedFavorite(selectedFavoriteOptions[0])
    setSelectedOrder(selectedOrderOptions[0])
    setSelectedGroups([])
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
            <span
              className={
                isFilterActive
                  ? 'active-filter-indicator'
                  : 'active-filter-indicator-hidden'
              }
            />
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
        <div className='toolbar-vertical-line' />
        <div className='toolbar-section filters-section'>
          <div className='toolbar-item'>
            <Button
              label='Reset'
              icon='pi pi-refresh'
              outlined
              onClick={() => {
                resetFIlter()
                setToolbarExpanded(false)
              }}
            />
          </div>
          <div className='toolbar-item'>
            <span
              className={
                filterIndicator.name
                  ? 'toolbar-item-filter-indicator'
                  : 'toolbar-item-filter-indicator-hidden'
              }
            />
            <label>Name</label>
            <InputText
              placeholder='type device name'
              value={filter.name}
              onChange={(e) => {
                setFilter({ ...filter, name: e.target.value })
              }}
            />
          </div>
          <div className='toolbar-item'>
            <span
              className={
                filterIndicator.groups
                  ? 'toolbar-item-filter-indicator'
                  : 'toolbar-item-filter-indicator-hidden'
              }
            />
            <label>
              <LiaCubesSolid size={24} />
            </label>
            <MultiSelect
              value={selectedGroups}
              onChange={(e) => {
                setSelectedGroups(e.value)
                let groupIds = []
                e.value.map((group) => {
                  groupIds.push(group.id)
                })
                setFilter({ ...filter, groups: groupIds })
                getDevices({ ...filter, groups: groupIds })
              }}
              options={groups}
              maxSelectedLabels={2}
              optionLabel='name'
              placeholder='Select groups'
              className='w-full md:w-20rem'
            />
          </div>
          <div className='toolbar-item'>
            <span
              className={
                filterIndicator.favorite
                  ? 'toolbar-item-filter-indicator'
                  : 'toolbar-item-filter-indicator-hidden'
              }
            />
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
        <div className='toolbar-vertical-line' />
        <div
          className='toolbar-section result-section'
          style={{ display: toolbarExpanded ? 'flex' : 'none' }}
        >
          <div className='toolbar-item toolbar-item-result'>
            <p>
              Finded : {devices.length}{' '}
              {devices.length === 1 ? 'result' : 'results'}
            </p>
          </div>
        </div>
        <div className='toolbar-section apply-filters-section'>
          <div className='toolbar-item toolbar-item-refresh'>
            <Button
              label='Refresh'
              icon='pi pi-sync'
              outlined
              onClick={() => {
                getDevices()
                setToolbarExpanded(false)
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
        <button
          className='colapse-toolbar-btn'
          onClick={() => {
            setToolbarExpanded(false)
          }}
        >
          <VscChromeClose size={25} />
        </button>
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
                refreshDevices={getDevices}
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
