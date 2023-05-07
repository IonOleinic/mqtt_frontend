import React, { useEffect, useState } from 'react'
import { app } from '../../../api/api'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { GrAction } from 'react-icons/gr'
import { MdPendingActions } from 'react-icons/md'
import Parser from 'html-react-parser'
import './DeviceScene.css'

function DeviceScene({ scene, visibility }) {
  const [condDevice, setCondDevice] = useState({})
  const [execDevice, setExecDevice] = useState({})

  const get_cond_device = async () => {
    try {
      const response = await app.get(`/device/${scene.cond_device_id}`)
      setCondDevice(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  const get_exec_device = async () => {
    try {
      const response = await app.get(`/device/${scene.exec_device_id}`)
      setExecDevice(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    get_cond_device()
    get_exec_device()
  }, [scene])

  return (
    <div
      className='device-scene'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
      <div className='device-scene-top'>
        <div className='device-scene-item conditional'>
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
        <div className='device-scene-item executable'>
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
