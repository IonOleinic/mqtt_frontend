import { useEffect, useState } from 'react'
import { FaTemperatureHalf } from 'react-icons/fa6'
import { RiCelsiusLine } from 'react-icons/ri'
import { WiHumidity } from 'react-icons/wi'
import { AiOutlinePercentage } from 'react-icons/ai'
import './SmartTempSensor.css'

function SmartTempSensor({ device }) {
  const [temperature, setTemperature] = useState(0)
  const [humidity, setHumidity] = useState(0)

  useEffect(() => {
    setTemperature(device.attributes.temperature)
    setHumidity(device.attributes.humidity)
  }, [device])

  return (
    <div className='smart-temp-sensor'>
      <div className='temp-items'>
        <div className='temp-item'>
          <div className='temp-item-icon'>
            <FaTemperatureHalf size={50} color='red' />
          </div>
          <p>{temperature} </p>
          <RiCelsiusLine size={36} color='black' />
        </div>
        <div className='temp-item'>
          <div className='temp-item-icon'>
            <WiHumidity size={60} color='blue' />
          </div>
          <p>{humidity}</p>
          <AiOutlinePercentage size={36} />
        </div>
      </div>
    </div>
  )
}

export default SmartTempSensor
