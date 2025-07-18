import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { FaTemperatureLow } from 'react-icons/fa'
import { ImLocation } from 'react-icons/im'
import { TbTemperatureCelsius } from 'react-icons/tb'
import { GrAction } from 'react-icons/gr'
import useDeviceIcon from '../../../../hooks/useDeviceIcon'
import wifiLogo from '../../../DeviceComponents/ConnectionTypeImages/wifi-logo.png'
import zigbeeLogo from '../../../DeviceComponents/ConnectionTypeImages/zigbee-logo.png'
import './WeatherScene.css'

function WeatherScene({ scene }) {
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

  return (
    <div className='weather-scene'>
      <div className='weather-scene-top'>
        <div className='weather-scene-item'>
          <div className='weather-scene-location'>
            <ImLocation size={22} color='blue' />
            <p>{`${scene?.city}, ${scene?.country}`}</p>
          </div>
          <div className='weather-scene-temperature'>
            <FaTemperatureLow size={30} color='red' />
            <p>{`${scene.comparison_sign} ${scene.target_temperature} `}</p>
            <TbTemperatureCelsius
              size={30}
              color='black'
              className='celsius-icon'
            />
          </div>
        </div>
        <div>
          <HiOutlineArrowRight size={30} color={'black'} />
        </div>
        <div className='weather-scene-item'>
          <div className='weather-scene-data'>
            <p>{execDevice.name}</p>
            {execDeviceIcons.deviceIcon}
            <div className='weather-scene-connection-type'>
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
          <div className='weather-scene-event'>
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
    </div>
  )
}

export default WeatherScene
