import React, { useState, useEffect } from 'react'
import { MdOutlineExpandMore } from 'react-icons/md'
import { AiOutlineStar } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'
import { AiOutlineEdit } from 'react-icons/ai'
import Switch from 'react-switch'
import Schedule from './Schedule/Schedule'
import { app } from '../../api/api'
import './Scene.css'
import DeviceScene from './DeviceScene/DeviceScene'
import WeatherScene from './WeatherScene/WeatherScene'
import wheather_icon from '../SceneTypeImages/wheather_scene_icon.png'
import location_icon from '../SceneTypeImages/location_scene_icon.png'
import device_scene_icon from '../SceneTypeImages/device_scene_icon.png'
import schedule_icon from '../SceneTypeImages/schedule_icon.png'

const favIconEnabled = <AiFillStar size={26} style={{ color: 'gold' }} />
const favIconDisabled = <AiOutlineStar size={26} style={{ color: 'black' }} />
function Scene({ init_scene, handleDeleteScene }) {
  const [openSubMenu, setOpenSubMenu] = useState(false)
  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu)
  }
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
      temp_date.getFullYear() +
      '-' +
      addZero(temp_date.getMonth()) +
      '-' +
      addZero(temp_date.getDate())
    )
  }
  async function updateScene() {
    try {
      let result = await app.put(`/scene/${scene.id}`, scene)
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
    final_scene = <Schedule scene={scene} visibility={visibility} />
  } else if (scene.scene_type === 'deviceScene') {
    final_scene = <DeviceScene scene={scene} visibility={visibility} />
  } else if (scene.scene_type === 'weather') {
    final_scene = <WeatherScene scene={scene} visibility={visibility} />
  }
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
        <span className='vertical-menu'>
          <label
            className='label-sub-menu'
            onClick={() => {
              setOpenSubMenu(!openSubMenu)
            }}
            tabIndex={0}
            onBlur={() => {
              setTimeout(() => {
                setOpenSubMenu(false)
              }, 250)
            }}
          >
            <img src='https://img.icons8.com/material-rounded/24/null/menu-2.png' />
          </label>
          <span
            className='vertical-menu-item'
            style={{ display: openSubMenu ? 'block' : 'none' }}
          >
            <ul>
              <li
                onClick={() => {
                  toggleSubMenu()
                }}
              >
                Info
              </li>
              <li
                onClick={() => {
                  toggleSubMenu()
                }}
              >
                blalvla
              </li>

              <li
                onClick={() => {
                  handleDeleteScene(scene.id)
                }}
              >
                Delete
              </li>
              <li
                onClick={() => {
                  toggleSubMenu()
                }}
              >
                Cancel
              </li>
            </ul>
          </span>
        </span>
        <span className='icon-edit' onClick={() => {}}>
          <AiOutlineEdit size={25} />
        </span>
        <span className='scene-date'>
          {getDateFromStr(scene.date.toString())}
        </span>
      </div>
      {final_scene}
    </div>
  )
}

export default Scene
