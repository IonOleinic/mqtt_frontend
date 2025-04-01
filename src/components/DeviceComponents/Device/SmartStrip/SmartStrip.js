import { useState, useEffect } from 'react'
import PowerBtn from './PowerBtn/PowerBtn'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import voltageIcon from './SensorDataIcons/voltage-icon.png'
import currentIcon from './SensorDataIcons/current-icon.png'
import powerIcon from './SensorDataIcons/power-icon.png'
import totalPowerIcon from './SensorDataIcons/total-power-icon.png'
import './SmartStrip.css'

function SmartStrip({ device }) {
  const axios = useAxiosPrivate()
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
    const response = await axios.post(
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
          <h1>{sensorData.Today}</h1>
          <p>kW</p>
        </div>
        <div className='sensor'>
          <div className='sensor-item'>
            <img src={voltageIcon} />
            <p style={{ marginLeft: '0.2rem' }}>{sensorData.Voltage} V</p>
          </div>
          <div className='sensor-item'>
            <img src={currentIcon} />
            <p>{sensorData.Current} A</p>
          </div>
          <div className='sensor-item'>
            <img src={powerIcon} />
            <p style={{ marginLeft: '0.2rem' }}>{sensorData.Power} W</p>
          </div>
          <div className='sensor-item' style={{ width: '140px' }}>
            <img src={totalPowerIcon} />
            <p>{sensorData.Total} kW</p>
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
    <div className='smart-strip'>
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

export default SmartStrip
