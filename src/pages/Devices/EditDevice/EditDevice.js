import './EditDevice.css'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { app } from '../../api/api'
import 'bootstrap/dist/css/bootstrap.min.css'
function EditDevice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [device, setDevice] = useState({})
  const [disabledModifyBtn, setDisabledModifyBtn] = useState(true)
  const [name, setName] = useState('')
  const [mqttName, setMqttName] = useState('')
  const [manufacter, setManufacter] = useState('')
  const [resultMessage, setResultMessage] = useState('')
  const [groups, setGroups] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const get_device = async () => {
    try {
      let result = await app.get(`/device/${id}`)
      setDevice(result.data)
      setName(result.data.name)
      setMqttName(result.data.mqtt_name)
      setManufacter(result.data.manufacter)
      setGroups(result.data.mqtt_group.toString())
      setIconUrl(result.data.img)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    get_device()
  }, [])
  const handleModifyDevice = async () => {
    setDisabledModifyBtn(true)
    let new_device = device
    new_device.name = name
    new_device.mqttName = mqttName
    new_device.manufacter = manufacter
    new_device.mqtt_group = groups.split(',')
    new_device.iconUrl = iconUrl
    try {
      let result = await app.put(`/device/${new_device.id}`, new_device)
      if (result.data.Succes) {
        navigate('/devices')
      } else {
        setDisabledModifyBtn(false)
        console.log(result.data.msg)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='Add-form-container'>
      <form className='Add-form'>
        <div className='Add-form-content'>
          <h3 className='Add-form-title'>Edit Device</h3>
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
                setDisabledModifyBtn(false)
              }}
            />
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='select-manufacter'>Manufacter</label>
            <select
              id='select-manufacter'
              className='form-select select-type'
              aria-label='Default select example'
              value={manufacter}
              onChange={(e) => {
                setManufacter(e.target.value)
                setDisabledModifyBtn(false)
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
                setDisabledModifyBtn(false)
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
                setDisabledModifyBtn(false)
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
                setDisabledModifyBtn(false)
              }}
            />
          </div>
          <div className='d-grid gap-2 mt-3'>
            <button
              id='btn-add-dev'
              disabled={disabledModifyBtn}
              type='button'
              className='btn btn-primary btn-add-device'
              onClick={handleModifyDevice}
            >
              Modify
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

export default EditDevice
