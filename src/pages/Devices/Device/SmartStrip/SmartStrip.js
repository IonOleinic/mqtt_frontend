import React, { useState, useEffect } from 'react'
import './SmartStrip.css'
import Switch from './Switch/Switch'
import { app } from '../../../api/api'

const sensor_data_demo = {
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
function SmartStrip({ device, visibility }) {
  let init_statuses = []
  let initCheckedlist = []
  for (let i = 0; i < device.nr_of_sockets; i++) {
    init_statuses.push('OFF')
    initCheckedlist.push(false)
  }
  const [statusList, setStatusList] = useState(init_statuses)
  const [isCheckedList, setIsCheckedList] = useState(initCheckedlist)
  const [sensorData, setSensorData] = useState(sensor_data_demo)

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
  useEffect(() => {
    updateStatuses(device.power_status)
    if (device.sensor_status) {
      setSensorData(device.sensor_status)
    }
  }, [device])
  const sensor_update_req = async () => {
    try {
      if (device.device_type === 'smartSwitch') {
      } else if (device.device_type === 'smartStrip') {
        let smart_strip_sensor = await app.get(
          `/smartStrip?device_name=${device.mqtt_name}&req_topic=STATUS&req_payload=8`
        )
        setSensorData(smart_strip_sensor.data.sensor_status)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    sensor_update_req()
    let interval = setInterval(async () => {
      sensor_update_req()
    }, 3809)
    return () => {
      clearInterval(interval)
    }
  }, [])
  const send_change_power = async (socket_nr, pwr_status) => {
    const response = await app.post(
      `/smartStrip?status=${pwr_status}&device_name=${
        device.mqtt_name
      }&socket_nr=${socket_nr + 1}`
    )
    sensor_update_req()
  }
  const handlePower = async (id) => {
    try {
      if (statusList[id] === 'ON') {
        send_change_power(id, 'OFF')
      } else {
        send_change_power(id, 'ON')
      }
    } catch (err) {
      console.log(err.message)
    }
  }
  const { ENERGY } = sensorData.StatusSNS
  let sensor_part
  if (device.device_type === 'smartStrip') {
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
    <div
      className='smart-strip'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
      <div className='smart-switches'>
        {switches}
        <div
          className='energy-today'
          style={{
            display: device.device_type === 'smartSwitch' ? 'none' : 'flex',
          }}
        >
          <h1>{ENERGY.Today}</h1>
          <p>kW</p>
        </div>
      </div>
      {sensor_part}
    </div>
  )
}

export default SmartStrip
