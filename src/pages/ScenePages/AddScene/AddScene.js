import React, { useRef } from 'react'
import './AddScene.css'
import { MdOutlineCancel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import wheather_icon from '../../../components/SceneComponents/AddSceneComponents/SceneTypeImages/wheather_scene_icon.png'
import location_icon from '../../../components/SceneComponents/AddSceneComponents/SceneTypeImages/location_scene_icon.png'
import device_scene_icon from '../../../components/SceneComponents/AddSceneComponents/SceneTypeImages/device_scene_icon.png'
import schedule_icon from '../../../components/SceneComponents/AddSceneComponents/SceneTypeImages/schedule_icon.png'
function AddScene({ toggleVisibility, visibility }) {
  const navigate = useNavigate()

  return (
    <div
      className={
        visibility
          ? 'add-scene-container'
          : 'add-scene-container add-scene-container-hidden'
      }
      onClick={() => {
        toggleVisibility(false)
      }}
    >
      <div className='add-scene'>
        <div className='add-scene-title'>
          <p>Add New Scene</p>
        </div>
        <div className='add-scene-menu'>
          <div
            className='add-scene-menu-item'
            onClick={() => {
              navigate('/scenes/addweatherscene')
            }}
          >
            <img src={wheather_icon} alt='wheather icon scene' />
            <p>When Wheather changes</p>
          </div>
          <div className='add-scene-menu-item'>
            <img src={location_icon} alt='location icon scene' />
            <p>When Location changes</p>
          </div>
          <div
            className='add-scene-menu-item'
            onClick={() => {
              navigate('/scenes/adddevicescene')
            }}
          >
            <img src={device_scene_icon} alt='device scene' />
            <p>Device Scene</p>
          </div>
          <div
            className='add-scene-menu-item'
            onClick={() => {
              navigate('/scenes/addschedule')
            }}
          >
            <img src={schedule_icon} alt='schedule scene' />
            <p>Schedule</p>
          </div>
        </div>
        <div
          className='add-scene-cancel-btn'
          onClick={() => {
            toggleVisibility(false)
          }}
        >
          <MdOutlineCancel size={20} />
          <p>Cancel</p>
        </div>
      </div>
    </div>
  )
}

export default AddScene
