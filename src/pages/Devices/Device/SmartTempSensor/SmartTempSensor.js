import React, { useEffect, useState } from 'react'
import './SmartTempSensor.css'
import { FaTemperatureLow } from 'react-icons/fa'
import { TbTemperatureCelsius } from 'react-icons/tb'
import { WiHumidity } from 'react-icons/wi'
import { socket } from '../../../api/io'

function SmartTempSensor({ device, visibility }) {
  const [temperature, setTemperature] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [batteryLevel, setBatteryLevel] = useState(0)

  useEffect(() => {
    setTemperature(device.temperature)
    setHumidity(device.humidity)
    setBatteryLevel(device.battery_level)
  }, [device])

  useEffect(() => {
    if (socket) {
      socket.on('update_smart_temp_sensor', (data) => {
        if (data.mqtt_name === device.mqtt_name) {
          setTemperature(data.temperature)
          setHumidity(data.humidity)
          setBatteryLevel(data.battery_level)
        }
      })
    }
  }, [])
  return (
    <div
      className='smart-temp-sensor'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
      <div className='smart-temp-sensor-item temp-item'>
        <FaTemperatureLow size={36} color='red' />
        <p>
          {temperature}{' '}
          <TbTemperatureCelsius
            size={36}
            color='black'
            className='celsius-icon'
          />
        </p>
      </div>
      <div className='smart-temp-sensor-item'>
        <WiHumidity size={45} color='blue' />
        <p>{humidity} %</p>
      </div>
    </div>
  )
}

export default SmartTempSensor
