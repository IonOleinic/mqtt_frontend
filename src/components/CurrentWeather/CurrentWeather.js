import { TbTemperatureCelsius } from 'react-icons/tb'
import useWeatherData from '../../hooks/useWeatherData'
import './CurrentWeather.css'

function CurrentWeather() {
  const { weatherData, userLocation } = useWeatherData()

  return (
    <div className='current-weather'>
      <div className='current-weather-icon'>
        <img src={weatherData.iconURL} alt='current weather icon' />
      </div>
      <div className='current-weather-text'>
        <p className='current-weather-text-temp'>
          {weatherData.temperature}{' '}
          <TbTemperatureCelsius
            size={28}
            color='white'
            className='current-weather-celsius-icon'
          />
        </p>
        <p className='current-weather-text-loc'>{`${userLocation.city}, ${userLocation.country}`}</p>
      </div>
    </div>
  )
}

export default CurrentWeather
