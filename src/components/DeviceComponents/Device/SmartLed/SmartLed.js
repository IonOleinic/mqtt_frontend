import { useState, useEffect } from 'react'
import { HuePicker } from 'react-color'
import { AlphaPicker } from 'react-color'
import { BsLightbulbFill } from 'react-icons/bs'
import { LedStripIcon } from './Icons/LedStripIcon'
import { BsPlayCircle } from 'react-icons/bs'
import { BsStopCircle } from 'react-icons/bs'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { Slider } from 'primereact/slider'
import PaletteItem from './PaletteItem/PaletteItem'
import { TbAlertTriangle } from 'react-icons/tb'
import useDebounce from '../../../../hooks/useDebounce'
import './SmartLed.css'

let bulb_icon = <BsLightbulbFill size={50} />
let led_strip_icon = <LedStripIcon size={50} />

function SmartLed({ device }) {
  const axios = useAxiosPrivate()
  const [currentTab, setCurrentTab] = useState(0)
  const [color, setColor] = useState('#000000')
  const [cold, setCold] = useState(0)
  const [warm, setWarm] = useState(0)
  const [dimmer, setDimmer] = useState(100)
  const debouncedDimmer = useDebounce(dimmer, 300)
  const [paletteSpeed, setPaletteSpeed] = useState(10)
  const debouncedPeletteSpeed = useDebounce(paletteSpeed, 300)
  const [paletteItems, setPaletteItems] = useState([])
  const [ledIcon, setLedIcon] = useState(<></>)
  const [paletteColors, setPaletteColors] = useState([])

  const changeTab = (index) => {
    setCurrentTab(index)
  }
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
    setPaletteColors(
      device.palette
        .map((paletteColor) => {
          if (paletteColor) {
            return `#${paletteColor}`
          }
        })
        .filter((item) => item)
    )
  }, [device.palette])

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
    setPaletteSpeed(device.speed)
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
          position={i < 2 ? 'left' : i === 2 ? 'center' : 'right'}
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
  const sendChangePaletteSpeed = async () => {
    try {
      const response = await axios.post(
        `/SmartLed/speed?device_id=${device.id}&speed=${paletteSpeed}`
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

  useEffect(() => {
    sendChangeDimmer(debouncedDimmer)
  }, [debouncedDimmer])

  useEffect(() => {
    sendChangePaletteSpeed(debouncedPeletteSpeed)
  }, [debouncedPeletteSpeed])

  return (
    <div className='smart-led'>
      <div className='custom-tab-content'>
        {currentTab === 0 && (
          <div className='smart-led-tab colors-tab'>
            <div
              className='slider-item'
              style={{
                display: device.led_type.includes('rgb') ? 'flex' : 'none',
              }}
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
              >
                <Slider
                  min={0}
                  max={100}
                  value={dimmer}
                  step={1}
                  onChange={(e) => {
                    setDimmer(e.value)
                  }}
                  style={{ width: '100%' }}
                />
              </button>
            </div>
            <div className='bulb-item'>
              <button
                className='bulb-item-icon'
                style={{
                  borderColor: device.status == 'ON' ? color : `#ccc`,
                  color: device.status == 'ON' ? color : '#ccc',
                }}
                onClick={sendChangePower}
              >
                {ledIcon}
              </button>
            </div>
          </div>
        )}
        {currentTab === 1 && (
          <div className='smart-led-tab cold-warm-tab'>
            {device.led_type.includes('c') || device.led_type.includes('w') ? (
              <>
                <div
                  className='slider-item'
                  style={{
                    display: device.led_type.includes('c') ? 'flex' : 'none',
                  }}
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
                  style={{
                    display: device.led_type.includes('w') ? 'flex' : 'none',
                  }}
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
              </>
            ) : (
              <UnsupportedSmartLedOption
                additionalMessage={` It doesn't have Cold or Warm chanels.`}
              />
            )}
          </div>
        )}
        {currentTab === 2 && (
          <div className='smart-led-tab palette-tab'>
            {device.manufacter == 'tasmota' &&
            device.led_type.includes('rgb') ? (
              <div
                className='slider-item palette-controll'
                style={{
                  display: device.manufacter == 'tasmota' ? 'flex' : 'none',
                }}
              >
                <div className='palette-controll-item palette-colors'>
                  {paletteItems}
                </div>
                <div className='palette-controll-item palette-buttons'>
                  <div
                    className={
                      device.scheme == '1' || device.scheme == '0'
                        ? 'palette-play-btn palette-btn-hovered'
                        : 'palette-play-btn'
                    }
                    onClick={() => {
                      if (device.scheme == '1' || device.scheme == '0') {
                        sendChangeScheme(2)
                      }
                    }}
                  >
                    <BsPlayCircle
                      size={40}
                      color={
                        device.scheme == '1' || device.scheme == '0'
                          ? 'green'
                          : '#ccc'
                      }
                    />
                  </div>
                  <div
                    className={
                      device.scheme == '1' || device.scheme == '0'
                        ? 'palette-stop-btn '
                        : 'palette-stop-btn palette-btn-hovered'
                    }
                    onClick={() => {
                      if (device.scheme == '2' || device.scheme == '3') {
                        sendChangeScheme(1)
                      }
                    }}
                  >
                    <BsStopCircle
                      size={40}
                      color={
                        device.scheme == '2' || device.scheme == '3'
                          ? 'red'
                          : '#ccc'
                      }
                    />
                  </div>
                </div>
                <div className='palette-controll-item palette-speed'>
                  <label htmlFor='#'>Speed</label>
                  <button
                    style={{
                      border: 'none',
                      background: 'none',
                      width: '100%',
                    }}
                  >
                    <Slider
                      min={1}
                      max={40}
                      value={41 - paletteSpeed}
                      step={1}
                      onChange={(e) => {
                        setPaletteSpeed(41 - e.value)
                      }}
                      style={{ width: '100%' }}
                    />
                  </button>
                </div>
              </div>
            ) : device.manufacter == 'tasmota' ? (
              <UnsupportedSmartLedOption
                additionalMessage={` It is not a RGB one.`}
              />
            ) : (
              <UnsupportedSmartLedOption
                additionalMessage={
                  ' Palette is available only for Tasmota devices.'
                }
              />
            )}
          </div>
        )}
      </div>
      <div className='custom-tabs'>
        <div
          className={`custom-tab ${currentTab === 0 ? 'active-tab' : ''}`}
          onClick={() => changeTab(0)}
          style={{
            color:
              device.available && device.status == 'ON' && currentTab === 0
                ? color
                : currentTab === 0
                ? 'blue'
                : 'revert',
          }}
        >
          Colors
        </div>
        <div
          className={`custom-tab ${currentTab === 1 ? 'active-tab' : ''}`}
          onClick={() => changeTab(1)}
        >
          <p className='cold-text'>Cold</p>
          <p>/</p>
          <p className='warm-text'>Warm</p>
        </div>
        <div
          className={`custom-tab ${currentTab === 2 ? 'active-tab' : ''}`}
          onClick={() => changeTab(2)}
        >
          {currentTab === 2 ? (
            <p
              style={{
                background:
                  device.available && paletteColors.length > 1
                    ? `linear-gradient(90deg,${paletteColors}) text`
                    : paletteColors.length === 1
                    ? `${paletteColors} text`
                    : `blue text`,
                color: 'transparent',
              }}
            >
              Palette
            </p>
          ) : (
            <p> Palette </p>
          )}
        </div>
      </div>
    </div>
  )
}

function UnsupportedSmartLedOption({ additionalMessage }) {
  return (
    <div className='smart-led-unsuported-feature'>
      <TbAlertTriangle size={50} color='gold' />
      <p>
        {`This option is unsupported for current device. ${additionalMessage}`}
      </p>
    </div>
  )
}

export default SmartLed
