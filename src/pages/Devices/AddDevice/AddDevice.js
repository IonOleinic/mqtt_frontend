import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './AddDevice.css'
import SubSwitch from './SubSwitch/SubSwitch'
import axios from 'axios'
const app = axios.create({
    baseURL: 'http://192.168.0.108:5000',
    timeout: 4000,
  })
function AddDevice() {
    const [deviceTypes,setDeviceTypes]=useState([])
    const [subDevice,setSubDevice]=useState((<></>))
    useEffect(()=>{
        const get_all_types=async()=>{
            let result=await app.get('/deviceTypes')
            setDeviceTypes(result.data)
        }
        get_all_types()
    },[])
    const choose_sub_device=(deviceType)=>{
      let subtype=<></>
            switch (deviceType) {
              case 'smartPlug':
                subtype=<></>
                break;
              case 'smartStrip':
                subtype=<></>
                break;
              case 'smartSwitch':
                subtype=<SubSwitch/>
                break;
              case 'smartIR':
                subtype=<></>
                break;
              case 'smartDoorSensor':
                subtype=<></>
                break;
              case 'smartTempSensor':
                subtype=<></>
                break;
              default:
                subtype=<></>
                break;
            }
      setSubDevice(subtype)
    }
  return (
    <div className='Add-form-container'>
    <form className='Add-form'>
      <div className='Add-form-content'>
        <h3 className='Add-form-title'>Add Device</h3>
        <div className='form-group mt-3'>
          <label>Device Name</label>
          <input
            type='text'
            className='form-control mt-1'
            placeholder='Device name'
          />
        </div>
        <div className='form-group mt-3'>
          <label>Manufacter</label>
          <input
            type='text'
            className='form-control mt-1'
            placeholder='tasmota/openBeken'
          />
        </div>
        <div className='form-group mt-3'>
          <label>MQTT Name</label>
          <input
            type='text'
            className='form-control mt-1'
            placeholder='mqtt topic *(unique)'
          />
        </div>
        <div className='form-group mt-3'>
          <label>Groups</label>
          <input
            type='text'
            className='form-control mt-1'
            placeholder='Living Room,etc'
          />
        </div>
        <div className='form-group mt-3'>
          <label>Icon URL</label>
          <input
            type='text'
            className='form-control mt-1'
            placeholder='img url'
          />
        </div>
        <div className='form-group mt-3'>
        <label>Device Type</label>
        <select id='select-type' className="form-select select-type" aria-label="Default select example" onChange={(e)=>{choose_sub_device(e.target.value)}}>
          <option value='none'>None</option>
          {deviceTypes.map((deviceType,index)=>{
            return(<option key={index} value={deviceType} >{deviceType}</option>)
          })}
        </select>
        {subDevice}
        </div>
        <div className='d-grid gap-2 mt-3'>
          <button type='submit' className='btn btn-primary'>
            Add
          </button>
        </div>
        
      </div>
    </form>
  </div>
  )
}

export default AddDevice