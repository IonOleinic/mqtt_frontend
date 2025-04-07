import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown } from 'primereact/dropdown'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import SubSceneSmartStrip from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartStrip'
import SubSceneSirenAlarm from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSirenAlarm'
import SubSceneSmartIR from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartIR'
import SubSceneSmartLed from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartLed'
import SubSceneDoorSensor from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneDoorSensor'
import SubSceneMotionSensor from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneMotionSensor'
import './AddDeviceScene.css'
import { InputText } from 'primereact/inputtext'

function AddSchedule() {
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  //validation info
  const [errorMsg, setErrorMsg] = useState('')
  const [errorVisibility, setErrorVisibility] = useState(false)

  const [devices, setDevices] = useState([])
  const [selectedEventDevice, setSelectedEventDevice] = useState(undefined)
  const [invalidEventDevice, setInvalidEventDevice] = useState(false)
  const [invalidActionDevice, setInvalidActionDevice] = useState(false)
  const [selectedActionDevice, setSelectedActionDevice] = useState(undefined)

  const [conditionalPayload, setConditionalPayload] = useState('OFF')
  const [executablePayload, setExecutablePayload] = useState('OFF')
  const [conditionalTopic, setConditionalTopic] = useState('')
  const [executableTopic, setExecutableTopic] = useState('')
  const [conditionalText, setConditionalText] = useState('')
  const [executableText, setExecutableText] = useState('')
  const [subEventScene, setSubEventScene] = useState(<></>)
  const [subActionScene, setSubActionScene] = useState(<></>)

  const checkChoosedDevices = () => {
    if (conditionalTopic == '' || conditionalPayload == '') {
      setErrorVisibility(true)
      setErrorMsg('Device not implemented yet!')
      setInvalidEventDevice(true)
      return false
    }
    if (executableTopic == '' || executablePayload == '') {
      setErrorVisibility(true)
      setErrorMsg('Device not implemented yet!')
      setInvalidEventDevice(true)
      return false
    }
    return true
  }
  const checkAllFields = () => {
    if (!selectedEventDevice) {
      setErrorVisibility(true)
      setErrorMsg('Please select a device!')
      setInvalidEventDevice(true)
      return false
    }
    if (!selectedActionDevice) {
      setErrorVisibility(true)
      setErrorMsg('Please select a device!')
      setInvalidActionDevice(true)
      return false
    }
    if (selectedEventDevice && selectedActionDevice) {
      if (selectedEventDevice?.id == selectedActionDevice?.id) {
        setErrorVisibility(true)
        setErrorMsg('Event and Action device cannot be the same!')
        setInvalidEventDevice(true)
        setInvalidActionDevice(true)
        return false
      }
    }
    return true
  }
  const createDeviceScene = async (e) => {
    e.preventDefault()
    if (checkAllFields() == false) {
      return
    }
    if (checkChoosedDevices() == false) {
      return
    }
    let scene = {}
    scene.name = name ? name : 'scene_' + Math.random().toString(16).slice(2, 7)
    scene.scene_type = 'deviceScene'
    scene.exec_device_id = selectedActionDevice.id
    scene.executable_topic = executableTopic
    scene.executable_payload = executablePayload
    scene.executable_text = executableText
    let attributes = {}
    attributes.cond_device_mqtt = selectedEventDevice.mqtt_name
    attributes.cond_device_id = selectedEventDevice.id
    attributes.conditional_topic = conditionalTopic
    attributes.conditional_payload = conditionalPayload
    attributes.conditional_text = conditionalText
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
  useEffect(() => {
    getDevices()
  }, [])

  useEffect(() => {
    setErrorVisibility(false)
    setInvalidEventDevice(false)
    setInvalidActionDevice(false)
  }, [selectedEventDevice, selectedActionDevice])

  const chooseSubScene = (device, eventOrAction) => {
    let subScene = <></>
    switch (device.device_type) {
      case 'smartStrip':
        subScene = (
          <SubSceneSmartStrip
            device={device}
            setConditionalTopic={setConditionalTopic}
            setConditionalPayload={setConditionalPayload}
            setConditionalText={setConditionalText}
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
            setConditionalTopic={setConditionalTopic}
            setConditionalPayload={setConditionalPayload}
            setConditionalText={setConditionalText}
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
            setConditionalTopic={setConditionalTopic}
            setConditionalPayload={setConditionalPayload}
            setConditionalText={setConditionalText}
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
            setConditionalTopic={setConditionalTopic}
            setConditionalPayload={setConditionalPayload}
            setConditionalText={setConditionalText}
            setExecutableTopic={setExecutableTopic}
            setExecutablePayload={setExecutablePayload}
            setExecutableText={setExecutableText}
            eventOrAction={eventOrAction}
          />
        )
        break
      case 'smartDoorSensor':
        subScene = (
          <SubSceneDoorSensor
            device={device}
            setConditionalTopic={setConditionalTopic}
            setConditionalPayload={setConditionalPayload}
            setConditionalText={setConditionalText}
          />
        )
        break
      case 'smartMotionSensor':
        subScene = (
          <SubSceneMotionSensor
            device={device}
            setConditionalTopic={setConditionalTopic}
            setConditionalPayload={setConditionalPayload}
            setConditionalText={setConditionalText}
          />
        )
        break
      default:
        subScene = <></>
        break
    }
    return subScene
  }

  return (
    <div className='add-form-container'>
      <form className='add-form add-scene-form' onSubmit={createDeviceScene}>
        <div className='add-form-content'>
          <h3 className='add-form-title'>Add Device Scene</h3>
          <div className='add-form-inputs'>
            <div className='form-input-group'>
              <label htmlFor='device-scene-name'>Name</label>
              <InputText
                id='device-scene-name'
                type='text'
                placeholder='Scene name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
            </div>
            <div className='form-input-group'>
              <label htmlFor='select-event-device'>Event Device</label>
              <Dropdown
                id='select-event-device'
                value={selectedEventDevice}
                invalid={invalidEventDevice}
                optionLabel='name'
                placeholder='Select Event Device'
                options={devices}
                onChange={(e) => {
                  setSelectedEventDevice(e.value)
                  setConditionalTopic('')
                  setConditionalPayload('')
                  setConditionalText('')
                  setSubEventScene(chooseSubScene(e.value, 'event'))
                }}
              />
            </div>
            {subEventScene}
            <div className='form-input-group'>
              <label htmlFor='select-action-device'>Action Device</label>
              <Dropdown
                id='select-action-device'
                value={selectedActionDevice}
                invalid={invalidActionDevice}
                optionLabel='name'
                placeholder='Select Action Device'
                options={devices.filter((device) => {
                  return !device.read_only
                })}
                onChange={(e) => {
                  setSelectedActionDevice(e.value)
                  setExecutableTopic('')
                  setExecutablePayload('')
                  setExecutableText('')
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

export default AddSchedule
