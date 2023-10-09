import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { TbTemperatureCelsius } from 'react-icons/tb'
import './CurrentWeather.css'
const api = axios.create({
  baseURL: `https://api.openweathermap.org/data/2.5`,
  timeout: 4000,
})
function CurrentWeather() {
  const [temperature, setTemperature] = useState(0)
  const [location, setLocation] = useState('Suceava')
  const [iconURL, setIconURL] = useState(
    'http://openweathermap.org/img/w/02d.png'
  )
  let city = 'suceava'
  let api_key = '503946cd0949183d14afe29b6673cc5c'

  const get_current_temp = async () => {
    try {
      const response = await api.get(
        `/weather?q=${city}&units=metric&appid=${api_key}`
      )
      let result = response.data
      setTemperature(result.main.temp)
      setLocation(result.name + ', ' + result.sys.country)
      setIconURL(
        'http://openweathermap.org/img/w/' + result.weather[0].icon + '.png'
      )
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    get_current_temp()
    let interval = setInterval(async () => {
      get_current_temp()
    }, 100000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <div className='current-weather'>
      <div className='current-weather-icon'>
        <img src={iconURL} alt='current weather icon' />
      </div>
      <div className='current-weather-text'>
        <p className='current-weather-text-temp'>
          {temperature}{' '}
          <TbTemperatureCelsius
            size={28}
            color='white'
            className='celsius-icon'
          />
        </p>
        <p className='current-weather-text-loc'>{location}</p>
      </div>
    </div>
  )
}

export default CurrentWeather
