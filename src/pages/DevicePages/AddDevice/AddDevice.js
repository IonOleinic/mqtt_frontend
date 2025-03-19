import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import SubSwitch from '../../../components/DeviceComponents/AddDeviceComponents/SubSwitch/SubSwitch'
import SubIR from '../../../components/DeviceComponents/AddDeviceComponents/SubIR/SubIR'
import SubLed from '../../../components/DeviceComponents/AddDeviceComponents/SubLed/SubLed'
import { VscError } from 'react-icons/vsc'
import CheckMessage from '../../../components/CheckMessage/CheckMessage'
import UseAnimations from 'react-useanimations'
import loading from 'react-useanimations/lib/loading'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import './AddDevice.css'
import { set } from 'lodash'

let iconSucces = <IoIosCheckmarkCircleOutline size='25px' color='green' />
let iconError = <VscError className='icon-inside' color='red' size='25px' />
let iconLoading = <UseAnimations animation={loading} size={40} />
function AddDevice() {
  const axios = useAxiosPrivate()
  //validation info
  const [checkmark, setCheckmark] = useState(false)
  const [icon, setIcon] = useState(iconLoading)
  const [message, setMessage] = useState('Loading...')
  const [textColor, setTextColor] = useState('black')

  const navigate = useNavigate()
  const [disabledAddBtn, setDisabledAddBtn] = useState(true)
  const [disabledTypeSelect, setDisabledTypeSelect] = useState(true)
  const [deviceTypes, setDeviceTypes] = useState([])
  const [name, setName] = useState('')
  const [mqttName, setMqttName] = useState('')
  const [manufacter, setManufacter] = useState('tasmota')
  const [groupId, setGroupId] = useState(undefined)
  const [groups, setGroups] = useState([])
  const [deviceType, setDeviceType] = useState('')
  const [attributes, setAttributes] = useState({})
  const [subDevice, setSubDevice] = useState(<></>)

  const getDeviceTypes = async () => {
    try {
      let result = await axios.get('/deviceTypes')
      setDeviceTypes(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getGroups = async () => {
    try {
      let result = await axios.get('/groups')
      setGroups(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getDeviceTypes()
    getGroups()
  }, [])
  useEffect(() => {
    setCheckmark(false)
  }, [deviceTypes, name, mqttName, deviceType, manufacter])
  const handleAddDevice = async () => {
    setIcon(iconLoading)
    setMessage('Adding...')
    setTextColor('black')
    setCheckmark(true)
    let device = {}
    device.name = name
      ? name
      : 'device_' + Math.random().toString(16).slice(2, 7)
    device.mqtt_name = mqttName
    device.manufacter = manufacter
    device.device_type = deviceType
    device.group_id = Number(groupId)
    device.attributes = attributes

    try {
      let response = await axios.post('/device', device)
      navigate('/devices')
    } catch (error) {
      console.log(error)
      setIcon(iconError)
      setTextColor('red')
      setMessage(
        error.response.data?.msg || 'Error occured!. Please try again.'
      )
    }
  }
  const setSubProps = (props) => {
    setAttributes(props)
  }
  const chooseSubDevice = (type) => {
    let subtype = <></>
    setDeviceType(type)
    switch (type) {
      case 'smartPlug':
      case 'smartStrip':
      case 'smartSwitch':
      case 'smartValve':
        subtype = (
          <SubSwitch
            setSubProps={setSubProps}
            disable_add_btn={disableAddBtn}
          />
        )
        break
      case 'smartIR':
        subtype = (
          <SubIR
            setSubProps={setSubProps}
            mqtt_name={mqttName}
            manufacter={manufacter}
            disable_add_btn={disableAddBtn}
          />
        )
        break
      case 'smartDoorSensor':
        disableAddBtn(false)
        subtype = <></>
        break
      case 'smartTempSensor':
        disableAddBtn(false)
        subtype = <></>
        break
      case 'smartSirenAlarm':
        disableAddBtn(false)
        subtype = <></>
        break
      case 'smartMotionSensor':
        disableAddBtn(false)
        subtype = <></>
        break
      case 'smartLed':
        subtype = (
          <SubLed
            setSubProps={setSubProps}
            mqtt_name={mqttName}
            manufacter={manufacter}
            disable_add_btn={disableAddBtn}
          />
        )
        break
      default:
        subtype = <></>
        setDisabledAddBtn(true)
        break
    }
    setSubDevice(subtype)
  }
  const disableAddBtn = (__bool) => {
    setDisabledAddBtn(__bool)
  }

  return (
    <div className='Add-form-container'>
      <form className='Add-form'>
        <div className='Add-form-content'>
          <h3 className='Add-form-title'>Add Device</h3>
          <div className='form-group mt-3'>
            <label htmlFor='input-name'>Device Name</label>
            <input
              id='input-name'
              type='text'
              className='form-control mt-1'
              placeholder='Device name'
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='select-manufacter'>Manufacter</label>
            <select
              id='select-manufacter'
              className='form-select select-type'
              aria-label='Default select example'
              onChange={(e) => {
                setManufacter(e.target.value)
              }}
            >
              <option value='tasmota'>Tasmota</option>
              <option value='openBeken'>Open Beken</option>
            </select>
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='input-mqtt'>
              MQTT Name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              required={true}
              id='input-mqtt'
              type='text'
              className='form-control mt-1'
              placeholder='mqtt topic *(unique)'
              value={mqttName}
              onChange={(e) => {
                setMqttName(e.target.value)
                if (e.target.value.length > 3 && e.target.value.length < 30) {
                  setDisabledTypeSelect(false)
                } else {
                  setDisabledTypeSelect(true)
                }
              }}
            />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='input-groups'>Groups</label>
            <select
              id='select-manufacter'
              className='form-select select-type'
              aria-label='Default select example'
              onChange={(e) => {
                setGroupId(e.target.value)
              }}
            >
              <option value={undefined}>None</option>
              {groups.map((group) => {
                return (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                )
              })}
            </select>
          </div>
          <div className='form-group mt-3'></div>
          <div className='form-group mt-3'>
            <label htmlFor='select-type'>Device Type</label>
            <select
              disabled={disabledTypeSelect}
              id='select-type'
              className='form-select select-type'
              aria-label='Default select example'
              onChange={(e) => {
                disableAddBtn(true)
                setAttributes({})
                chooseSubDevice(e.target.value)
              }}
            >
              <option value={undefined}>None</option>
              {Object.keys(deviceTypes).map((deviceType) => {
                return (
                  <option key={deviceType} value={deviceTypes[deviceType]}>
                    {deviceType}
                  </option>
                )
              })}
            </select>
            {subDevice}
          </div>
          <div className='form-group mt-3 btn-form-container'>
            <button
              id='btn-add-dev'
              disabled={disabledAddBtn}
              type='button'
              className='btn btn-primary btn-add-device'
              onClick={handleAddDevice}
            >
              Add
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

export default AddDevice
