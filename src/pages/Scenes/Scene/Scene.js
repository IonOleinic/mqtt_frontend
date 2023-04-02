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

const iconMore = (
  <MdOutlineExpandMore size={30} style={{ margin: '0', padding: '0' }} />
)
const favIconEnabled = <AiFillStar size={26} style={{ color: 'gold' }} />
const favIconDisabled = <AiOutlineStar size={26} style={{ color: 'black' }} />
function Scene({ init_scene, handleDeleteScene }) {
  const [openSubMenu, setOpenSubMenu] = useState(false)
  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu)
  }
  const [favIcon, setFavIcon] = useState(favIconDisabled)
  const [expandIcon, setExpandIcon] = useState(iconMore)
  const [isActive, setIsActive] = useState(false)
  const [scene, setScene] = useState(init_scene)
  const get_date_from_str = (date) => {
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
  async function update_scene() {
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
    if (scene.active == true || scene.active == 'true') {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [scene])
  let final_scene = <></>
  if (scene.scene_type === 'schedule') {
    final_scene = <Schedule scene={scene} />
  } else if (scene.scene_type === 'deviceScene') {
    final_scene = <DeviceScene scene={scene} />
  }
  return (
    <div className='scene'>
      <div className='scene-top'>
        <label className='icon-expand' onClick={() => {}} style={{}}>
          {expandIcon}
        </label>
        <img
          src={scene.img}
          alt='scene-img'
          className='scene-img'
          onClick={() => {}}
        />
        <div className='scene-info' onClick={() => {}}>
          <h3>{scene.name} </h3>
          <Switch
            checked={isActive}
            onChange={() => {
              scene.active = !isActive
              update_scene()
            }}
          />
        </div>
        <span className='fav-icon' onClick={() => {}}>
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
          {get_date_from_str(scene.date.toString())}
        </span>
      </div>
      {final_scene}
    </div>
  )
}

export default Scene
