import { useEffect, useState } from 'react'
import MotionImage from './MotionSensorImages/MotionImage'
import NoMotionImage from './MotionSensorImages/NoMotionImage'
import './SmartMotionSensor.css'

function SmartMotionSensor({ device }) {
  const [status, setStatus] = useState('No Motion')
  const [statusImg, setStatusImg] = useState(
    <NoMotionImage color={'black'} size={200} />
  )
  useEffect(() => {
    setStatus(device.attributes.status)
    if (device.attributes.status == 'Motion') {
      setStatusImg(<MotionImage color={'black'} size={200} />)
    } else {
      setStatusImg(<NoMotionImage color={'black'} size={200} />)
    }
  }, [device])

  return (
    <div className='smart-motion-sensor'>
      <div className='motion-image-container'>{statusImg}</div>
      <div className='motion-status-container'>
        <p style={{ color: status == 'Motion' ? 'red' : 'black' }}>
          {status == 'Motion' ? 'Motion Detected !' : 'No Motion'}
        </p>
      </div>
    </div>
  )
}

export default SmartMotionSensor
