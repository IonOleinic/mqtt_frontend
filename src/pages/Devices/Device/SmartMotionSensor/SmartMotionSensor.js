import React, { useEffect, useState } from 'react'
import './SmartMotionSensor.css'
import { app } from '../../../api/api'
import no_motion_img from './MotionSensorImages/no_motion_img.jpg'
import motion_img from './MotionSensorImages/motion_img.jpg'
function SmartMotionSensor({ device, visibility }) {
  const [status, setStatus] = useState('No Motion')
  const [statusImg, setStatusImg] = useState(no_motion_img)
  useEffect(() => {
    setStatus(device.status)
    if (device.status == 'Motion') {
      setStatusImg(motion_img)
    } else {
      setStatusImg(no_motion_img)
    }
  }, [device])

  return (
    <div
      className='smart-motion-sensor'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
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
