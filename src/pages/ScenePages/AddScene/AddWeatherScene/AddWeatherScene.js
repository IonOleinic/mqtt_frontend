import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { VscError } from 'react-icons/vsc'
import CheckMessage from '../../../../components/CheckMessage/CheckMessage'
import UseAnimations from 'react-useanimations'
import loading from 'react-useanimations/lib/loading'
import SubSceneSmartStrip from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartStrip'
import SubSceneSirenAlarm from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSirenAlarm'
import SubSceneSmartIR from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartIR'
import SubSceneSmartLed from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartLed'
import useWeatherData from '../../../../hooks/useWeatherData'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import './AddWeatherScene.css'

let iconSucces = <IoIosCheckmarkCircleOutline size='25px' color='green' />
let iconError = <VscError className='icon-inside' color='red' size='25px' />
let iconLoading = <UseAnimations animation={loading} size={40} />

function AddWeatherScene() {
  const axios = useAxiosPrivate()
  const { userLocation } = useWeatherData()
  const navigate = useNavigate()
  //validation info
  const [checkmark, setCheckmark] = useState(false)
  const [icon, setIcon] = useState(iconLoading)
  const [message, setMessage] = useState('Loading...')
  const [textColor, setTextColor] = useState('black')

  const [name, setName] = useState('')
  const [devices, setDevices] = useState([])
  const [comparisonSign, setComparisonSign] = useState('>=')
  const [targetTemperature, setTargetTemperature] = useState(10)
  //executable device
  const [deviceId, setDeviceId] = useState(undefined)
  const [executableTopic, setExecutableTopic] = useState('')
  const [executablePayload, setExecutablePayload] = useState('OFF')
  const [executableText, setExecutableText] = useState('')
  const [subActionDevice, setSubActionDevice] = useState(<></>)

  const revertFieldStyle = (field) => {
    field.style.backgroundColor = '#fff'
  }
  const changeFieldStyle = (field) => {
    field.style.backgroundColor = 'pink'
  }
  const checkAllFields = () => {
    let device = document.getElementById('select-device')
    if (!deviceId) {
      changeFieldStyle(device)
      return false
    }
    return true
  }
  const createWeatherScene = async () => {
    setIcon(iconLoading)
    setMessage('Sending..')
    setTextColor('black')
    setCheckmark(true)
    if (checkAllFields() == false) {
      setIcon(iconError)
      setMessage('Please complete all fields !')
      setTextColor('red')
      setCheckmark(true)
      return
    }
    let scene = {}
    scene.name = name
      ? name
      : 'weather_' + Math.random().toString(16).slice(2, 7)
    scene.scene_type = 'weather'
    scene.exec_device_id = Number(deviceId)
    scene.executable_topic = executableTopic
    scene.executable_payload = executablePayload
    scene.executable_text = executableText
    let attributes = {}
    attributes.comparison_sign = comparisonSign
    attributes.target_temperature = targetTemperature
    attributes.location = userLocation
    scene.attributes = attributes
    try {
      let response = await axios.post(`/scene`, scene)
      navigate('/scenes')
    } catch (error) {
      console.log(error)
      setIcon(iconError)
      setTextColor('red')
      setMessage(error.response.data?.msg || 'Server error.Please Try again.')
    }
  }
  async function getAllDevices() {
    try {
      let result = await axios.get(`/devices`)
      setDevices(result.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  const chooseSubDevice = (device_id, event_or_action) => {
    let sub_dev = <></>
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].id == device_id) {
        if (devices[i].device_type == 'smartStrip') {
          sub_dev = (
            <SubSceneSmartStrip
              device={devices[i]}
              setExecutableTopic={setExecutableTopic}
              setExecutablePayload={setExecutablePayload}
              setExecutableText={setExecutableText}
              event_or_action={event_or_action}
            />
          )
        } else if (devices[i].device_type == 'smartSirenAlarm') {
          sub_dev = (
            <SubSceneSirenAlarm
              device={devices[i]}
              setExecutableTopic={setExecutableTopic}
              setExecutablePayload={setExecutablePayload}
              setExecutableText={setExecutableText}
              event_or_action={event_or_action}
            />
          )
        } else if (devices[i].device_type == 'smartIR') {
          sub_dev = (
            <SubSceneSmartIR
              device={devices[i]}
              setExecutableTopic={setExecutableTopic}
              setExecutablePayload={setExecutablePayload}
              setExecutableText={setExecutableText}
              event_or_action={event_or_action}
            />
          )
        } else if (devices[i].device_type == 'smartLed') {
          sub_dev = (
            <SubSceneSmartLed
              device={devices[i]}
              setExecutableTopic={setExecutableTopic}
              setExecutablePayload={setExecutablePayload}
              setExecutableText={setExecutableText}
              event_or_action={event_or_action}
            />
          )
        }
      }
    }
    return sub_dev
  }
  useEffect(() => {
    getAllDevices()
  }, [])
  useEffect(() => {
    setCheckmark(false)
  }, [deviceId, name])

  return (
    <div className='Add-form-container'>
      <form className='Add-form'>
        <div className='Add-form-content'>
          <h3 className='Add-form-title'>Add Weather Scene</h3>
          <div className='form-group mt-3'>
            <label htmlFor='wheater-scene-name'>Name</label>
            <input
              id='wheater-scene-name'
              type='text'
              className='form-control mt-1'
              placeholder='Wheater scene name'
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              className='form-group mt-3'
              style={{
                width: '45%',
              }}
            >
              <label htmlFor='select-comparison-sign'>Sign</label>
              <select
                id='select-comparison-sign'
                className='form-select select-type'
                aria-label='Default select example'
                onChange={(e) => {
                  setComparisonSign(e.target.value)
                }}
                value={comparisonSign}
              >
                <option value='>'>{'>'}</option>
                <option value='>='>{'>='}</option>
                <option value='='>{'='}</option>
                <option value='<'>{'<'}</option>
                <option value='<='>{'<='}</option>
              </select>
            </div>
            <div
              className='form-group mt-3'
              style={{
                width: '45%',
              }}
            >
              <label htmlFor='wheater-scene-temp'>Temperature</label>
              <input
                id='wheater-scene-temp'
                type='Number'
                min={-30}
                max={50}
                className='form-control mt-1'
                placeholder='Temperature'
                value={targetTemperature}
                onChange={(e) => {
                  setTargetTemperature(e.target.value)
                }}
              />
            </div>
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
                setSubActionDevice(chooseSubDevice(e.target.value, 'action'))
                revertFieldStyle(e.target)
              }}
            >
              <option value={undefined}>None</option>
              {devices.map((device) => {
                if (device.read_only == false)
                  return (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  )
              })}
            </select>
          </div>
          {subActionDevice}
          <div className='form-group mt-3 btn-form-container'>
            <button
              id='btn-set-scene'
              type='button'
              className='btn btn-primary btn-set-scene'
              onClick={() => {
                createWeatherScene()
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

export default AddWeatherScene
