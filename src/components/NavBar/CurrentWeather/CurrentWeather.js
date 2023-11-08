import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { TbTemperatureCelsius } from 'react-icons/tb'
import useAuth from '../../../hooks/useAuth'
import './CurrentWeather.css'
const apiKey = '503946cd0949183d14afe29b6673cc5c'
const IpInfoToken = '164caa09f5054d'
function CurrentWeather() {
  const { auth } = useAuth()
  const [temperature, setTemperature] = useState(0)
  const [city, setCity] = useState('NaN')
  const [country, setCountry] = useState('NaN')
  const [iconURL, setIconURL] = useState(
    'http://openweathermap.org/img/w/02d.png'
  )

  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  })

  const getUserLocation = async () => {
    try {
      const response = await axios.get(
        `https://ipinfo.io/json?token=${IpInfoToken}`
      )
      const loc = response.data.loc.split(',')
      const [latitude, longitude] = loc.map(Number)
      setUserLocation({ latitude, longitude })
      setCity(response.data.city || 'NaN')
      setCountry(response.data.country || 'NaN')
    } catch (error) {
      console.error('Error fetching user location:', error)
    }
  }
  const getWeatherData = async () => {
    if (userLocation.latitude && userLocation.longitude) {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&units=metric&appid=${apiKey}`
        )
        let response = weatherResponse.data
        setTemperature(response.main.temp)
        setIconURL(
          'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png'
        )
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }
  }
  useEffect(() => {
    getUserLocation()
    let locationInterval = setInterval(() => {
      getUserLocation()
    }, 900000)

    return () => {
      clearInterval(locationInterval)
    }
  }, [])
  useEffect(() => {
    getWeatherData()
    let wheaterInterval = setInterval(() => {
      getWeatherData()
    }, 30000)
    return () => {
      clearInterval(wheaterInterval)
    }
  }, [userLocation])

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
        <p className='current-weather-text-loc'>{`${city}, ${country}`}</p>
      </div>
    </div>
  )
}

export default CurrentWeather
