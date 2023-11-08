import React, { useEffect, useState } from 'react'
import './SmartTempSensor.css'
import { FaTemperatureLow } from 'react-icons/fa'
import { TbTemperatureCelsius } from 'react-icons/tb'
import { WiHumidity } from 'react-icons/wi'

function SmartTempSensor({ device }) {
  const [temperature, setTemperature] = useState(0)
  const [humidity, setHumidity] = useState(0)

  useEffect(() => {
    setTemperature(device.temperature)
    setHumidity(device.humidity)
  }, [device])

  return (
    <div className='smart-temp-sensor'>
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
