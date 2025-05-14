import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import SubSceneSmartSwitch from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartSwitch'
import SubSceneSirenAlarm from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSirenAlarm'
import SubSceneSmartIR from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartIR'
import SubSceneSmartLed from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartLed'
import './AddSchedule.css'

function AddSchedule() {
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  //validation info
  const [errorMsg, setErrorMsg] = useState('')
  const [errorVisibility, setErrorVisibility] = useState(false)

  //time
  const [time, setTime] = useState(new Date(Date.now() + 60 * 1000))
  const [dayOfWeek, setDayOfWeek] = useState([])
  const [devices, setDevices] = useState([])
  const [mon, setMon] = useState(false)
  const [tue, setTue] = useState(false)
  const [wed, setWed] = useState(false)
  const [thu, setThu] = useState(false)
  const [fri, setFri] = useState(false)
  const [sat, setSat] = useState(false)
  const [sun, setSun] = useState(false)

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
  const createSchedule = async (e) => {
    e.preventDefault()
    if (checkAllFields() == false) {
      return
    }
    let scene = {}
    scene.name = name
      ? name
      : 'schedule_' + Math.random().toString(16).slice(2, 7)
    scene.scene_type = 'schedule'
    scene.exec_device_id = selectedDevice.id
    scene.executable_topic = executableTopic
    scene.executable_payload = executablePayload
    scene.executable_text = executableText
    let attributes = {}
    attributes.dayOfWeek = dayOfWeek.toString()
    attributes.hour = time.getHours()
    attributes.minute = time.getMinutes()
    scene.attributes = attributes
    try {
      await axios.post(`/scene`, scene)
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
      case 'smartSwitch':
        subScene = (
          <SubSceneSmartSwitch
            key={device.id}
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
            key={device.id}
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
            key={device.id}
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
            key={device.id}
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
  }, [time, dayOfWeek, selectedDevice, name])

  return (
    <div className='add-form-container'>
      <form className='add-form' onSubmit={createSchedule}>
        <div className='add-form-content'>
          <h3 className='add-form-title'>Add Schedule</h3>
          <div className='add-form-inputs'>
            <div className='form-input-group'>
              <label htmlFor='add-schedule-name-input'>Name</label>
              <InputText
                id='add-schedule-name-input'
                type='text'
                placeholder='Schedule name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
            </div>
            <div className='form-input-group'>
              <label htmlFor='add-schedule-device-dropdown'>Device</label>
              <Dropdown
                id='add-schedule-device-dropdown'
                value={selectedDevice}
                optionLabel='name'
                placeholder='Select a device'
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
            <div className='form-input-group'>
              <label htmlFor='add-schedule-input-repeat-days'>Repeat</label>
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
            <div className='form-input-group'>
              <label htmlFor='add-schedule-calendar-timeonly'>Time</label>
              <Calendar
                id='add-schedule-calendar-timeonly'
                value={time}
                onChange={(e) => {
                  setTime(new Date(e.value))
                }}
                timeOnly
              />
            </div>
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
