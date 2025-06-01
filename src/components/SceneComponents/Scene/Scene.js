import { useState, useEffect, useRef } from 'react'
import { MdOutlineExpandMore } from 'react-icons/md'
import { TiStarFullOutline } from 'react-icons/ti'
import { TiStarOutline } from 'react-icons/ti'
import { confirmDialog } from 'primereact/confirmdialog'
import { FiMoreVertical } from 'react-icons/fi'
import { Menu } from 'primereact/menu'
import Switch from 'react-switch'
import Schedule from './Schedule/Schedule'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import DeviceScene from './DeviceScene/DeviceScene'
import WeatherScene from './WeatherScene/WeatherScene'
import wheatherIcon from '../SceneTypeImages/wheather_scene_icon.png'
import locationIcon from '../SceneTypeImages/location_scene_icon.png'
import deviceSceneIcon from '../SceneTypeImages/device_scene_icon.png'
import scheduleIcon from '../SceneTypeImages/schedule_icon.png'
import InactiveLayer from '../../CSSLayers/InactiveLayer/InactiveLayer'
import useUtils from '../../../hooks/useUtils'
import './Scene.css'

function Scene({ initScene, handleDeleteScene }) {
  const axios = useAxiosPrivate()
  const menuRight = useRef(null)
  const [favIcon, setFavIcon] = useState(<></>)
  const [favBool, setFavBool] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [scene, setScene] = useState(initScene)
  const [sceneIcon, setSceneIcon] = useState('')
  const { getDateFromStr } = useUtils()

  useEffect(() => {
    if (scene.favorite) {
      setFavIcon(<TiStarFullOutline size={26} style={{ color: 'gold' }} />)
      setFavBool(true)
    } else {
      setFavIcon(<TiStarOutline size={26} style={{ color: 'black' }} />)
      setFavBool(false)
    }
    if (scene.active) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
    switch (scene.scene_type) {
      case 'weather':
        setSceneIcon(wheatherIcon)
        break
      case 'location':
        setSceneIcon(locationIcon)
        break
      case 'deviceScene':
        setSceneIcon(deviceSceneIcon)
        break
      case 'schedule':
        setSceneIcon(scheduleIcon)
        break
      default:
        break
    }
  }, [scene])

  async function updateScene() {
    try {
      const response = await axios.put(`/scene/${scene.id}`, scene)
      if (response.data) {
        setScene(response.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  let finalScene = <></>
  if (scene.scene_type === 'schedule') {
    finalScene = <Schedule scene={scene} />
  } else if (scene.scene_type === 'deviceScene') {
    finalScene = <DeviceScene scene={scene} />
  } else if (scene.scene_type === 'weather') {
    finalScene = <WeatherScene scene={scene} />
  }
  const menuItems = [
    { label: 'Info', icon: 'pi pi-info-circle' },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
    },
    {
      label: 'Destroy',
      icon: 'pi pi-trash',
      command: () => {
        confirmDialog({
          message: `Do you want to destroy scene ${scene.name}?`,
          header: 'Destroy Confirmation',
          icon: 'pi pi-trash',
          defaultFocus: 'reject',
          acceptClassName: 'p-button-danger',
          accept: () => {
            handleDeleteScene(scene.id)
          },
          reject: () => {},
        })
      },
    },
    { label: 'Cancel', icon: 'pi pi-times-circle' },
  ]
  return (
    <div className='scene'>
      <div className='scene-top'>
        <label
          className='icon-expand'
          onClick={() => {
            setExpanded(!expanded)
          }}
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          }}
        >
          <MdOutlineExpandMore
            size={30}
            style={{ margin: '0', padding: '0' }}
          />
        </label>
        <img
          src={sceneIcon}
          alt='scene-img'
          className='scene-img'
          onClick={() => {
            setExpanded(!expanded)
          }}
        />
        <div className='scene-info'>
          <p
            onClick={() => {
              setExpanded(!expanded)
            }}
          >
            {scene.name}
          </p>
          <Switch
            onColor='#6366f1'
            offColor='#ccc'
            checkedIcon={false}
            uncheckedIcon={false}
            checked={isActive}
            onChange={() => {
              scene.active = !isActive
              updateScene()
            }}
          />
        </div>
        <span
          className='fav-icon'
          onClick={() => {
            scene.favorite = !favBool
            updateScene()
          }}
        >
          {favIcon}
        </span>
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
            <FiMoreVertical size={25} />
          </span>
        </div>
        <span className='scene-date'>
          {getDateFromStr(scene.createdAt?.toString())}
        </span>
      </div>
      <div
        className={expanded ? 'final-scene' : 'final-scene final-scene-hidden'}
      >
        {finalScene}
        <InactiveLayer visibility={!scene.active} />
      </div>
    </div>
  )
}

export default Scene
