import { MdOutlineCancel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import wheather_icon from '../../../components/SceneComponents/SceneTypeImages/wheather_scene_icon.png'
import location_icon from '../../../components/SceneComponents/SceneTypeImages/location_scene_icon.png'
import device_scene_icon from '../../../components/SceneComponents/SceneTypeImages/device_scene_icon.png'
import schedule_icon from '../../../components/SceneComponents/SceneTypeImages/schedule_icon.png'
import { Dialog } from 'primereact/dialog'
import './AddScene.css'

function AddScene({ toggleVisibility, visibility }) {
  const navigate = useNavigate()

  return (
    <Dialog
      header='Add New Scene'
      visible={visibility}
      onHide={() => toggleVisibility(false)}
    >
      <div className='add-scene'>
        <div className='add-scene-title'>
          <p></p>
        </div>
        <div className='add-scene-menu'>
          <button
            className='add-scene-menu-item'
            onClick={() => {
              navigate('/scenes/add-weather-scene')
            }}
          >
            <img src={wheather_icon} alt='wheather icon scene' />
            <p>When Wheather changes</p>
          </button>
          <button className='add-scene-menu-item'>
            <img src={location_icon} alt='location icon scene' />
            <p>When Location changes</p>
          </button>
          <button
            className='add-scene-menu-item'
            onClick={() => {
              navigate('/scenes/add-device-scene')
            }}
          >
            <img src={device_scene_icon} alt='device scene' />
            <p>Device Scene</p>
          </button>
          <button
            className='add-scene-menu-item'
            onClick={() => {
              navigate('/scenes/add-schedule')
            }}
          >
            <img src={schedule_icon} alt='schedule scene' />
            <p>Schedule</p>
          </button>
        </div>
        <button
          className='add-scene-cancel-btn'
          onClick={() => {
            toggleVisibility(false)
          }}
        >
          <MdOutlineCancel size={20} />
          <p>Cancel</p>
        </button>
      </div>
    </Dialog>
  )
}

export default AddScene
