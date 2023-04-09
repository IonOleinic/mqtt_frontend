import React, { useEffect, useState } from 'react'
import './SmartSirenAlarm.css'
import { RangeStepInput } from 'react-range-step-input'
import { FaTemperatureLow } from 'react-icons/fa'
import { TbTemperatureCelsius } from 'react-icons/tb'
import { WiHumidity } from 'react-icons/wi'
import { SlVolume2 } from 'react-icons/sl'
import { SlVolumeOff } from 'react-icons/sl'
import { GrVolumeControl } from 'react-icons/gr'
import { app } from '../../../api/api'
let volume_on = <SlVolume2 size={40} color='red' />
let volume_off = <SlVolumeOff size={40} color='black' />

function SmartSirenAlarm({ device, visibility }) {
  const [status, setStatus] = useState('OFF')
  const [temperature, setTemperature] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [sound, setSound] = useState(0)
  const [volume, setVolume] = useState(2)
  const [inversedVolume, setInversedVolume] = useState(1)
  const [soundDuration, setSoundDuration] = useState(0)
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

  const send_change_power = async (pwr_status) => {
    try {
      const response = await app.post(
        `/smartSirenAlarm/power?status=${pwr_status}&device_id=${device.id}`
      )
    } catch (error) {
      console.log(error)
    }
  }

  const update_options = async (new_sound, new_volume, new_duration) => {
    try {
      const response = await app.post(
        `/smartSirenAlarm/options?new_sound=${new_sound}&new_volume=${new_volume}&new_duration=${new_duration}&device_id=${device.id}`
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
    <div
      className='smart-alarm-siren'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
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
          className='siren-alarm-btn'
          style={{ borderColor: status == 'ON' ? 'red' : 'black' }}
          onClick={() => send_change_power('TOGGLE')}
        >
          {volumeIcon}
          <p
            className='siren-alarm-btn-info'
            style={{
              borderColor: status == 'ON' ? 'red' : 'black',
              color: status == 'ON' ? 'red' : 'black',
            }}
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
                update_options(e.target.value, volume, soundDuration)
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
              className='form-control mt-1'
              placeholder='Duration'
              value={soundDuration}
              onChange={(e) => {
                setSoundDuration(e.target.value)
                update_options(sound, volume, e.target.value)
              }}
            />
          </div>
        </div>
      </div>
      <div className='siren-alarm-volume'>
        <div className='volume-control-icon'>
          <GrVolumeControl size={30} />
        </div>
        <RangeStepInput
          min={0}
          max={3}
          value={inversedVolume}
          step={1}
          onChange={(e) => {
            if (e.target.value != '0') {
              setInversedVolume(e.target.value)
            }
            if (e.target.value == '3') {
              setVolume(0)
              update_options(sound, 0, soundDuration)
            } else if (e.target.value == '2') {
              setVolume(1)
              update_options(sound, 1, soundDuration)
            } else if (e.target.value == '1') {
              setVolume(2)
              update_options(sound, 2, soundDuration)
            }
          }}
        />
      </div>
    </div>
  )
}

export default SmartSirenAlarm
