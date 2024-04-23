import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import './EditDevice.css'

function EditDevice() {
  const axios = useAxiosPrivate()
  const { id } = useParams()
  const navigate = useNavigate()
  const [device, setDevice] = useState({})
  const [disabledModifyBtn, setDisabledModifyBtn] = useState(true)
  const [name, setName] = useState('')
  const [mqttName, setMqttName] = useState('')
  const [manufacter, setManufacter] = useState('')
  const [resultMessage, setResultMessage] = useState('')
  const [groups, setGroups] = useState('')
  const get_device = async () => {
    try {
      let result = await axios.get(`/device/${id}`)
      setDevice(result.data)
      setName(result.data.name)
      setMqttName(result.data.mqtt_name)
      setManufacter(result.data.manufacter)
      setGroups(result.data.mqtt_group.toString())
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    get_device()
  }, [])
  const handleModifyDevice = async () => {
    setDisabledModifyBtn(true)
    let newDevice = device
    newDevice.name = name
    newDevice.mqtt_name = mqttName
    newDevice.manufacter = manufacter
    newDevice.mqtt_group = groups.split(',')
    try {
      let result = await axios.put(`/device/${newDevice.id}`, newDevice)
      navigate('/devices')
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
