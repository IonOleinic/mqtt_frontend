import React, { useState, useEffect } from 'react'
import { HuePicker } from 'react-color'
import { AlphaPicker } from 'react-color'
import { BsLightbulbFill } from 'react-icons/bs'
import './SmartBulb.css'
import { app } from '../../../api/api'
import { RangeStepInput } from 'react-range-step-input'
function SmartBulb({ device, visibility }) {
  const [color, setColor] = useState('#000000')
  const [cold, setCold] = useState(0)
  const [warm, setWarm] = useState(0)
  const [dimmer, setDimmer] = useState(100)
  useEffect(() => {
    if (device.bulb_type.includes('rgb')) {
      setColor('#' + device.color.substring(0, 6))
    } else {
      setColor('#ffff00')
    }
    if (device.bulb_type.includes('c')) {
      const cold_ch = parseInt(device.color.substring(6, 8), 16) / 255
      setCold(cold_ch)
    }
    if (device.bulb_type.includes('w')) {
      const warm_ch = parseInt(device.color.substring(8), 16) / 255
      setWarm(warm_ch)
    }
    setDimmer(device.dimmer)
  }, [device])
  const send_change_color = async (rgb_color, cold, warm) => {
    let newColor = rgb_color.replace('#', '') + toHex(cold) + toHex(warm)
    try {
      const response = await app.post(
        `/smartBulb/color?device_id=${device.id}&color=${newColor}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const send_change_dimmer = async (newValue) => {
    try {
      const response = await app.post(
        `/smartBulb/dimmer?device_id=${device.id}&dimmer=${newValue}`
      )
    } catch (error) {
      console.log(error)
    }
  }

  const send_change_power = async () => {
    const newStatus = 'TOGGLE'
    try {
      const response = await app.post(
        `/smartBulb/power?device_id=${device.id}&status=${newStatus}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const toHex = (val) => {
    let hex = Math.round(val * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return (
    <div
      className='smart-bulb'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
      <div
        className='slider-item'
        style={{ display: device.bulb_type.includes('rgb') ? 'flex' : 'none' }}
      >
        <label htmlFor='#'>Color</label>
        <HuePicker
          color={color}
          onChange={(e) => {
            setColor(e.hex)
          }}
          onChangeComplete={(e) => {
            send_change_color(e.hex, cold, warm)
          }}
          width='100%'
        />
      </div>
      <div className='slider-item'>
        <label htmlFor='#'>Dimmer</label>
        <button
          style={{ border: 'none', background: 'none', width: '100%' }}
          onMouseUp={(e) => {
            send_change_dimmer(dimmer)
          }}
          onTouchEnd={(e) => send_change_dimmer(dimmer)}
        >
          <RangeStepInput
            min={0}
            max={100}
            value={dimmer}
            step={1}
            onChange={(e) => {
              setDimmer(e.target.value)
            }}
            style={{ width: '100%' }}
          />
        </button>
      </div>
      <div className='bulb-item'>
        <div
          className='bulb-item-icon'
          style={{
            border:
              device.status == 'ON' ? `4px solid ${color}` : `4px solid #ccc`,
          }}
          onClick={send_change_power}
        >
          <BsLightbulbFill
            size={50}
            color={device.status == 'ON' ? color : '#ccc'}
          />
        </div>
      </div>
      <div
        className='slider-item'
        style={{ display: device.bulb_type.includes('c') ? 'flex' : 'none' }}
      >
        <label htmlFor='#'>Cold</label>
        <AlphaPicker
          color={{ r: 0, g: 0, b: 255, a: cold }}
          onChange={(e) => {
            setCold(e.rgb.a)
          }}
          onChangeComplete={(e) => {
            send_change_color(color, e.rgb.a, warm)
          }}
          width='100%'
        />
      </div>
      <div
        className='slider-item'
        style={{ display: device.bulb_type.includes('w') ? 'flex' : 'none' }}
      >
        <label htmlFor='#'>Warm</label>
        <AlphaPicker
          color={{ r: 255, g: 193, b: 7, a: warm }}
          onChange={(e) => {
            setWarm(e.rgb.a)
          }}
          onChangeComplete={(e) => {
            send_change_color(color, cold, e.rgb.a)
          }}
          width='100%'
        />
      </div>
    </div>
  )
}

export default SmartBulb
