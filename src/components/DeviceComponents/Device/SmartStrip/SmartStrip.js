import React, { useState, useEffect } from 'react'
import './SmartStrip.css'
import Switch from './Switch/Switch'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import voltageIcon from './SensorDataIcons/voltage-icon.png'
import currentIcon from './SensorDataIcons/current-icon.png'
import powerIcon from './SensorDataIcons/power-icon.png'
import totalPowerIcon from './SensorDataIcons/total-power-icon.png'

function SmartStrip({ device }) {
  const axios = useAxiosPrivate()
  let initStatuses = []
  let initCheckedlist = []
  let sensorPart = <></>
  let switches = []
  for (let i = 0; i < device.nr_of_sockets; i++) {
    initStatuses.push('OFF')
    initCheckedlist.push(false)
  }
  const [statusList, setStatusList] = useState(initStatuses)
  const [isCheckedList, setIsCheckedList] = useState(initCheckedlist)
  const [sensorData, setSensorData] = useState({
    Total: '--',
    Today: '--',
    Power: '--',
    Voltage: '--',
    Current: '--',
  })

  useEffect(() => {
    updateStatuses(device.power_status)
    if (device.switch_type == 'plug') {
      setSensorData(device.sensor_data)
    }
  }, [device])
  const sensorUpdateReq = async () => {
    try {
      if (device.switch_type === 'plug') {
        let response = await axios.get(
          `/smartStrip?device_id=${device.id}&req_topic=STATUS&req_payload=8`
        )
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    sensorUpdateReq()
    let interval = setInterval(async () => {
      if (device.switch_type == 'plug') {
        sensorUpdateReq()
      }
    }, 3809)
    return () => {
      clearInterval(interval)
    }
  }, [])
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
    sensorUpdateReq()
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
  if (device.switch_type === 'plug') {
    sensorPart = (
      <div
        className='sensor'
        style={{ display: sensorData === undefined ? 'none' : 'flex' }}
      >
        <div className='sensor-item'>
          <img src={voltageIcon} />
          <p>{sensorData.Voltage} V</p>
        </div>
        <div className='sensor-item' style={{ marginLeft: '-0.5em' }}>
          <img src={currentIcon} />
          <p>{sensorData.Current} A</p>
        </div>
        <div className='sensor-item'>
          <img src={powerIcon} />
          <p>{sensorData.Power} W</p>
        </div>
        <div className='sensor-item' style={{ width: '50%' }}>
          <img src={totalPowerIcon} />
          <p>{sensorData.Total} kW</p>
        </div>
      </div>
    )
  }

  //init switches
  for (let i = 0; i < device.nr_of_sockets; i++) {
    switches.push(
      <Switch
        key={i}
        id={i}
        isChecked={isCheckedList[i]}
        handlePower={handlePower}
      />
    )
  }

  return (
    <div className='smart-strip'>
      <div className='smart-switches'>
        {switches}
        <div
          className='energy-today'
          style={{
            display: device.switch_type === 'plug' ? 'flex' : 'none',
          }}
        >
          <h1>{sensorData.Today}</h1>
          <p>kW</p>
        </div>
      </div>
      {sensorPart}
    </div>
  )
}

export default SmartStrip
