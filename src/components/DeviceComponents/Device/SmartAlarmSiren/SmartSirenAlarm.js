import { useEffect, useState } from 'react'
import { Slider } from 'primereact/slider'
import { FaTemperatureLow } from 'react-icons/fa'
import { TbTemperatureCelsius } from 'react-icons/tb'
import { WiHumidity } from 'react-icons/wi'
import { SlVolume2 } from 'react-icons/sl'
import { SlVolumeOff } from 'react-icons/sl'
import { GrVolumeControl } from 'react-icons/gr'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import useDebounce from '../../../../hooks/useDebounce'
import './SmartSirenAlarm.css'

let volume_on = <SlVolume2 size={40} />
let volume_off = <SlVolumeOff size={40} />

function SmartSirenAlarm({ device }) {
  const axios = useAxiosPrivate()
  const [status, setStatus] = useState('OFF')
  const [temperature, setTemperature] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [sound, setSound] = useState(0)
  const [volume, setVolume] = useState(2)
  const debouncedVolume = useDebounce(volume, 300)
  const [inversedVolume, setInversedVolume] = useState(1)
  const [soundDuration, setSoundDuration] = useState(0)
  const debouncedSoundDuration = useDebounce(soundDuration, 300)
  const [volumeIcon, setVolumeIcon] = useState(volume_off)

  useEffect(() => {
    setStatus(device.status)
    if (device.status == 'ON') {
      setVolumeIcon(volume_on)
    } else {
      setVolumeIcon(volume_off)
    }
    setTemperature(device.temperature)
    setHumidity(device.humidity)
    setSound(device.sound)
    if (device.volume == 2) {
      setInversedVolume(1)
    } else if (device.volume == 1) {
      setInversedVolume(2)
    } else if (device.volume == 0) {
      setInversedVolume(3)
    }
    setVolume(device.volume)
    setSoundDuration(device.sound_duration)
  }, [device])

  useEffect(() => {
    if (debouncedSoundDuration == 0) {
      return
    }
    updateAlarmOptions(sound, debouncedVolume, debouncedSoundDuration)
  }, [debouncedVolume, debouncedSoundDuration])

  const sendChangePower = async (powerStatus) => {
    try {
      const response = await axios.post(
        `/smartSirenAlarm/power?status=${powerStatus}&device_id=${device.id}`
      )
    } catch (error) {
      console.log(error)
    }
  }

  const updateAlarmOptions = async (newSound, newVolume, newDuration) => {
    try {
      const response = await axios.post(
        `/smartSirenAlarm/options?new_sound=${newSound}&new_volume=${newVolume}&new_duration=${newDuration}&device_id=${device.id}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  let array_types = []
  for (let i = 0; i < 18; i++) {
    array_types.push(i + 1)
  }
  return (
    <div className='smart-alarm-siren'>
      <div className='siren-alarm-control'>
        <div className='siren-alarm-sensors'>
          <div className='siren-alarm-sensor-item siren-alarm-temp-item'>
            <FaTemperatureLow size={26} color='red' />
            <p>
              {temperature}{' '}
              <TbTemperatureCelsius
                size={24}
                color='black'
                className='celsius-icon'
              />
            </p>
          </div>
          <div className='siren-alarm-sensor-item'>
            <WiHumidity size={35} color='blue' />
            <p>
              {humidity} <b>%</b>
            </p>
          </div>
        </div>
        <div
          className={
            status == 'ON'
              ? 'siren-alarm-btn siren-alarm-active'
              : 'siren-alarm-btn'
          }
          onClick={() => sendChangePower('TOGGLE')}
        >
          {volumeIcon}
          <p
            className={
              status == 'ON'
                ? 'siren-alarm-btn-info siren-alarm-active'
                : 'siren-alarm-btn-info'
            }
          >
            Tap To Toggle
          </p>
        </div>
        <div className='siren-alarm-options'>
          <div className='form-group mt-3'>
            <label htmlFor='select-sound-type'>Sound Type</label>
            <select
              id='select-sound-type'
              className='form-select select-type'
              aria-label='Default select example'
              value={sound}
              onChange={(e) => {
                setSound(e.target.value)
                updateAlarmOptions(
                  e.target.value,
                  debouncedVolume,
                  debouncedSoundDuration
                )
              }}
            >
              {array_types.map((array_type, index) => {
                return (
                  <option key={index} value={array_type}>
                    {`${array_type}`}
                  </option>
                )
              })}
            </select>
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='input-sound-duration'>{'Duration (s)'}</label>
            <input
              id='input-sound-duration'
              pattern='[0-9]{1,5}'
              type='number'
              min={1}
              max={120}
              className='form-control mt-1'
              placeholder='Duration'
              value={soundDuration}
              onChange={(e) => {
                setSoundDuration(e.target.value)
              }}
            />
          </div>
        </div>
      </div>
      <div className='siren-alarm-volume'>
        <div className='volume-control-icon'>
          <GrVolumeControl size={30} />
        </div>
        <Slider
          min={0}
          max={3}
          value={inversedVolume}
          step={1}
          onChange={(e) => {
            if (e.value != '0') {
              setInversedVolume(e.value)
            }
            if (e.value == '3') {
              setVolume(0)
            } else if (e.value == '2') {
              setVolume(1)
            } else if (e.value == '1') {
              setVolume(2)
            }
          }}
          style={{ width: '60%' }}
        />
      </div>
    </div>
  )
}

export default SmartSirenAlarm
