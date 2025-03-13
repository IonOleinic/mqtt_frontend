import { useState, useEffect } from 'react'
import Scene from '../../../components/SceneComponents/Scene/Scene'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { TbArrowsUpDown } from 'react-icons/tb'
import AddScene from '../AddScene/AddScene'
import AddBtn from '../../../components/AddBtn/AddBtn'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { TiSortAlphabetically } from 'react-icons/ti'
import { TiCalendar } from 'react-icons/ti'
import { TiStarFullOutline } from 'react-icons/ti'
import { TiStarHalfOutline } from 'react-icons/ti'
import { TiStarOutline } from 'react-icons/ti'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { TbDeviceNintendo } from 'react-icons/tb'
import { VscChromeClose } from 'react-icons/vsc'
import { VscFilter } from 'react-icons/vsc'
import './Scenes.css'

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

const Scenes = () => {
  const [scenes, setScenes] = useState([])
  const [sceneInvolvedDevices, setSceneInvolvedDevices] = useState([])
  const [selectedDevices, setSelectedDevices] = useState([])
  const [filter, setFilter] = useState({
    devices: [],
    favorite: undefined,
    name: '',
  })
  const [addSceneVisibility, setAddSceneVisibility] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(selectedOrderOptions[0])
  const [selectedFavorite, setSelectedFavorite] = useState(
    selectedFavoriteOptions[0]
  )
  const [toolbarExpanded, setToolbarExpanded] = useState(false)
  const axios = useAxiosPrivate()

  const getScenes = async (usedFilter = filter, usedOrder = selectedOrder) => {
    try {
      const response = await axios.get(
        `/scenes?filter=${JSON.stringify(usedFilter)}&order=${usedOrder?.name}`
      )
      setScenes(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  const getSceneInvolvedDevices = async () => {
    try {
      const response = await axios.get(`/scene-involved-devices`)
      setSceneInvolvedDevices(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getScenes()
    getSceneInvolvedDevices()
  }, [])

  const handleDeleteScene = async (sceneId) => {
    try {
      await axios.delete(`/scene/${sceneId}`)
      getScenes()
    } catch (error) {
      console.log(error.message)
    }
  }

  const resetFIlter = () => {
    setFilter({ ...filter, name: '', devices: [], favorite: undefined })
    getScenes(
      {
        ...filter,
        name: '',
        devices: [],
        favorite: undefined,
      },
      selectedOrderOptions[0]
    )
    setSelectedDevices([])
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
    <>
      <div className='scenes-container'>
        <div
          className={toolbarExpanded ? 'toolbar toolbar-expanded' : 'toolbar'}
        >
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
                  setAddSceneVisibility(true)
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
                  getScenes(filter, e.value)
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
                  getScenes({ ...filter, name: e.target.value })
                }}
              />
            </div>
            <div className='toolbar-item'>
              <label>
                <TbDeviceNintendo size={22} />
              </label>
              <MultiSelect
                value={selectedDevices}
                onChange={(e) => {
                  setSelectedDevices(e.value)
                  let devicesIds = []
                  e.value.map((device) => {
                    devicesIds.push(device.id)
                  })
                  setFilter({ ...filter, devices: devicesIds })
                  getScenes({ ...filter, devices: devicesIds })
                }}
                options={sceneInvolvedDevices}
                maxSelectedLabels={2}
                optionLabel='name'
                placeholder='Select devices'
                className='w-full md:w-20rem'
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
                  getScenes({
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
                  getScenes()
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

        {scenes.length === 0 ? (
          <>
            <div className='empty-page'>
              <div
                className='empty-page-inner'
                onClick={() => {
                  setAddSceneVisibility((prev) => !prev)
                }}
              >
                <p>Your scene list is empty. Please click to add one.</p>
                <AddBtn size={150} />
              </div>
            </div>
          </>
        ) : (
          <div className='scenes'>
            {scenes.map((scene) => {
              return (
                <Scene
                  init_scene={scene}
                  key={scene.id}
                  handleDeleteScene={handleDeleteScene}
                />
              )
            })}
          </div>
        )}
        <AddScene
          toggleVisibility={setAddSceneVisibility}
          visibility={addSceneVisibility}
        />
      </div>
    </>
  )
}

export default Scenes
