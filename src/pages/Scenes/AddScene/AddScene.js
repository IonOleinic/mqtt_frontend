import React from 'react'
import './AddScene.css'
import { MdOutlineCancel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import wheather_icon from '../SceneTypeImages/wheather_scene_icon.png'
import location_icon from '../SceneTypeImages/location_scene_icon.png'
import device_scene_icon from '../SceneTypeImages/device_scene_icon.png'
import schedule_icon from '../SceneTypeImages/schedule_icon.png'
function AddScene({ toggleVisibility, visibility }) {
  const navigate = useNavigate()
  return (
    <div
      className='add-scene-container'
      style={{ display: visibility == true ? 'flex' : 'none' }}
      onClick={(e) => {
        if (e.target.className == 'add-scene-container') {
          toggleVisibility(false)
        }
      }}
    >
      <div className='add-scene'>
        <div className='add-scene-title'>
          <p>Add New Scene</p>
        </div>
        <div className='add-scene-menu'>
          <div className='add-scene-menu-item'>
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