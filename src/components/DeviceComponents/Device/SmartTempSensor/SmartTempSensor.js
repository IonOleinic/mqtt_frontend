import { useEffect, useState } from 'react'
import { FaTemperatureLow } from 'react-icons/fa'
import { RiCelsiusLine } from 'react-icons/ri'
import { WiHumidity } from 'react-icons/wi'
import { AiOutlinePercentage } from 'react-icons/ai'
import './SmartTempSensor.css'

function SmartTempSensor({ device }) {
  const [temperature, setTemperature] = useState(0)
  const [humidity, setHumidity] = useState(0)

  useEffect(() => {
    setTemperature(device.temperature)
    setHumidity(device.humidity)
  }, [device])

  return (
    <div className='smart-temp-sensor'>
      <div className='temp-sensor-item temp-item'>
        <FaTemperatureLow size={45} color='red' />
        <p className='temp-sensor-item-value'>{temperature} </p>
        <RiCelsiusLine size={36} color='black' />
      </div>
      <div className='temp-sensor-item'>
        <WiHumidity size={60} color='blue' />
        <p>{humidity}</p>
        <AiOutlinePercentage size={36} />
      </div>
    </div>
  )
}

export default SmartTempSensor
