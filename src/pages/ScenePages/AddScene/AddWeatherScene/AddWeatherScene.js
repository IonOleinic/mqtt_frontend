import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import SubSceneSmartStrip from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartStrip'
import SubSceneSirenAlarm from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSirenAlarm'
import SubSceneSmartIR from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartIR'
import SubSceneSmartLed from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartLed'
import useWeatherData from '../../../../hooks/useWeatherData'
import './AddWeatherScene.css'
import { InputNumber } from 'primereact/inputnumber'

function AddWeatherScene() {
  const axios = useAxiosPrivate()
  const { userLocation } = useWeatherData()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  // validation info
  const [errorMsg, setErrorMsg] = useState('')
  const [errorVisibility, setErrorVisibility] = useState(false)

  const [devices, setDevices] = useState([])
  const [comparisonSign, setComparisonSign] = useState('>=')
  const [targetTemperature, setTargetTemperature] = useState(10)
  //executable device
  const [selectedDevice, setSelectedDevice] = useState(undefined)
  const [invalidSelectedDevice, setInvalidSelectedDevice] = useState(false)
  const [executableTopic, setExecutableTopic] = useState('')
  const [executablePayload, setExecutablePayload] = useState('OFF')
  const [executableText, setExecutableText] = useState('')
  const [subActionScene, setSubActionScene] = useState(<></>)

  const checkAllFields = () => {
    if (!selectedDevice) {
      setErrorVisibility(true)
      setErrorMsg('Please select a device!')
      setInvalidSelectedDevice(true)
      return false
    }
    return true
  }
  const createWeatherScene = async (e) => {
    e.preventDefault()
    if (checkAllFields() == false) {
      return
    }
    let scene = {}
    scene.name = name
      ? name
      : 'weather_' + Math.random().toString(16).slice(2, 7)
    scene.scene_type = 'weather'
    scene.exec_device_id = selectedDevice.id
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
      setErrorVisibility(true)
      setErrorMsg(error.response.data?.msg || 'Server error.Please Try again.')
    }
  }
  async function getDevices() {
    try {
      let result = await axios.get(`/devices`)
      setDevices(result.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  const chooseSubScene = (device, eventOrAction) => {
    let subScene = <></>
    switch (device.device_type) {
      case 'smartStrip':
        subScene = (
          <SubSceneSmartStrip
            device={device}
            setExecutableTopic={setExecutableTopic}
            setExecutablePayload={setExecutablePayload}
            setExecutableText={setExecutableText}
            eventOrAction={eventOrAction}
          />
        )
        break
      case 'smartSirenAlarm':
        subScene = (
          <SubSceneSirenAlarm
            device={device}
            setExecutableTopic={setExecutableTopic}
            setExecutablePayload={setExecutablePayload}
            setExecutableText={setExecutableText}
            eventOrAction={eventOrAction}
          />
        )
        break
      case 'smartIR':
        subScene = (
          <SubSceneSmartIR
            device={device}
            setExecutableTopic={setExecutableTopic}
            setExecutablePayload={setExecutablePayload}
            setExecutableText={setExecutableText}
            eventOrAction={eventOrAction}
          />
        )
        break
      case 'smartLed':
        subScene = (
          <SubSceneSmartLed
            device={device}
            setExecutableTopic={setExecutableTopic}
            setExecutablePayload={setExecutablePayload}
            setExecutableText={setExecutableText}
            eventOrAction={eventOrAction}
          />
        )
        break
      default:
        subScene = <></>
        break
    }
    return subScene
  }
  useEffect(() => {
    getDevices()
  }, [])

  useEffect(() => {
    setErrorVisibility(false)
    setInvalidSelectedDevice(false)
  }, [selectedDevice, name])

  return (
    <div className='add-form-container'>
      <form className='add-form' onSubmit={createWeatherScene}>
        <div className='add-form-content'>
          <h3 className='add-form-title'>Add Weather Scene</h3>
          <div className='add-form-inputs'>
            <div className='form-input-group'>
              <label htmlFor='add-wheater-name-input'>Name</label>
              <InputText
                id='add-wheater-name-input'
                type='text'
                placeholder='Wheater scene name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
            </div>
            <div className='form-input-group-inline'>
              <div
                className='form-input-group'
                style={{
                  width: '45%',
                }}
              >
                <label htmlFor='add-wheater-sign-dropdown'>Sign</label>
                <Dropdown
                  id='add-wheater-sign-dropdown'
                  value={comparisonSign}
                  options={['>', '>=', '=', '<', '<=']}
                  placeholder='Select a sign'
                  onChange={(e) => {
                    setComparisonSign(e.target.value)
                  }}
                />
              </div>
              <div
                className='form-input-group'
                style={{
                  width: '45%',
                }}
              >
                <label htmlFor='add-wheater-temp-input'>Temperature</label>
                <InputNumber
                  id='add-wheater-temp-input'
                  type='Number'
                  min={-30}
                  max={50}
                  placeholder='Temperature'
                  value={targetTemperature}
                  onValueChange={(e) => {
                    setTargetTemperature(e.target.value)
                  }}
                />
              </div>
            </div>
            <div className='form-input-group'>
              <label htmlFor='add-weather-device-dropdown'>Device</label>
              <Dropdown
                id='add-weather-device-dropdown'
                optionLabel='name'
                placeholder='Select a device'
                value={selectedDevice}
                options={devices.filter((device) => {
                  return !device.read_only
                })}
                invalid={invalidSelectedDevice}
                onChange={(e) => {
                  setSelectedDevice(e.value)
                  setSubActionScene(chooseSubScene(e.value, 'action'))
                }}
              />
            </div>
            {subActionScene}
          </div>
          <div
            className={
              errorVisibility
                ? 'form-error-msg'
                : 'form-error-msg form-error-msg-hidden'
            }
          >
            <Message severity='error' text={errorMsg} />
          </div>
          <div className='form-input-group form-button-container'>
            <Button label='Set' />
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddWeatherScene
