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
import wheather_icon from '../SceneTypeImages/wheather_scene_icon.png'
import location_icon from '../SceneTypeImages/location_scene_icon.png'
import device_scene_icon from '../SceneTypeImages/device_scene_icon.png'
import schedule_icon from '../SceneTypeImages/schedule_icon.png'
import './Scene.css'
import InactiveLayer from '../../CSSLayers/InactiveLayer/InactiveLayer'

const favIconEnabled = <TiStarFullOutline size={26} style={{ color: 'gold' }} />
const favIconDisabled = <TiStarOutline size={26} style={{ color: 'black' }} />
function Scene({ init_scene, handleDeleteScene }) {
  const axios = useAxiosPrivate()
  const menuRight = useRef(null)
  const [favIcon, setFavIcon] = useState(favIconDisabled)
  const [favBool, setFavBool] = useState(false)
  const [visibility, setVisibility] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [scene, setScene] = useState(init_scene)
  const [sceneIcon, setSceneIcon] = useState('')

  const getDateFromStr = (date) => {
    const addZero = (i) => {
      if (i <= 9) {
        return '0' + i
      } else {
        return i
      }
    }
    let temp_date = new Date(date)
    return (
      addZero(temp_date.getDate()) +
      '-' +
      addZero(temp_date.getMonth() + 1) +
      '-' +
      temp_date.getFullYear()
    )
  }
  async function updateScene() {
    try {
      let result = await axios.put(`/scene/${scene.id}`, scene)
      if (result.data) {
        setScene(result.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    if (scene.favorite == 'true' || scene.favorite == true) {
      setFavIcon(favIconEnabled)
      setFavBool(true)
    } else {
      setFavIcon(favIconDisabled)
      setFavBool(false)
    }
    if (scene.active == true || scene.active == 'true') {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
    switch (scene.scene_type) {
      case 'weather':
        setSceneIcon(wheather_icon)
        break
      case 'location':
        setSceneIcon(location_icon)
        break
      case 'deviceScene':
        setSceneIcon(device_scene_icon)
        break
      case 'schedule':
        setSceneIcon(schedule_icon)
        break
      default:
        break
    }
  }, [scene])

  let final_scene = <></>
  if (scene.scene_type === 'schedule') {
    final_scene = <Schedule scene={scene} />
  } else if (scene.scene_type === 'deviceScene') {
    final_scene = <DeviceScene scene={scene} />
  } else if (scene.scene_type === 'weather') {
    final_scene = <WeatherScene scene={scene} />
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
            setVisibility(!visibility)
          }}
          style={{
            transform: visibility ? 'rotate(180deg)' : 'rotate(0)',
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
            setVisibility(!visibility)
          }}
        />
        <div className='scene-info'>
          <h3
            onClick={() => {
              setVisibility(!visibility)
            }}
          >
            {scene.name}
          </h3>
          <Switch
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
          {getDateFromStr(scene.createdAt.toString())}
        </span>
      </div>
      <div
        className={
          visibility === true ? 'final-scene' : 'final-scene final-scene-hidden'
        }
      >
        {final_scene}
        <InactiveLayer
          visibility={!(scene.active === true || scene.active === 'true')}
        />
      </div>
    </div>
  )
}

export default Scene
