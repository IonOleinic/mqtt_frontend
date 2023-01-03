import React, { useState, useEffect } from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import { Datepicker, setOptions } from '@mobiscroll/react'
import { app } from '../../api/api'
setOptions({
  theme: 'ios',
  themeVariant: 'light',
})

function Scene({ mqtt_name }) {
  const [time, setTime] = useState()
  const [state, setState] = useState('OFF')
  const [devices, setDevices] = useState([])
  const [deviceId, setDeviceId] = useState('')
  const create_schedule = async () => {
    try {
      let response = await app.post(
        `/schedule?device_id=${deviceId}&dayOfWeek=0,1,2,3,4,5,6&hour=${time.getHours()}&minute=${time.getMinutes()}&state=${state}&socket_nr=1`
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
    <div className='scene'>
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

export default Scene
