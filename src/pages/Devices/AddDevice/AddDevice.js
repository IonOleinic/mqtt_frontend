import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { app } from '../../api/api'
import 'bootstrap/dist/css/bootstrap.min.css'
import './AddDevice.css'
import SubSwitch from './SubSwitch/SubSwitch'
import SubIR from './SubIR/SubIR'
import SubLed from './SubLed/SubLed'
import { Checkmark } from 'react-checkmark'
import { VscError } from 'react-icons/vsc'
import CheckMessage from '../../CheckMessage/CheckMessage'
import UseAnimations from 'react-useanimations'
import loading from 'react-useanimations/lib/loading'
let iconSucces = <Checkmark size='25px' color='green' />
let iconError = <VscError className='icon-inside' color='red' size='25px' />
let iconLoading = <UseAnimations animation={loading} size={40} />
function AddDevice() {
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
  const [mqttGroup, setMqttGroups] = useState('')
  const [img, setImg] = useState('')
  const [deviceType, setDeviceType] = useState('')
  const [attributes, setAttributes] = useState({})
  const [subDevice, setSubDevice] = useState(<></>)
  useEffect(() => {
    const get_all_types = async () => {
      let result = await app.get('/deviceTypes')
      console.log(result.data)
      setDeviceTypes(result.data)
    }
    get_all_types()
  }, [])
  useEffect(() => {
    setCheckmark(false)
  }, [deviceTypes, name, mqttName, deviceType, img, manufacter])
  const handleAddDevice = async () => {
    setIcon(iconLoading)
    setMessage('Adding...')
    setTextColor('black')
    setCheckmark(true)
    let device = {}
    device.name = name
    device.mqtt_name = mqttName
    device.manufacter = manufacter
    device.device_type = deviceType
    if (mqttGroup) {
      device.mqtt_group = ['General'].concat(mqttGroup.split(','))
    } else {
      device.mqtt_group = ['General']
    }
    device.img = img
    device.attributes = attributes
    try {
      let result = await app.post('/device', device)
      if (result.data.succes) {
        navigate('/devices')
      } else {
        setIcon(iconError)
        setTextColor('red')
        setMessage(result.data.msg)
      }
    } catch (error) {
      console.log(error)
      setIcon(iconError)
      setTextColor('red')
      setMessage('Error occured.Please Try again.')
    }
  }
  const setSubProps = (props) => {
    setAttributes(props)
  }
  const choose_sub_device = (type) => {
    let subtype = <></>
    setDeviceType(type)
    switch (type) {
      case 'smartPlug':
      case 'smartStrip':
      case 'smartSwitch':
        subtype = (
          <SubSwitch
            setSubProps={setSubProps}
            disable_add_btn={disable_add_btn}
          />
        )
        break
      case 'smartIR':
        subtype = (
          <SubIR
            setSubProps={setSubProps}
            mqtt_name={mqttName}
            manufacter={manufacter}
            disable_add_btn={disable_add_btn}
          />
        )
        break
      case 'smartDoorSensor':
        disable_add_btn(false)
        subtype = <></>
        break
      case 'smartTempSensor':
        disable_add_btn(false)
        subtype = <></>
        break
      case 'smartSirenAlarm':
        disable_add_btn(false)
        subtype = <></>
        break
      case 'smartMotionSensor':
        disable_add_btn(false)
        subtype = <></>
        break
      case 'smartLed':
        subtype = (
          <SubLed
            setSubProps={setSubProps}
            mqtt_name={mqttName}
            manufacter={manufacter}
            disable_add_btn={disable_add_btn}
          />
        )
        break
      default:
        subtype = <></>
        break
    }
    setSubDevice(subtype)
  }
  const disable_add_btn = (__bool) => {
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
            <input
              id='input-groups'
              type='text'
              className='form-control mt-1'
              placeholder='Living Room,etc'
              value={mqttGroup}
              onChange={(e) => {
                setMqttGroups(e.target.value)
              }}
            />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='input-icon'>Icon URL</label>
            <input
              id='input-icon'
              type='text'
              className='form-control mt-1'
              placeholder='img url'
              value={img}
              onChange={(e) => {
                setImg(e.target.value)
              }}
            />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='select-type'>Device Type</label>
            <select
              disabled={disabledTypeSelect}
              id='select-type'
              className='form-select select-type'
              aria-label='Default select example'
              onChange={(e) => {
                disable_add_btn(true)
                setAttributes({})
                choose_sub_device(e.target.value)
              }}
            >
              <option value='none'>None</option>
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
