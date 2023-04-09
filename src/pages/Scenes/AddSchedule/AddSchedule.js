import React, { useState, useEffect } from 'react'
import { app } from '../../api/api'
import 'react-times/css/material/default.css'
import './AddSchedule.css'
import { Checkmark } from 'react-checkmark'
import { VscError } from 'react-icons/vsc'
import CheckMessage from '../../CheckMessage/CheckMessage'
import UseAnimations from 'react-useanimations'
import loading from 'react-useanimations/lib/loading'
import TimePicker from 'react-times'

let iconSucces = <Checkmark size='25px' color='green' />
let iconError = <VscError className='icon-inside' color='red' size='25px' />
let iconLoading = <UseAnimations animation={loading} size={40} />
function AddSchedule() {
  //validation info
  const [checkmark, setCheckmark] = useState(false)
  const [icon, setIcon] = useState(iconLoading)
  const [message, setMessage] = useState('Loading...')
  const [textColor, setTextColor] = useState('black')

  const [time, setTime] = useState('00:00')
  const [name, setName] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState([])
  const [state, setState] = useState('OFF')
  const [devices, setDevices] = useState([])
  const [deviceId, setDeviceId] = useState('')
  const [mon, setMon] = useState(false)
  const [tue, setTue] = useState(false)
  const [wed, setWed] = useState(false)
  const [thu, setThu] = useState(false)
  const [fri, setFri] = useState(false)
  const [sat, setSat] = useState(false)
  const [sun, setSun] = useState(false)
  const create_schedule = async () => {
    console.log(dayOfWeek)
    setIcon(iconLoading)
    setMessage('Sending..')
    setTextColor('black')
    setCheckmark(true)
    try {
      let response = await app.post(
        `/schedule?device_id=${deviceId}&name=${name}&dayOfWeek=${dayOfWeek.toString()}&hour=${
          time.split(':')[0]
        }&minute=${time.split(':')[1]}&state=${state}&socket_nr=1`
      )
      if (response.data.Succes) {
        setIcon(iconSucces)
        setTextColor('black')
        setMessage('Schedule Added')
      } else {
        setIcon(iconError)
        setTextColor('red')
        setMessage('Server error.Please Try again.')
      }
    } catch (error) {
      console.log(error)
      setIcon(iconError)
      setTextColor('red')
      setMessage('Error occured.Please Try again.')
    }
  }
  async function get_all_devices(filter) {
    try {
      if (filter === undefined || filter === '') {
        filter = 'General'
      }
      let result = await app.get(`/devices?filter=${filter}`)
      setDevices(result.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    get_all_devices()
    let dateNow = new Date()
    setTime(`${dateNow.getHours()}:${dateNow.getMinutes()}`)
  }, [])
  useEffect(() => {
    setCheckmark(false)
  }, [time, deviceId, dayOfWeek, state, name])
  useEffect(() => {
    try {
      setDeviceId(devices[0].id)
    } catch (error) {
      console.log(error)
    }
  }, [devices])
  return (
    <div className='Add-form-container'>
      <form className='Add-form'>
        <div className='Add-form-content'>
          <h3 className='Add-form-title'>Add Schedule</h3>
          <div className='form-group mt-3'>
            <label htmlFor='schedule-name'>Name</label>
            <input
              id='schedule-name'
              type='text'
              className='form-control mt-1'
              placeholder='Schedule name'
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='select-device'>Device</label>
            <select
              value={deviceId}
              id='select-device'
              className='form-select select-type'
              aria-label='Default select example'
              onChange={(e) => {
                setDeviceId(e.target.value)
              }}
            >
              {devices.map((device) => {
                return (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                )
              })}
            </select>
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='select-state'>State</label>
            <select
              value={state}
              id='select-state'
              className='form-select select-type'
              aria-label='Default select example'
              onChange={(e) => {
                setState(e.target.value)
              }}
            >
              <option value='OFF'>OFF</option>
              <option value='ON'>ON</option>
            </select>
          </div>
          <div className='form-group mt-3 '>
            <label htmlFor='input-repeat-days'>Repeat</label>
            <div className='weekDays-selector'>
              <input
                type='checkbox'
                id='weekday-mon'
                className='weekday'
                checked={mon}
                onChange={() => {
                  setMon(!mon)
                  let temp = dayOfWeek
                  if (!mon) {
                    temp.push(1)
                  } else {
                    temp = dayOfWeek.filter((day) => day !== 1)
                  }
                  setDayOfWeek(temp)
                }}
              />
              <label htmlFor='weekday-mon'>Mon</label>
              <input
                type='checkbox'
                id='weekday-tue'
                className='weekday'
                checked={tue}
                onChange={() => {
                  setTue(!tue)
                  let temp = dayOfWeek
                  if (!tue) {
                    temp.push(2)
                  } else {
                    temp = dayOfWeek.filter((day) => day !== 2)
                  }
                  setDayOfWeek(temp)
                }}
              />
              <label htmlFor='weekday-tue'>Tues</label>
              <input
                type='checkbox'
                id='weekday-wed'
                className='weekday'
                checked={wed}
                onChange={() => {
                  setWed(!wed)
                  let temp = dayOfWeek
                  if (!wed) {
                    temp.push(3)
                  } else {
                    temp = dayOfWeek.filter((day) => day !== 3)
                  }
                  setDayOfWeek(temp)
                }}
              />
              <label htmlFor='weekday-wed'>Wed</label>
              <input
                type='checkbox'
                id='weekday-thu'
                className='weekday'
                checked={thu}
                onChange={() => {
                  setThu(!thu)
                  let temp = dayOfWeek
                  if (!thu) {
                    temp.push(4)
                  } else {
                    temp = dayOfWeek.filter((day) => day !== 4)
                  }
                  setDayOfWeek(temp)
                }}
              />
              <label htmlFor='weekday-thu'>Thurs</label>
              <input
                type='checkbox'
                id='weekday-fri'
                className='weekday'
                checked={fri}
                onChange={(e) => {
                  setFri(!fri)
                  let temp = dayOfWeek
                  if (!fri) {
                    temp.push(5)
                  } else {
                    temp = dayOfWeek.filter((day) => day !== 5)
                  }
                  setDayOfWeek(temp)
                }}
              />
              <label htmlFor='weekday-fri'>Fri</label>
              <input
                type='checkbox'
                id='weekday-sat'
                className='weekday'
                checked={sat}
                onChange={() => {
                  setSat(!sat)
                  let temp = dayOfWeek
                  if (!sat) {
                    temp.push(6)
                  } else {
                    temp = dayOfWeek.filter((day) => day !== 6)
                  }
                  setDayOfWeek(temp)
                }}
              />
              <label htmlFor='weekday-sat'>Sat</label>
              <input
                type='checkbox'
                id='weekday-sun'
                className='weekday'
                checked={sun}
                onChange={() => {
                  setSun(!sun)
                  let temp = dayOfWeek
                  if (!sun) {
                    console.log('pushed')
                    temp.push(0)
                  } else {
                    temp = dayOfWeek.filter((day) => day !== 0)
                    console.log('removed')
                  }
                  setDayOfWeek(temp)
                }}
              />
              <label htmlFor='weekday-sun'>Sun</label>
            </div>
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='select time'>Time</label>
            <TimePicker
              onTimeChange={(timeValue) => {
                setTime(`${timeValue.hour}:${timeValue.minute}`)
              }}
              minuteStep={1}
              time={time}
            />
          </div>
          <div className='form-group mt-3 btn-form-container'>
            <button
              id='btn-set-time-schedule'
              type='button'
              className='btn btn-primary btn-set-time-schedule'
              onClick={() => {
                console.log(time)
                create_schedule()
              }}
            >
              Set
            </button>
          </div>
          <div className='form-group mt-3'>
            <CheckMessage
              textColor={textColor}
              visibility={checkmark}
              icon={icon}
              message={message}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddSchedule
