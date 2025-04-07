import { useEffect, useState } from 'react'
import { FaTemperatureLow } from 'react-icons/fa'
import { WiHumidity } from 'react-icons/wi'
import { SlVolume2 } from 'react-icons/sl'
import { SlVolumeOff } from 'react-icons/sl'
import { AiOutlinePercentage } from 'react-icons/ai'
import { RiCelsiusLine } from 'react-icons/ri'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
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
  const [ringtone, setRingtone] = useState(0)
  const [volume, setVolume] = useState(2)
  const [soundDuration, setSoundDuration] = useState(0)
  const debouncedSoundDuration = useDebounce(soundDuration, 300)
  const [volumeMapper, setVolumeMapper] = useState({})
  const volumeLabels = Object.keys(volumeMapper).filter((key) => {
    return volumeMapper[key] != -1 && volumeMapper[key] !== undefined
  })
  const [selectedVolumeLabel, setSelectedVolumeLabel] = useState(
    volumeLabels[0]
  )
  const [volumeIcon, setVolumeIcon] = useState(volume_off)

  useEffect(() => {
    setStatus(device.attributes.status)
    if (device.attributes.status == 'ON') {
      setVolumeIcon(volume_on)
    } else {
      setVolumeIcon(volume_off)
    }
    setTemperature(device.attributes.temperature)
    setHumidity(device.attributes.humidity)
    setRingtone(device.attributes.ringtone)
    setVolume(device.attributes.volume)
    setVolumeMapper(device.attributes.volume_mapper)
    setSoundDuration(device.attributes.sound_duration)
  }, [device])

  useEffect(() => {
    const findedLabel =
      Object.keys(volumeMapper).find((label) => {
        return volumeMapper[label] == volume
      }) || 'unknown'

    setSelectedVolumeLabel(findedLabel)
  }, [volumeMapper])

  useEffect(() => {
    if (debouncedSoundDuration == 0) {
      return
    }
    updateAlarmOptions(ringtone, volume, debouncedSoundDuration)
  }, [debouncedSoundDuration])

  const sendChangePower = async (powerStatus) => {
    try {
      const response = await axios.post(
        `/smartSirenAlarm/power?status=${powerStatus}&device_id=${device.id}`
      )
    } catch (error) {
      console.log(error)
    }
  }

  const updateAlarmOptions = async (newRingtone, newVolume, newDuration) => {
    try {
      const response = await axios.post(
        `/smartSirenAlarm/options?new_sound=${newRingtone}&new_volume=${newVolume}&new_duration=${newDuration}&device_id=${device.id}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  let ringtonesArray = []
  for (let i = 1; i <= device.attributes.nr_of_ringtones; i++) {
    ringtonesArray.push(i)
  }
  return (
    <div className='smart-siren'>
      <div className='siren-sensors'>
        <div
          className={
            device.attributes.temp_hum_sensor
              ? 'siren-sensor-item siren-temp-item'
              : 'hidden'
          }
        >
          <FaTemperatureLow size={26} color='red' />
          <p>{temperature} </p>
          <RiCelsiusLine size={20} color='black' className='celsius-icon' />
        </div>
        <div
          className={
            device.attributes.temp_hum_sensor ? 'siren-sensor-item' : 'hidden'
          }
        >
          <WiHumidity size={35} color='blue' />
          <p>{humidity}</p>
          <AiOutlinePercentage size={20} />
        </div>
      </div>
      <div className='siren-control'>
        <div className='siren-option'>
          <div className='form-input-group'>
            <label htmlFor='siren-select-sound-type'>Sound Type</label>
            <Dropdown
              id='siren-select-sound-type'
              value={ringtone}
              options={ringtonesArray}
              onChange={(e) => {
                setRingtone(e.target.value)
                updateAlarmOptions(
                  e.target.value,
                  volume,
                  debouncedSoundDuration
                )
              }}
            />
          </div>
        </div>
        <div
          className={status == 'ON' ? 'siren-btn siren-active' : 'siren-btn'}
          onClick={() => sendChangePower('TOGGLE')}
        >
          {volumeIcon}
          <p
            className={
              status == 'ON' ? 'siren-btn-info siren-active' : 'siren-btn-info'
            }
          >
            Tap To Toggle
          </p>
        </div>
        <div className='siren-option'>
          <div className='form-input-group'>
            <label htmlFor='siren-sound-duration-input'>{'Duration (s)'}</label>
            <InputNumber
              id='siren-sound-duration-input'
              min={2}
              max={120}
              placeholder='Duration (s)'
              value={soundDuration}
              onValueChange={(e) => {
                setSoundDuration(e.value)
              }}
            />
          </div>
        </div>
      </div>
      <div className='siren-volume'>
        <label htmlFor='siren-volume-dropdown'>Volume</label>
        <Dropdown
          id='siren-volume-dropdown'
          value={selectedVolumeLabel}
          options={volumeLabels}
          optionLabel='name'
          onChange={(e) => {
            setSelectedVolumeLabel(e.value)
            updateAlarmOptions(
              ringtone,
              volumeMapper[e.value],
              debouncedSoundDuration
            )
          }}
        />
      </div>
    </div>
  )
}

export default SmartSirenAlarm
