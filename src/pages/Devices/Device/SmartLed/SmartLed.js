import React, { useState, useEffect, useReducer } from 'react'
import { HuePicker } from 'react-color'
import { AlphaPicker } from 'react-color'
import { BsLightbulbFill } from 'react-icons/bs'
import { BsPlayCircle } from 'react-icons/bs'
import { BsStopCircle } from 'react-icons/bs'
import './SmartLed.css'
import { app } from '../../../api/api'
import { RangeStepInput } from 'react-range-step-input'
import PaletteItem from './PaletteItem/PaletteItem'
function SmartLed({ device, visibility }) {
  const [color, setColor] = useState('#000000')
  const [cold, setCold] = useState(0)
  const [warm, setWarm] = useState(0)
  const [dimmer, setDimmer] = useState(100)
  const [speed, setSpeed] = useState(10)
  const [paletteItems, setPaletteItems] = useState([])
  useEffect(() => {
    if (device.led_type.includes('rgb')) {
      if (device.color.substring(0, 6).toUpperCase() === 'FFFFFF') {
        setColor('#ffff00')
      } else {
        setColor('#' + device.color.substring(0, 6))
      }
    } else {
      setColor('#ffff00')
    }
    if (device.led_type.includes('c')) {
      const cold_ch = parseInt(device.color.substring(6, 8), 16) / 255
      setCold(cold_ch)
    }
    if (device.led_type.includes('w')) {
      const warm_ch = parseInt(device.color.substring(8), 16) / 255
      setWarm(warm_ch)
    }
    setDimmer(device.dimmer)
    setSpeed(device.speed)
  }, [device])
  useEffect(() => {
    set_palette_items(device.palette)
  }, [device.palette])
  const set_palette_items = (palette) => {
    let items = []
    for (let i = 0; i < palette.length; i++) {
      items.push(
        <PaletteItem
          key={i + palette[i].replace('#', '')}
          id={i}
          initColor={
            palette[i].length > 6 ? palette[i].substring(0, 6) : palette[i]
          }
          handlePaletteChange={handlePaletteChange}
        />
      )
    }
    setPaletteItems(items)
  }
  const send_change_color = async (rgb_color, cold, warm) => {
    let newColor = rgb_color.replace('#', '') + toHex(cold) + toHex(warm)
    try {
      const response = await app.post(
        `/SmartLed/color?device_id=${device.id}&color=${newColor}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const send_change_dimmer = async (newValue) => {
    try {
      const response = await app.post(
        `/SmartLed/dimmer?device_id=${device.id}&dimmer=${newValue}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const send_change_power = async () => {
    const newStatus = 'TOGGLE'
    try {
      const response = await app.post(
        `/SmartLed/power?device_id=${device.id}&status=${newStatus}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const toHex = (val) => {
    let hex = Math.round(val * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  const send_change_palette = async (palette) => {
    try {
      const response = await app.post(
        `/SmartLed/palette?device_id=${device.id}&palette=${palette}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const send_change_speed = async () => {
    try {
      const response = await app.post(
        `/SmartLed/speed?device_id=${device.id}&speed=${speed}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const send_change_scheme = async (scheme) => {
    try {
      const response = await app.post(
        `/SmartLed/scheme?device_id=${device.id}&scheme=${scheme}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const handlePaletteChange = async (id, color) => {
    let temp = device.palette
    temp[id] = color.replaceAll('#', '').toUpperCase()
    send_change_palette(temp)
  }

  return (
    <div
      className='smart-led'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
      <div
        className='slider-item'
        style={{ display: device.led_type.includes('rgb') ? 'flex' : 'none' }}
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
        style={{ display: device.led_type.includes('c') ? 'flex' : 'none' }}
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
        style={{ display: device.led_type.includes('w') ? 'flex' : 'none' }}
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
      <div
        className='slider-item palette'
        style={{ display: device.led_type.includes('rgb') ? 'flex' : 'none' }}
      >
        {paletteItems}
      </div>
      <div className='slider-item palette-buttons'>
        <div
          className='palette-play-btn'
          onClick={() => {
            if (device.scheme == '1' || device.scheme == '0') {
              send_change_scheme(2)
            }
          }}
        >
          <BsPlayCircle
            size={40}
            color={
              device.scheme == '1' || device.scheme == '0' ? 'green' : '#ccc'
            }
          />
        </div>
        <div
          className='palette-stop-btn'
          onClick={() => {
            if (device.scheme == '2' || device.scheme == '3') {
              send_change_scheme(1)
            }
          }}
        >
          <BsStopCircle
            size={40}
            color={
              device.scheme == '2' || device.scheme == '3' ? 'red' : '#ccc'
            }
          />
        </div>
      </div>
      <div className='slider-item palette-speed'>
        <label htmlFor='#'>Speed</label>
        <button
          style={{ border: 'none', background: 'none', width: '100%' }}
          onMouseUp={(e) => {
            send_change_speed(speed)
          }}
          onTouchEnd={(e) => send_change_speed(speed)}
        >
          <RangeStepInput
            min={1}
            max={40}
            value={41 - speed}
            step={1}
            onChange={(e) => {
              setSpeed(41 - e.target.value)
            }}
            style={{ width: '100%' }}
          />
        </button>
      </div>
    </div>
  )
}

export default SmartLed
