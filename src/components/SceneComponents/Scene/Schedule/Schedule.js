import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { TbRepeatOnce } from 'react-icons/tb'
import { BsClock } from 'react-icons/bs'
import { GrAction } from 'react-icons/gr'
import useDeviceIcon from '../../../../hooks/useDeviceIcon'
import wifiLogo from '../../../DeviceComponents/ConnectionTypeImages/wifi-logo.png'
import zigbeeLogo from '../../../DeviceComponents/ConnectionTypeImages/zigbee-logo.png'
import './Schedule.css'

function Schedule({ scene }) {
  const axios = useAxiosPrivate()
  const [execDevice, setExecDevice] = useState({})
  const execDeviceIcons = useDeviceIcon(execDevice)
  const getExecDevice = async () => {
    try {
      const response = await axios.get(`/device/${scene.exec_device_id}`)
      setExecDevice(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getExecDevice()
  }, [scene])
  const addZero = (i) => {
    if (i <= 9) {
      return '0' + i
    } else {
      return i
    }
  }
  return (
    <div className='schedule-scene'>
      <div className='schedule-scene-top'>
        <div className='schedule-scene-item'>
          <div className='schedule-scene-data'>
            <p>{execDevice.name}</p>
            {execDeviceIcons.deviceIcon}
            <div className='schedule-scene-connection-type'>
              {execDevice.connection_type && (
                <img
                  src={
                    execDevice.connection_type === 'zigbee'
                      ? zigbeeLogo
                      : wifiLogo
                  }
                  style={{
                    width:
                      execDevice.connection_type === 'wifi' ? '30px' : '20px',
                    height: '20px',
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div>
          <HiOutlineArrowRight size={30} color={'black'} />
        </div>
        <div className='schedule-scene-item'>
          <div className='schedule-scene-event'>
            <GrAction size={20} />
            {scene.executable_text.includes('Color') ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <p style={{ margin: '0 0.3rem' }}>{'Color'}</p>
                <div
                  style={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '5px',
                    border:
                      scene.executable_text.split(' ')[1] == 'ffffff'
                        ? '1px solid black'
                        : 'none',
                    backgroundColor: `#${scene.executable_text.split(' ')[1]}`,
                  }}
                ></div>
              </div>
            ) : (
              <p>{scene.executable_text}</p>
            )}
          </div>
        </div>
      </div>
      <div className='schedule-time'>
        <div className='schedule-time-group'>
          <BsClock size={18} color={'black'} />
          <p>{`${scene.hour}:${addZero(Number(scene.minute))}`}</p>
          <TbRepeatOnce
            size={18}
            color={'red'}
            style={{
              display: scene.dayOfWeek == '' ? 'flex' : 'none',
            }}
          />
        </div>
      </div>
      <div className='schedule-repeat'>
        <p
          style={{
            color: scene.dayOfWeek.includes(1) ? 'white' : '#ccc',
            borderColor: scene.dayOfWeek.includes(1) ? 'black' : '#ccc',
            backgroundColor: scene.dayOfWeek.includes(1) ? '#30b301' : 'white',
          }}
        >
          Mon
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(2) ? 'white' : '#ccc',
            borderColor: scene.dayOfWeek.includes(2) ? 'black' : '#ccc',
            backgroundColor: scene.dayOfWeek.includes(2) ? '#30b301' : 'white',
          }}
        >
          Tue
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(3) ? 'white' : '#ccc',
            borderColor: scene.dayOfWeek.includes(3) ? 'black' : '#ccc',
            backgroundColor: scene.dayOfWeek.includes(3) ? '#30b301' : 'white',
          }}
        >
          Wed
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(4) ? 'white' : '#ccc',
            borderColor: scene.dayOfWeek.includes(4) ? 'black' : '#ccc',
            backgroundColor: scene.dayOfWeek.includes(4) ? '#30b301' : 'white',
          }}
        >
          Thru
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(5) ? 'white' : '#ccc',
            borderColor: scene.dayOfWeek.includes(5) ? 'black' : '#ccc',
            backgroundColor: scene.dayOfWeek.includes(5) ? '#30b301' : 'white',
          }}
        >
          Fri
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(6) ? 'white' : '#ccc',
            borderColor: scene.dayOfWeek.includes(6) ? 'black' : '#ccc',
            backgroundColor: scene.dayOfWeek.includes(6) ? '#30b301' : 'white',
          }}
        >
          Sat
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(0) ? 'white' : '#ccc',
            borderColor: scene.dayOfWeek.includes(0) ? 'black' : '#ccc',
            backgroundColor: scene.dayOfWeek.includes(0) ? '#30b301' : 'white',
          }}
        >
          Sun
        </p>
      </div>
    </div>
  )
}

export default Schedule
