import { useEffect, useState } from 'react'
import { FaTemperatureHalf } from 'react-icons/fa6'
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
  const [volume, setVolume] = useState(0)
  const [soundDuration, setSoundDuration] = useState(0)
  const debouncedSoundDuration = useDebounce(soundDuration, 300)
  const [volumeIcon, setVolumeIcon] = useState(volume_off)
  const [volumeMapper, setVolumeMapper] = useState([])
  const [selectedVolume, setSelectedVolume] = useState({
    name: 'low',
    code: -1,
  })

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
    const findedVolume = volumeMapper.find((item) => item.code == volume)
    if (findedVolume) {
      setSelectedVolume(findedVolume)
    } else {
      setSelectedVolume(volumeMapper[0])
    }
  }, [volume, volumeMapper])

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
      <div
        className={
          device.attributes.temp_hum_sensor
            ? 'siren-sensors'
            : 'siren-sensors siren-sensors-hidden'
        }
      >
        <div className='siren-sensor-item'>
          <FaTemperatureHalf size={25} color='red' />
          <p style={{ margin: '0 2px' }}>{temperature} </p>
          <RiCelsiusLine size={18} color='black' />
        </div>
        <div className='siren-sensor-item'>
          <WiHumidity size={35} color='blue' />
          <p>{humidity}</p>
          <AiOutlinePercentage size={20} />
        </div>
      </div>
      <div className='siren-control'>
        <div className='siren-option'>
          <label htmlFor='siren-select-sound-type'>Sound Type</label>
          <Dropdown
            id='siren-select-sound-type'
            value={ringtone}
            options={ringtonesArray}
            onChange={(e) => {
              setRingtone(e.target.value)
              updateAlarmOptions(e.target.value, volume, debouncedSoundDuration)
            }}
          />
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
      <div className='siren-volume'>
        <label htmlFor='siren-volume-dropdown'>Volume</label>
        <Dropdown
          id='siren-volume-dropdown'
          value={selectedVolume}
          options={volumeMapper}
          optionLabel='name'
          onChange={(e) => {
            updateAlarmOptions(ringtone, e.value?.code, debouncedSoundDuration)
          }}
        />
      </div>
    </div>
  )
}

export default SmartSirenAlarm
