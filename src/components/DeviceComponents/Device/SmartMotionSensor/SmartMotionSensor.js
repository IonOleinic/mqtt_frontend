import { useEffect, useState } from 'react'
import no_motion_img from './MotionSensorImages/no_motion_img.jpg'
import motion_img from './MotionSensorImages/motion_img.jpg'
import './SmartMotionSensor.css'

function SmartMotionSensor({ device }) {
  const [status, setStatus] = useState('No Motion')
  const [statusImg, setStatusImg] = useState(no_motion_img)
  useEffect(() => {
    setStatus(device.attributes.status)
    if (device.attributes.status == 'Motion') {
      setStatusImg(motion_img)
    } else {
      setStatusImg(no_motion_img)
    }
  }, [device])

  return (
    <div className='smart-motion-sensor'>
      <div className='motion-sensor-image'>
        <img src={statusImg} alt='Motion Sensor Img' />
      </div>
      <div className='display-motion-status'>
        <p style={{ color: status == 'Motion' ? 'red' : 'black' }}>
          {status == 'Motion' ? 'Motion Detected !' : 'No Motion'}
        </p>
      </div>
    </div>
  )
}

export default SmartMotionSensor
