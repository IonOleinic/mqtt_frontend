import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { VscError } from 'react-icons/vsc'
import CheckMessage from '../../../../components/CheckMessage/CheckMessage'
import UseAnimations from 'react-useanimations'
import loading from 'react-useanimations/lib/loading'
import { Calendar } from 'primereact/calendar'
import SubSceneSmartStrip from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartStrip'
import SubSceneSirenAlarm from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSirenAlarm'
import SubSceneSmartIR from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartIR'
import SubSceneSmartLed from '../../../../components/SceneComponents/AddSceneComponents/SubSceneDevice/SubSceneSmartLed'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import './AddSchedule.css'

let iconSucces = <IoIosCheckmarkCircleOutline size='25px' color='green' />
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
  const [deviceId, setDeviceId] = useState('')
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
    if (deviceId == '') {
      changeFieldStyle(device)
      return false
    }
    return true
  }
  const createSchedule = async () => {
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
      : 'schedule_' + Math.random().toString(16).slice(2, 7)
    scene.scene_type = 'schedule'
    scene.exec_device_id = deviceId
    scene.executable_topic = executableTopic
    scene.executable_payload = executablePayload
    scene.executable_text = executableText
    let attributes = {}
    attributes.dayOfWeek = dayOfWeek.toString()
    attributes.hour = time.getHours()
    attributes.minute = time.getMinutes()
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
  }, [time, dayOfWeek, deviceId, name])
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
                setSubActionDevice(chooseSubDevice(e.target.value, 'action'))
                revertFieldStyle(e.target)
              }}
            >
              <option value=''>None</option>
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
          <div className='form-group mt-3 btn-form-container'>
            <button
              id='btn-set-time-schedule'
              type='button'
              className='btn btn-primary btn-set-scene'
              onClick={() => {
                createSchedule()
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
