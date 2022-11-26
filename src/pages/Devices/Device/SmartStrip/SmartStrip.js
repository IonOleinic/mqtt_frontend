import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './SmartStrip.css'
import Switch from './Switch/Switch'
const app = axios.create({
  baseURL: 'http://192.168.0.108:5000',
  timeout: 2000,
})
// let source = new EventSource('http://192.168.0.108:5000/stream')
const data = {
  StatusSNS: {
    Time: '0000-00-00T00:00:00',
    ENERGY: {
      TotalStartTime: '2022-10-13T16:13:07',
      Total: '-:-',
      Yesterday: '-:-',
      Today: '-:-',
      Power: '-:-',
      ApparentPower: '-:-',
      ReactivePower: '-:-',
      Factor: '-:-',
      Voltage: '-:-',
      Current: '-:-',
    },
  },
}
function SmartStrip({ mqtt_name, device_type, nr_of_sochets, visibility }) {
  let init_statuses = []
  let initCheckedlist = []
  for (let i = 0; i < nr_of_sochets; i++) {
    init_statuses.push('OFF')
    initCheckedlist.push(false)
  }
  const [statusList, setStatusList] = useState(init_statuses)
  const [isCheckedList, setIsCheckedList] = useState(initCheckedlist)
  const [sensorData, setSensorData] = useState(data)

  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        const smart_strip_power = await app.get(
          `/smartStrip?device_name=${mqtt_name}&req_topic=POWER&req_payload=''}`
        )
        setStatusList(smart_strip_power.data.power_status)
        for (let i = 0; i < smart_strip_power.data.power_status.length; i++) {
          if (smart_strip_power.data.power_status[i] === 'ON') {
            isCheckedList[i] = true
            setIsCheckedList(isCheckedList)
          } else {
            isCheckedList[i] = false
            setIsCheckedList(isCheckedList)
          }
        }
        if (device_type === 'smartSwitch') {
        } else if (device_type === 'smartStrip') {
          let smart_strip_sensor = await app.get(
            `/smartStrip?device_name=${mqtt_name}&req_topic=STATUS&req_payload=8}`
          )
          setSensorData(smart_strip_sensor.data.sensor_status)
        }
      } catch (error) {
        console.log(error)
      }
    }, 609)
    return () => {
      clearInterval(interval)
    }
  }, [])
  // useEffect(() => {
  //   const handleStream = (e) => {
  //     let result = JSON.parse(e.data)
  //     if (result.mqtt_name && result.mqtt_name === mqtt_name) {
  //       console.log(result)
  //       setStatusList(result.power_status)
  //       for (let i = 0; i < result.power_status.length; i++) {
  //         if (result.power_status[i] === 'ON') {
  //           isCheckedList[i] = true
  //           setIsCheckedList(isCheckedList)
  //         } else {
  //           isCheckedList[i] = false
  //           setIsCheckedList(isCheckedList)
  //         }
  //       }
  //     }
  //   }
  //   source.addEventListener('message', handleStream)
  //   return () => {
  //     source.removeEventListener('message', handleStream, true)
  //   }
  // }, [])

  const toggleChecked = (id) => {
    // isCheckedList[id] = !isCheckedList[id]
    // setIsCheckedList(isCheckedList)
  }
  const handlePower = async (id) => {
    try {
      if (statusList[id] === 'ON') {
        statusList[id] = 'ON'
        setStatusList(statusList)
        const response = await app.post(
          `/smartStrip?status=OFF&device_name=${mqtt_name}&req_type=POWER${
            id + 1
          }`
        )
        console.log(response.data)
      } else {
        statusList[id] = 'OFF'
        setStatusList(statusList)
        const response = await app.post(
          `/smartStrip?status=ON&device_name=${mqtt_name}&req_type=POWER${
            id + 1
          }`
        )
        console.log(response.data)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const { Time, ENERGY } = sensorData.StatusSNS

  const checkForStatuses = () => {
    for (let i = 0; i < statusList.length; i++) {
      if (statusList[i] === 'ON') {
        return true
      }
    }
    return false
  }
  let sensor_part
  if (device_type === 'smartStrip') {
    sensor_part = (
      <>
        <div
          className='sensor'
          style={{ display: sensorData === undefined ? 'none' : 'flex' }}
        >
          <div className='sensor-item'>
            <img src='https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/null/external-voltage-electrician-flaticons-lineal-color-flat-icons-15.png' />
            <p>{ENERGY.Voltage} V</p>
          </div>
          <div className='sensor-item' style={{ marginLeft: '-0.5em' }}>
            <img src='https://img.icons8.com/emoji/48/null/high-voltage.png' />
            <p>{ENERGY.Current} A</p>
          </div>
          <div className='sensor-item'>
            <img src='https://cdn-icons-png.flaticon.com/512/5387/5387682.png' />
            <p>{ENERGY.Power} W</p>
          </div>
          <div className='sensor-item' style={{ width: '50%' }}>
            <img src='https://cdn2.iconfinder.com/data/icons/unit-of-measurement/500/measurement-unit_12-512.png' />
            <p>{ENERGY.Total} kW</p>
          </div>
        </div>
      </>
    )
  } else {
    sensor_part = <></>
  }
  let switches = []
  for (let i = 0; i < nr_of_sochets; i++) {
    switches.push(
      <Switch
        key={i}
        id={i}
        toggleChecked={toggleChecked}
        isChecked={isCheckedList[i]}
        handlePower={handlePower}
      />
    )
  }
  return (
    <>
      <div>
        <form
          className={`form ${
            checkForStatuses() === true ? 'form-enabled' : ''
          }`}
          style={{ display: visibility === true ? 'flex' : 'none' }}
        >
          <div className='smart-switches'>
            {switches}
            <div
              className='energy-today'
              style={{
                display: device_type === 'smartSwitch' ? 'none' : 'flex',
              }}
            >
              <h1>{ENERGY.Today}</h1>
              <p>kW</p>
            </div>
          </div>
          {sensor_part}
        </form>
      </div>
    </>
  )
}

export default SmartStrip
