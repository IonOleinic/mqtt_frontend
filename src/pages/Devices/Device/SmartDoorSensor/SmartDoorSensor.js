import React, { useEffect, useState } from 'react'
import './SmartDoorSensor.css'
import { AiFillLock } from 'react-icons/ai'
import { AiFillUnlock } from 'react-icons/ai'
import { HiOutlineSwitchHorizontal } from 'react-icons/hi'
import DoorMainModule from './DoorSensorImages/door_sensor_main_module.png'
import DoorSecondModule from './DoorSensorImages/door_sensor_second_module.png'
import { app } from '../../../api/api'
let lockedImg = <AiFillLock size={25} color='#46B60A' />
let unlockedImg = <AiFillUnlock size={25} color='red' />
function SmartDoorSensor({ device, visibility }) {
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
    const response = await app.post(`/smartDoorSensor?device_id=${device.id}`)
  }

  return (
    <div
      className='smart-door-sensor'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
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
      <div className='switch-direction-btn' onClick={sendToggleDirection}>
        <HiOutlineSwitchHorizontal size={20} color='black' />
      </div>
    </div>
  )
}

export default SmartDoorSensor
