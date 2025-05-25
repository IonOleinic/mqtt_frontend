import { useEffect, useState } from 'react'
import MotionImage from './MotionSensorImages/MotionImage'
import NoMotionImage from './MotionSensorImages/NoMotionImage'
import VibrationImage from './MotionSensorImages/VibrationImage'
import NoVibrationImage from './MotionSensorImages/NoVibrationImage'
import './SmartMotionSensor.css'

function SmartMotionSensor({ device }) {
  const [status, setStatus] = useState('OFF')
  const [statusImg, setStatusImg] = useState(<></>)
  const motionDetectedMessage =
    device.sub_type === 'pir' ? 'Motion Detected!' : 'Vibration Detected!'
  const noMotionDetectedMessage =
    device.sub_type === 'pir' ? 'No Motion' : 'No Vibration'
  useEffect(() => {
    setStatus(device.attributes.status)
    if (device.attributes.status == 'ON') {
      if (device.sub_type === 'pir')
        setStatusImg(<MotionImage color={'black'} size={200} />)
      else if (device.sub_type === 'vibration')
        setStatusImg(<VibrationImage color={'black'} size={200} />)
    } else {
      if (device.sub_type === 'pir')
        setStatusImg(<NoMotionImage color={'black'} size={200} />)
      else if (device.sub_type === 'vibration')
        setStatusImg(<NoVibrationImage color={'black'} size={200} />)
    }
  }, [device])

  return (
    <div className='smart-motion-sensor'>
      <div className='motion-image-container'>{statusImg}</div>
      <div className='motion-status-container'>
        <p style={{ color: status == 'ON' ? 'red' : 'black' }}>
          {status == 'ON' ? motionDetectedMessage : noMotionDetectedMessage}
        </p>
      </div>
    </div>
  )
}

export default SmartMotionSensor
