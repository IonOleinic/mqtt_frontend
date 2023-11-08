import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import './AddDeviceScene.css'
import { Checkmark } from 'react-checkmark'
import { VscError } from 'react-icons/vsc'
import CheckMessage from '../../CheckMessage/CheckMessage'
import UseAnimations from 'react-useanimations'
import loading from 'react-useanimations/lib/loading'
import SubSceneSmartStrip from '../SubSceneDevice/SubSceneSmartStrip'
import SubSceneDoorSensor from '../SubSceneDevice/SubSceneDoorSensor'
import SubSceneSirenAlarm from '../SubSceneDevice/SubSceneSirenAlarm'
import SubSceneSmartIR from '../SubSceneDevice/SubSceneSmartIR'
import SubSceneSmartLed from '../SubSceneDevice/SubSceneSmartLed'
import SubSceneMotionSensor from '../SubSceneDevice/SubSceneMotionSensor'

let iconSucces = <Checkmark size='25px' color='green' />
let iconError = <VscError className='icon-inside' color='red' size='25px' />
let iconLoading = <UseAnimations animation={loading} size={40} />
function AddSchedule() {
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  //validation info
  const [checkmark, setCheckmark] = useState(false)
  const [icon, setIcon] = useState(iconLoading)
  const [message, setMessage] = useState('Loading...')
  const [textColor, setTextColor] = useState('black')

  const [name, setName] = useState('')
  const [devices, setDevices] = useState([])
  const [eventDeviceId, setEventDeviceId] = useState('')
  const [eventDeviceMqtt, setEventDeviceMqtt] = useState('')
  const [actionDeviceId, setActionDeviceId] = useState('')
  const [conditionalPayload, setConditionalPayload] = useState('OFF')
  const [executablePayload, setExecutablePayload] = useState('OFF')
  const [conditionalTopic, setConditionalTopic] = useState('')
  const [executableTopic, setExecutableTopic] = useState('')
  const [conditionalText, setConditionalText] = useState('')
  const [executableText, setExecutableText] = useState('')
  const [subEventDevice, setSubEventDevice] = useState(<></>)
  const [subActionDevice, setSubActionDevice] = useState(<></>)

  const get_mqtt_name_by_id = (id) => {
    let filtered_devices = devices.filter((device) => device.id == id)
    return filtered_devices[0].mqtt_name
  }
  const checkChoosedDevices = () => {
    let event_device = document.getElementById('select-event-device')
    let action_device = document.getElementById('select-action-device')
    if (conditionalTopic == '' || conditionalPayload == '') {
      changeFieldStyle(event_device)
      return false
    }
    if (executableTopic == '' || executablePayload == '') {
      changeFieldStyle(action_device)
      return false
    }
    return true
  }
  const checkAllFields = () => {
    let event_device = document.getElementById('select-event-device')
    let action_device = document.getElementById('select-action-device')
    if (eventDeviceId == '') {
      changeFieldStyle(event_device)
      return false
    }
    if (actionDeviceId == '') {
      changeFieldStyle(action_device)
      return false
    }
    return true
  }
  const revertFieldStyle = (field) => {
    field.style.backgroundColor = '#fff'
  }
  const changeFieldStyle = (field) => {
    field.style.backgroundColor = 'pink'
  }
  const createDeviceScene = async () => {
    if (checkAllFields() == false) {
      setIcon(iconError)
      setMessage('Please complete all fields!')
      setTextColor('red')
      setCheckmark(true)
      return
    }
    if (checkChoosedDevices() == false) {
      setIcon(iconError)
      setMessage('Device not implemented yet!')
      setTextColor('red')
      setCheckmark(true)
      return
    }
    setIcon(iconLoading)
    setMessage('Sending..')
    setTextColor('black')
    setCheckmark(true)
    try {
      let scene = {}
      scene.name = name
      scene.scene_type = 'deviceScene'
      scene.exec_device_id = actionDeviceId
      scene.executable_topic = executableTopic
      scene.executable_payload = executablePayload
      scene.executable_text = executableText
      let attributes = {}
      attributes.cond_device_mqtt = eventDeviceMqtt
      attributes.cond_device_id = eventDeviceId
      attributes.conditional_topic = conditionalTopic
      attributes.conditional_payload = conditionalPayload
      attributes.conditional_text = conditionalText
      scene.attributes = attributes
      let response = await axios.post(`/scene?`, scene)
      if (response.data.succes) {
        setIcon(iconSucces)
        setTextColor('black')
        setMessage('Schedule Added')
        navigate('/scenes')
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
  async function getAllDevices(filter) {
    try {
      if (filter === undefined || filter === '') {
        filter = 'General'
      }
      let result = await axios.get(`/devices?filter=${filter}`)
      setDevices(result.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getAllDevices()
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

  const chooseSubDevice = (device_id, event_or_action) => {
    let sub_dev = <></>
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].id == device_id) {
        if (devices[i].device_type == 'smartStrip') {
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
        } else if (devices[i].device_type == 'smartLed') {
          sub_dev = (
            <SubSceneSmartLed
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
        } else if (devices[i].device_type == 'smartMotionSensor') {
          sub_dev = (
            <SubSceneMotionSensor
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
          <h3 className='Add-form-title'>Add Device Scene</h3>
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
                setEventDeviceMqtt(get_mqtt_name_by_id(e.target.value))
                setSubEventDevice(chooseSubDevice(e.target.value, 'event'))
                revertFieldStyle(e.target)
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
                setSubActionDevice(chooseSubDevice(e.target.value, 'action'))
                revertFieldStyle(e.target)
              }}
            >
              <option value=''>None</option>
              {devices.map((device) => {
                if (
                  device.read_only == false &&
                  device.id != eventDeviceId &&
                  device.mqtt_name != eventDeviceMqtt
                ) {
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
              className='btn btn-primary btn-set-scene'
              onClick={() => {
                createDeviceScene()
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
