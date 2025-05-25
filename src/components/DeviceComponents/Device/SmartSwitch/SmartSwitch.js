import { useState, useEffect } from 'react'
import PowerBtn from './PowerBtn/PowerBtn'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import VoltageIcon from './SensorDataIcons/VoltageIcon'
import CurrentIcon from './SensorDataIcons/CurrentIcon'
import PowerIcon from './SensorDataIcons/PowerIcon'
import TotalPowerIcon from './SensorDataIcons/TotalPowerIcon'
import './SmartSwitch.css'

function SmartSwitch({ device }) {
  let initStatuses = []
  let initCheckedlist = []
  let sensorPart = <></>
  let powerButtons = []
  let powerBtnSize = 100
  if (device.attributes.nr_of_sockets == 2) {
    powerBtnSize = 70
  } else if (device.attributes.nr_of_sockets == 3) {
    powerBtnSize = 65
  } else if (device.attributes.nr_of_sockets >= 4) {
    powerBtnSize = 60
  }
  if (device.attributes.power_monitor == true) {
    powerBtnSize -= 10
  }
  for (let i = 0; i < device.attributes.nr_of_sockets; i++) {
    initStatuses.push('OFF')
    initCheckedlist.push(false)
  }
  const axios = useAxiosPrivate()
  const [statusList, setStatusList] = useState(initStatuses)
  const [isCheckedList, setIsCheckedList] = useState(initCheckedlist)
  const [sensorData, setSensorData] = useState({})

  useEffect(() => {
    updateStatuses(device.attributes?.power_status)
    if (device.attributes?.power_monitor == true) {
      setSensorData(device.attributes?.sensor_data)
    }
  }, [device])

  const updateStatuses = (power_status) => {
    setStatusList(power_status)
    for (let i = 0; i < power_status.length; i++) {
      if (power_status[i] === 'ON') {
        isCheckedList[i] = true
        setIsCheckedList(isCheckedList)
      } else {
        isCheckedList[i] = false
        setIsCheckedList(isCheckedList)
      }
    }
  }
  const sendChangePower = async (socket_nr, pwr_status) => {
    await axios.post(
      `/smartStrip?status=${pwr_status}&device_id=${device.id}&socket_nr=${
        socket_nr + 1
      }`
    )
  }
  const handlePower = async (id) => {
    try {
      if (statusList[id] === 'ON') {
        sendChangePower(id, 'OFF')
      } else {
        sendChangePower(id, 'ON')
      }
    } catch (err) {
      console.log(err.message)
    }
  }
  //init sensor part (ENERGY)
  if (device.attributes?.power_monitor == true) {
    sensorPart = (
      <div
        className='sensor-container'
        style={{
          display: sensorData === undefined ? 'none' : 'flex',
        }}
      >
        <div
          className='energy-today'
          style={{
            display: sensorData === undefined ? 'none' : 'flex',
          }}
        >
          <p>{sensorData?.Today?.toString() || '--'} kW</p>
        </div>
        <div className='sensor'>
          <div className='sensor-item'>
            <VoltageIcon size={30} />
            <p style={{ marginLeft: '0.2rem' }}>
              {sensorData?.Voltage?.toString() || '--'} V
            </p>
          </div>
          <div className='sensor-item'>
            <CurrentIcon size={30} />
            <p>{sensorData?.Current?.toString() || '--'} A</p>
          </div>
          <div className='sensor-item'>
            <PowerIcon size={30} />
            <p style={{ marginLeft: '0.2rem' }}>
              {sensorData?.Power?.toString() || '--'} W
            </p>
          </div>
          <div className='sensor-item' style={{ width: '140px' }}>
            <TotalPowerIcon size={30} />
            <p>{sensorData?.Total?.toString() || '--'} kW</p>
          </div>
        </div>
      </div>
    )
  }

  //init power buttons
  for (let i = 0; i < device.attributes?.nr_of_sockets; i++) {
    powerButtons.push(
      <PowerBtn
        key={i}
        id={i}
        size={powerBtnSize}
        isChecked={isCheckedList[i]}
        handlePower={handlePower}
      />
    )
  }

  return (
    <div className='smart-switch'>
      <div className='power-buttons-container'>
        <div
          className='power-buttons'
          style={{
            padding:
              device.attributes?.nr_of_sockets == 4 ? '0 4rem' : '0 1rem',
          }}
        >
          {powerButtons}
        </div>
      </div>
      {sensorPart}
    </div>
  )
}

export default SmartSwitch
