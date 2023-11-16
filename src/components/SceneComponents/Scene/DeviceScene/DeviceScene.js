import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { GrAction } from 'react-icons/gr'
import { MdPendingActions } from 'react-icons/md'
import './DeviceScene.css'

function DeviceScene({ scene }) {
  const axios = useAxiosPrivate()
  const [condDevice, setCondDevice] = useState({})
  const [execDevice, setExecDevice] = useState({})

  const getCondDevice = async () => {
    try {
      const response = await axios.get(`/device/${scene.cond_device_id}`)
      setCondDevice(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  const getExecDevice = async () => {
    try {
      const response = await axios.get(`/device/${scene.exec_device_id}`)
      setExecDevice(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getCondDevice()
    getExecDevice()
  }, [scene])

  return (
    <div className='device-scene'>
      <div className='device-scene-top'>
        <div className='device-scene-item'>
          <div className='device-scene-name-img'>
            <p>{condDevice.name}</p>
            <img src={condDevice.img} alt='conditional device img' />
          </div>
          <div className='device-scene-text'>
            <MdPendingActions size={25} />
            <p>{scene.conditional_text}</p>
          </div>
        </div>
        <div className='arrow-right'>
          <HiOutlineArrowRight size={30} color={'black'} />
        </div>
        <div className='device-scene-item'>
          <div className='device-scene-name-img'>
            <p>{execDevice.name}</p>
            <img src={execDevice.img} alt='executable device img' />
          </div>
          <div className='device-scene-text'>
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

export default DeviceScene