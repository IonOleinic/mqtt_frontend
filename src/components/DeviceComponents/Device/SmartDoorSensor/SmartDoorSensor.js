import { useEffect, useState } from 'react'
import { AiFillLock } from 'react-icons/ai'
import { AiFillUnlock } from 'react-icons/ai'
import { HiOutlineSwitchHorizontal } from 'react-icons/hi'
import DoorMainModule from './DoorSensorImages/door_sensor_main_module.png'
import DoorSecondModule from './DoorSensorImages/door_sensor_second_module.png'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import './SmartDoorSensor.css'

let lockedImg = <AiFillLock size={25} color='#46B60A' />
let unlockedImg = <AiFillUnlock size={25} color='red' />
function SmartDoorSensor({ device }) {
  const axios = useAxiosPrivate()
  const [status, setStatus] = useState('Closed')
  const [lockImg, setLockImg] = useState(lockedImg)
  useEffect(() => {
    setStatus(device.status)
    if (device.status == 'Closed') {
      setLockImg(lockedImg)
    } else {
      setLockImg(unlockedImg)
    }
  }, [device])
  const sendToggleDirection = async () => {
    try {
      const response = await axios.post(
        `/smartDoorSensor?device_id=${device.id}`
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='smart-door-sensor'>
      <div className='display-status'>
        {lockImg}
        <p style={{ color: status == 'Closed' ? '#46B60A' : 'red' }}>
          {status}
        </p>
      </div>
      <div className='door-sensor-image'>
        <div
          className='door-sensor-image-item door-main-module'
          style={{ marginRight: status == 'Closed' ? '0' : '1.8rem' }}
        >
          <img src={DoorMainModule} alt='Door Sensor Main Module' />
        </div>
        <div
          className='door-sensor-image-item door-secondary-module'
          style={{ marginLeft: status == 'Closed' ? '0' : '1.8rem' }}
        >
          <img src={DoorSecondModule} alt='Door Sensor Second Module' />
        </div>
      </div>
      <div
        className='switch-direction-btn'
        onClick={sendToggleDirection}
        style={{ display: device.manufacter == 'tasmota' ? 'flex' : 'none' }}
      >
        <HiOutlineSwitchHorizontal size={20} color='black' />
      </div>
    </div>
  )
}

export default SmartDoorSensor
