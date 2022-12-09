import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './AddDevice.css'
import SubSwitch from './SubSwitch/SubSwitch'
import { app } from '../../api/api'
import SubIR from './SubIR/SubIR'

function AddDevice() {
  const navigate = useNavigate()
  const [deviceTypes, setDeviceTypes] = useState([])
  const [name, setName] = useState('')
  const [mqttName, setMqttName] = useState('')
  const [manufacter, setManufacter] = useState('')
  const [deviceType, setDeviceType] = useState('')
  const [groups, setGroups] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [props, setProps] = useState({})
  const [subDevice, setSubDevice] = useState(<></>)
  const [resultMessage, setResultMessage] = useState('')
  useEffect(() => {
    const get_all_types = async () => {
      let result = await app.get('/deviceTypes')
      setDeviceTypes(result.data)
    }
    get_all_types()
  }, [])
  const handleAddDevice = async () => {
    let device = {}
    device.name = name
    device.mqttName = mqttName
    device.manufacter = manufacter
    device.type = deviceType
    device.groups = groups
    device.iconUrl = iconUrl
    device.props = props
    try {
      let result = await app.post('/addDevice', device)
      setResultMessage(result.data.msg)
      if (result.data.Succes) {
        navigate('/devices')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const setSubProps = (props) => {
    console.log(props)
    setProps(props)
  }
  const choose_sub_device = (type) => {
    let subtype = <></>
    setDeviceType(type)
    switch (type) {
      case 'smartPlug':
        subtype = <SubSwitch setSubProps={setSubProps} />
        break
      case 'smartStrip':
        subtype = <SubSwitch setSubProps={setSubProps} />
        break
      case 'smartSwitch':
        subtype = <SubSwitch setSubProps={setSubProps} />
        break
      case 'smartIR':
        subtype = (
          <SubIR
            setSubProps={setSubProps}
            mqtt_name={mqttName}
            manufacter={manufacter}
          />
        )
        break
      case 'smartDoorSensor':
        subtype = <></>
        break
      case 'smartTempSensor':
        subtype = <></>
        break
      default:
        subtype = <></>
        break
    }
    setSubDevice(subtype)
  }
  return (
    <div className='Add-form-container'>
      <form className='Add-form'>
        <div className='Add-form-content'>
          <h3 className='Add-form-title'>Add Device</h3>
          <div className='form-group mt-3'>
            <label htmlFor='input-name'>Device Name</label>
            <input
              required={true}
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
              value={groups}
              onChange={(e) => {
                setGroups(e.target.value)
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
              value={iconUrl}
              onChange={(e) => {
                setIconUrl(e.target.value)
              }}
            />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='select-type'>Device Type</label>
            <select
              id='select-type'
              className='form-select select-type'
              aria-label='Default select example'
              onChange={(e) => {
                choose_sub_device(e.target.value)
                setProps({})
              }}
            >
              <option value='none'>None</option>
              {deviceTypes.map((deviceType, index) => {
                return (
                  <option key={index} value={deviceType}>
                    {deviceType}
                  </option>
                )
              })}
            </select>
            {subDevice}
          </div>
          <div className='d-grid gap-2 mt-3'>
            <button
              type='button'
              className='btn btn-primary btn-add-device'
              onClick={handleAddDevice}
            >
              Add
            </button>
          </div>
          <div className='d-grid gap-2 mt-3'>
            <p>{resultMessage}</p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddDevice
