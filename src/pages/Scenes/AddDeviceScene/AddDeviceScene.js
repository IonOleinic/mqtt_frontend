import React, { useState, useEffect } from 'react'
import { app } from '../../api/api'
import './AddDeviceScene.css'
import { Checkmark } from 'react-checkmark'
import { VscError } from 'react-icons/vsc'
import CheckMessage from '../../CheckMessage/CheckMessage'
import UseAnimations from 'react-useanimations'
import loading from 'react-useanimations/lib/loading'
import SubSceneSmartStrip from './SubSceneDevice/SubSceneSmartStrip'
import SubSceneDoorSensor from './SubSceneDevice/SubSceneDoorSensor'
import SubSceneSirenAlarm from './SubSceneDevice/SubSceneSirenAlarm'
import SubSceneSmartIR from './SubSceneDevice/SubSceneSmartIR'

let iconSucces = <Checkmark size='25px' color='green' />
let iconError = <VscError className='icon-inside' color='red' size='25px' />
let iconLoading = <UseAnimations animation={loading} size={40} />
function AddSchedule() {
  //validation info
  const [checkmark, setCheckmark] = useState(false)
  const [icon, setIcon] = useState(iconLoading)
  const [message, setMessage] = useState('Loading...')
  const [textColor, setTextColor] = useState('black')

  const [name, setName] = useState('')
  const [devices, setDevices] = useState([])
  const [eventDeviceId, setEventDeviceId] = useState('')
  const [actionDeviceId, setActionDeviceId] = useState('')
  const [conditionalPayload, setConditionalPayload] = useState('OFF')
  const [executablePayload, setExecutablePayload] = useState('OFF')
  const [conditionalTopic, setConditionalTopic] = useState('')
  const [executableTopic, setExecutableTopic] = useState('')
  const [conditionalText, setConditionalText] = useState('')
  const [executableText, setExecutableText] = useState('')
  const [subEventDevice, setSubEventDevice] = useState(<></>)
  const [subActionDevice, setSubActionDevice] = useState(<></>)

  const check_choosed_devices = () => {
    let event_device = document.getElementById('select-event-device')
    let action_device = document.getElementById('select-action-device')
    if (conditionalTopic == '' || conditionalPayload == '') {
      change_field_style(event_device)
      return false
    }
    if (executableTopic == '' || executablePayload == '') {
      change_field_style(action_device)
      return false
    }
    return true
  }
  const check_all_fields = () => {
    let scene_name = document.getElementById('device-scene-name')
    let event_device = document.getElementById('select-event-device')
    let action_device = document.getElementById('select-action-device')
    if (name == '') {
      change_field_style(scene_name)
      return false
    }
    if (eventDeviceId == '') {
      change_field_style(event_device)
      return false
    }
    if (actionDeviceId == '') {
      change_field_style(action_device)
      return false
    }
    return true
  }
  const revert_field_style = (field) => {
    field.style.backgroundColor = '#fff'
  }
  const change_field_style = (field) => {
    field.style.backgroundColor = 'pink'
  }
  const create_device_scene = async () => {
    if (check_all_fields() == false) {
      setIcon(iconError)
      setMessage('Please complete all fields !')
      setTextColor('red')
      setCheckmark(true)
      return
    }
    if (check_choosed_devices() == false) {
      setIcon(iconError)
      setMessage('Device not implemented yet !')
      setTextColor('red')
      setCheckmark(true)
      return
    }
    setIcon(iconLoading)
    setMessage('Sending..')
    setTextColor('black')
    setCheckmark(true)
    try {
      let response = await app.post(
        `/deviceScene?name=${name}&cond_device_id=${eventDeviceId}&exec_device_id=${actionDeviceId}&conditional_topic=${conditionalTopic}&conditional_payload=${conditionalPayload}&executable_topic=${executableTopic}&executable_payload=${executablePayload}&conditional_text=${conditionalText}&executable_text=${executableText}`
      )
      if (response.data.succes) {
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
  }, [])
  useEffect(() => {
    setCheckmark(false)
  }, [
    eventDeviceId,
    actionDeviceId,
    conditionalPayload,
    executablePayload,
    name,
  ])

  const choose_sub_device = (device_id, event_or_action) => {
    let sub_dev = <></>
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].id == device_id) {
        if (
          devices[i].device_type == 'smartStrip' ||
          devices[i].device_type == 'smartSwitch'
        ) {
          sub_dev = (
            <SubSceneSmartStrip
              device={devices[i]}
              setConditionalTopic={setConditionalTopic}
              setConditionalPayload={setConditionalPayload}
              setExecutableTopic={setExecutableTopic}
              setExecutablePayload={setExecutablePayload}
              setConditionalText={setConditionalText}
              setExecutableText={setExecutableText}
              event_or_action={event_or_action}
            />
          )
        } else if (devices[i].device_type == 'smartDoorSensor') {
          sub_dev = (
            <SubSceneDoorSensor
              device={devices[i]}
              setConditionalTopic={setConditionalTopic}
              setConditionalPayload={setConditionalPayload}
              setConditionalText={setConditionalText}
            />
          )
        } else if (devices[i].device_type == 'smartSirenAlarm') {
          sub_dev = (
            <SubSceneSirenAlarm
              device={devices[i]}
              setConditionalTopic={setConditionalTopic}
              setConditionalPayload={setConditionalPayload}
              setExecutableTopic={setExecutableTopic}
              setExecutablePayload={setExecutablePayload}
              setConditionalText={setConditionalText}
              setExecutableText={setExecutableText}
              event_or_action={event_or_action}
            />
          )
        } else if (devices[i].device_type == 'smartIR') {
          sub_dev = (
            <SubSceneSmartIR
              device={devices[i]}
              setConditionalTopic={setConditionalTopic}
              setConditionalPayload={setConditionalPayload}
              setExecutableTopic={setExecutableTopic}
              setExecutablePayload={setExecutablePayload}
              setConditionalText={setConditionalText}
              setExecutableText={setExecutableText}
              event_or_action={event_or_action}
            />
          )
        }
      }
    }
    return sub_dev
  }
  return (
    <div className='Add-form-container'>
      <form className='Add-form'>
        <div className='Add-form-content'>
          <h3 className='Add-form-title'>Add Scene</h3>
          <div className='form-group mt-3'>
            <label htmlFor='device-scene-name'>Name</label>
            <input
              id='device-scene-name'
              type='text'
              className='form-control mt-1'
              placeholder='Scene name'
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                revert_field_style(e.target)
              }}
            />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='select-event-device'>Event Device</label>
            <select
              value={eventDeviceId}
              id='select-event-device'
              className='form-select select-type'
              aria-label='Default select example'
              onChange={(e) => {
                setConditionalTopic('')
                setConditionalPayload('')
                setEventDeviceId(e.target.value)
                setSubEventDevice(choose_sub_device(e.target.value, 'event'))
                revert_field_style(e.target)
              }}
            >
              <option value=''>None</option>
              {devices.map((device) => {
                return (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                )
              })}
            </select>
          </div>
          {subEventDevice}
          <div className='form-group mt-3'>
            <label htmlFor='select-action-device'>Action Device</label>
            <select
              value={actionDeviceId}
              id='select-action-device'
              className='form-select select-type'
              aria-label='Default select example'
              onChange={(e) => {
                setExecutableTopic('')
                setExecutablePayload('')
                setActionDeviceId(e.target.value)
                setSubActionDevice(choose_sub_device(e.target.value, 'action'))
                revert_field_style(e.target)
              }}
            >
              <option value=''>None</option>
              {devices.map((device) => {
                if (device.read_only == false && device.id != eventDeviceId) {
                  return (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  )
                }
              })}
            </select>
          </div>
          {subActionDevice}
          <div className='form-group mt-3 btn-form-container'>
            <button
              id='btn-set-time-schedule'
              type='button'
              className='btn btn-primary btn-set-time-schedule'
              onClick={() => {
                create_device_scene()
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
