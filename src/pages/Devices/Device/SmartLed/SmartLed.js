import React, { useState, useEffect, useReducer } from 'react'
import { HuePicker } from 'react-color'
import { AlphaPicker } from 'react-color'
import { BsLightbulbFill } from 'react-icons/bs'
import { LedStripIcon } from './Icons/LedStripIcon'
import { BsPlayCircle } from 'react-icons/bs'
import { BsStopCircle } from 'react-icons/bs'
import './SmartLed.css'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { RangeStepInput } from 'react-range-step-input'
import PaletteItem from './PaletteItem/PaletteItem'
let bulb_icon = <BsLightbulbFill size={50} />
let led_strip_icon = <LedStripIcon size={50} />
function SmartLed({ device }) {
  const axios = useAxiosPrivate()
  const [color, setColor] = useState('#000000')
  const [cold, setCold] = useState(0)
  const [warm, setWarm] = useState(0)
  const [dimmer, setDimmer] = useState(100)
  const [speed, setSpeed] = useState(10)
  const [paletteItems, setPaletteItems] = useState([])
  const [ledIcon, setLedIcon] = useState(<></>)
  const [cursorStyle, setCursorStyle] = useState({ cursor: 'default' })

  const setLedIconFunc = () => {
    if (device.sub_type == 'ledStrip') {
      setLedIcon(led_strip_icon)
    } else {
      setLedIcon(bulb_icon)
    }
  }

  useEffect(() => {
    setLedIconFunc()
  }, [color, device.status, device.color])
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
    setPaletteItemsFunc(device.palette)
  }, [device.palette])

  const setPaletteItemsFunc = (palette) => {
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
  const sendChangeColor = async (rgb_color, cold, warm) => {
    let newColor = rgb_color.replace('#', '') + toHex(cold) + toHex(warm)
    try {
      const response = await axios.post(
        `/SmartLed/color?device_id=${device.id}&color=${newColor}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const sendChangeDimmer = async (newValue) => {
    try {
      const response = await axios.post(
        `/SmartLed/dimmer?device_id=${device.id}&dimmer=${newValue}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const sendChangePower = async () => {
    const newStatus = 'TOGGLE'
    try {
      const response = await axios.post(
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
  const sendChangePalette = async (palette) => {
    try {
      const response = await axios.post(
        `/SmartLed/palette?device_id=${device.id}&palette=${palette}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const sendChangeSpeed = async () => {
    try {
      const response = await axios.post(
        `/SmartLed/speed?device_id=${device.id}&speed=${speed}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const sendChangeScheme = async (scheme) => {
    try {
      const response = await axios.post(
        `/SmartLed/scheme?device_id=${device.id}&scheme=${scheme}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const handlePaletteChange = async (id, color) => {
    let temp = device.palette
    temp[id] = color.replaceAll('#', '').toUpperCase()
    sendChangePalette(temp)
  }

  return (
    <div className='smart-led'>
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
            sendChangeColor(e.hex, cold, warm)
          }}
          width='100%'
        />
      </div>
      <div className='slider-item'>
        <label htmlFor='#'>Dimmer</label>
        <button
          style={{ border: 'none', background: 'none', width: '100%' }}
          onMouseUp={(e) => {
            sendChangeDimmer(dimmer)
          }}
          onTouchEnd={(e) => sendChangeDimmer(dimmer)}
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
            color: device.status == 'ON' ? color : '#ccc',
          }}
          onClick={sendChangePower}
        >
          {ledIcon}
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
            sendChangeColor(color, e.rgb.a, warm)
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
            sendChangeColor(color, cold, e.rgb.a)
          }}
          width='100%'
        />
      </div>
      <div
        className='slider-item pallete-controll'
        style={{ display: device.manufacter == 'tasmota' ? 'flex' : 'none' }}
      >
        <div className='pallete-controll-item palette-colors'>
          {paletteItems}
        </div>
        <div className='pallete-controll-item palette-buttons'>
          <div
            className='palette-play-btn'
            onClick={() => {
              if (device.scheme == '1' || device.scheme == '0') {
                sendChangeScheme(2)
              }
            }}
            style={cursorStyle}
            onMouseEnter={() => {
              if (device.scheme == '1' || device.scheme == '0') {
                setCursorStyle({ cursor: 'pointer' })
              }
            }}
            onMouseLeave={() => {
              setCursorStyle({ cursor: 'default' })
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
                sendChangeScheme(1)
              }
            }}
            style={cursorStyle}
            onMouseEnter={() => {
              if (device.scheme == '2' || device.scheme == '3') {
                setCursorStyle({ cursor: 'pointer' })
              }
            }}
            onMouseLeave={() => {
              setCursorStyle({ cursor: 'default' })
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
        <div className='pallete-controll-item palette-speed'>
          <label htmlFor='#'>Speed</label>
          <button
            style={{ border: 'none', background: 'none', width: '100%' }}
            onMouseUp={(e) => {
              sendChangeSpeed(speed)
            }}
            onTouchEnd={(e) => sendChangeSpeed(speed)}
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
    </div>
  )
}

export default SmartLed
