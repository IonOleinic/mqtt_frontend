import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import './WeatherScene.css'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { FaTemperatureLow } from 'react-icons/fa'
import { ImLocation } from 'react-icons/im'
import { TbTemperatureCelsius } from 'react-icons/tb'
import { GrAction } from 'react-icons/gr'

function WeatherScene({ scene }) {
  const axios = useAxiosPrivate()
  const [execDevice, setExecDevice] = useState({})
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
            <div>
              <ImLocation size={22} color='blue' />
            </div>
            <p>{scene.city}</p>
          </div>
          <div className='weather-scene-temperature'>
            <FaTemperatureLow size={38} color='red' />
            <p>
              {scene.comparison_sign + ' '} {scene.target_temperature}{' '}
              <TbTemperatureCelsius
                size={30}
                color='black'
                className='celsius-icon'
              />
            </p>
          </div>
        </div>
        <div className='arrow-right'>
          <HiOutlineArrowRight size={30} color={'black'} />
        </div>
        <div className='weather-scene-item'>
          <div className='weather-scene-name-img'>
            <p>{execDevice.name}</p>
            <img src={execDevice.img} alt='executable device img' />
          </div>
          <div className='weather-scene-text'>
            <GrAction size={20} />
            {scene.executable_text.includes('Color') ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <p>{'Color'}</p>
                <div
                  style={{
                    width: '35px',
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
      <span
        className='scene-disabled-mask'
        style={{
          display:
            scene.active == 'true' || scene.active == true ? 'none' : 'revert',
        }}
      ></span>
    </div>
  )
}

export default WeatherScene
