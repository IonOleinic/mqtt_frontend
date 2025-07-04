import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { GrAction } from 'react-icons/gr'
import { MdPendingActions } from 'react-icons/md'
import useDeviceIcon from '../../../../hooks/useDeviceIcon'
import wifiLogo from '../../../DeviceComponents/ConnectionTypeImages/wifi-logo.png'
import zigbeeLogo from '../../../DeviceComponents/ConnectionTypeImages/zigbee-logo.png'
import './DeviceScene.css'

function DeviceScene({ scene }) {
  const axios = useAxiosPrivate()
  const [condDevice, setCondDevice] = useState({})
  const [execDevice, setExecDevice] = useState({})
  const condDeviceIcons = useDeviceIcon(condDevice)
  const execDeviceIcons = useDeviceIcon(execDevice)

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
          <div className='device-scene-data'>
            <p>{condDevice.name}</p>
            {condDeviceIcons.deviceIcon}
            <div className='device-scene-connection-type'>
              {condDevice.connection_type && (
                <img
                  src={
                    condDevice.connection_type === 'zigbee'
                      ? zigbeeLogo
                      : wifiLogo
                  }
                  style={{
                    width:
                      condDevice.connection_type === 'wifi' ? '30px' : '20px',
                    height: '20px',
                  }}
                />
              )}
            </div>
          </div>
          <div className='device-scene-event'>
            <MdPendingActions size={22} />
            <p>{scene.conditional_text}</p>
          </div>
        </div>
        <div>
          <HiOutlineArrowRight size={30} color={'black'} />
        </div>
        <div className='device-scene-item'>
          <div className='device-scene-data'>
            <p>{execDevice.name}</p>
            {execDeviceIcons.deviceIcon}
            <div className='device-scene-connection-type'>
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
          <div className='device-scene-event'>
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

export default DeviceScene
