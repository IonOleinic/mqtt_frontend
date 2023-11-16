import { useEffect, useState } from 'react'
import axios from 'axios'
const OPEN_WEATHER_API = '503946cd0949183d14afe29b6673cc5c'
const IP_INFO_TOKEN = '164caa09f5054d'
const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    iconURL: 'http://openweathermap.org/img/w/02d.png', // Default icon URL
  })

  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
    city: 'NaN',
    country: 'NaN',
  })

  const getWeatherData = async (latitude, longitude) => {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPEN_WEATHER_API}`
      )
      const response = weatherResponse.data

      setWeatherData({
        temperature: Math.ceil(response.main.temp),
        iconURL: `http://openweathermap.org/img/w/${response.weather[0].icon}.png`,
      })
    } catch (error) {
      console.error('Error fetching weather data:', error)
      // You might want to set an error state here for user feedback
    }
  }

  const getUserLocation = async () => {
    try {
      const response = await axios.get(
        `https://ipinfo.io/json?token=${IP_INFO_TOKEN}`
      )
      const loc = response.data.loc.split(',')
      const [latitude, longitude] = loc.map(Number)
      setUserLocation({
        latitude,
        longitude,
        city: response.data.city || 'NaN',
        country: response.data.country || 'NaN',
      })
    } catch (error) {
      console.error('Error fetching user location:', error)
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
    if (userLocation.latitude && userLocation.longitude) {
      getWeatherData(userLocation.latitude, userLocation.longitude)
      let weatherInterval = setInterval(() => {
        getWeatherData(userLocation.latitude, userLocation.longitude)
      }, 30000)

      return () => {
        clearInterval(weatherInterval)
      }
    }
  }, [userLocation])

  // Export the states
  return { weatherData, userLocation }
}

export default useWeatherData
