import { useEffect, useState } from 'react'
import { AiFillLock } from 'react-icons/ai'
import { AiFillUnlock } from 'react-icons/ai'
import { HiOutlineSwitchHorizontal } from 'react-icons/hi'
import DoorMainModuleImage from './DoorSensorImages/DoorMainModuleImage'
import DoorSecondModuleImage from './DoorSensorImages/DoorSecondModuleImage'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import './SmartDoorSensor.css'

let lockedImg = <AiFillLock size={25} color='#46B60A' />
let unlockedImg = <AiFillUnlock size={25} color='red' />

function SmartDoorSensor({ device }) {
  const axios = useAxiosPrivate()
  const [status, setStatus] = useState('Closed')
  const [lockImg, setLockImg] = useState(lockedImg)
  useEffect(() => {
    setStatus(device.attributes.status)
    if (device.attributes.status == 'Closed') {
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
      <div className='door-status-container'>
        {lockImg}
        <p style={{ color: status == 'Closed' ? '#46B60A' : 'red' }}>
          {status}
        </p>
      </div>
      <div
        className='door-image-container'
        style={{ gap: status == 'Closed' ? '0' : '50px' }}
      >
        <DoorMainModuleImage color={'black'} width={70} height={130} />
        <DoorSecondModuleImage color={'black'} width={50} height={80} />
      </div>
      <div
        className='door-switch-direction-btn'
        onClick={sendToggleDirection}
        style={{ display: device.manufacter == 'tasmota' ? 'flex' : 'none' }}
      >
        <HiOutlineSwitchHorizontal size={20} color='black' />
      </div>
    </div>
  )
}

export default SmartDoorSensor
