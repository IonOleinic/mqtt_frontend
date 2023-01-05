import React, { useState, useEffect } from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import { Datepicker, setOptions } from '@mobiscroll/react'
import { app } from '../../api/api'
import './AddSchedule.css'
setOptions({
  theme: 'ios',
  themeVariant: 'light',
})
function AddSchedule() {
  const [time, setTime] = useState()
  const [dayOfWeek, setDayOfWeek] = useState([-1])
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
    try {
      let response = await app.post(
        `/schedule?device_id=${deviceId}&dayOfWeek=${dayOfWeek.toString()}&hour=${time.getHours()}&minute=${time.getMinutes()}&state=${state}&socket_nr=1`
      )
      console.log(response.data)
    } catch (error) {
      console.log(error)
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
  })
  return (
    <div className='add-schedule-container'>
      <div className='form-group mt-3'>
        <select
          value={deviceId}
          id='select-state'
          className='form-select select-type'
          aria-label='Default select example'
          onChange={(e) => {
            setDeviceId(e.target.value)
          }}
        >
          {devices.map((device) => {
            return <option value={device.id}>{device.name}</option>
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
            setSun(!fri)
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
            setSun(!sat)
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
      <Datepicker
        controls={['time']}
        timeFormat='HH:mm'
        value={time}
        inputProps={{
          label: '24 hour picker',
          labelStyle: 'stacked',
          inputStyle: 'outline',
          placeholder: 'Please Select...',
        }}
        onChange={(ev) => {
          setTime(ev.value)
        }}
      />
      <div className='d-grid gap-2 mt-3'>
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
    </div>
  )
}

export default AddSchedule
