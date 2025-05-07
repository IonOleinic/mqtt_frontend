import { useState, useEffect } from 'react'
import { HuePicker } from 'react-color'
import { AlphaPicker } from 'react-color'
import { BsLightbulbFill } from 'react-icons/bs'
import LedStripIcon from './Icons/LedStripIcon'
import { BsPlayCircle } from 'react-icons/bs'
import { BsStopCircle } from 'react-icons/bs'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { Slider } from 'primereact/slider'
import PaletteItem from './PaletteItem/PaletteItem'
import { TbAlertTriangle } from 'react-icons/tb'
import { BiSolidColorFill, BiSolidPalette } from 'react-icons/bi'
import { RiSunFill } from 'react-icons/ri'
import useDebounce from '../../../../hooks/useDebounce'
import './SmartLed.css'

function SmartLed({ device }) {
  const axios = useAxiosPrivate()
  const [currentTab, setCurrentTab] = useState(0)
  const [started, setStarted] = useState(false) //used to delay send change dimmer (change dimmer cause forced power ON)
  const [color, setColor] = useState('#000000')
  const [cold, setCold] = useState(0)
  const [warm, setWarm] = useState(0)
  const [dimmer, setDimmer] = useState(100)
  const debouncedDimmer = useDebounce(dimmer, 300)
  const [paletteSpeed, setPaletteSpeed] = useState(10)
  const debouncedPeletteSpeed = useDebounce(paletteSpeed, 300)
  const [paletteItems, setPaletteItems] = useState([])
  const [ledIcon, setLedIcon] = useState(<></>)

  useEffect(() => {
    if (device.sub_type == 'ledStrip') {
      setLedIcon(<LedStripIcon size={50} />)
    } else {
      setLedIcon(<BsLightbulbFill size={50} />)
    }
  }, [device.sub_type])

  useEffect(() => {
    if (device.attributes.led_type?.includes('rgb')) {
      if (device.attributes.color?.substring(0, 6).toUpperCase() === 'FFFFFF') {
        setColor('#ffff00')
      } else {
        setColor('#' + device.attributes.color?.substring(0, 6))
      }
    } else {
      setColor('#ffff00')
    }
    if (device.attributes.led_type == 'rgbw') {
      const cold_ch =
        parseInt(device.attributes.color?.substring(6, 8), 16) / 255
      setCold(cold_ch)
    }
    if (device.attributes.led_type == 'rgbcw') {
      const warm_ch = parseInt(device.attributes.color?.substring(8), 16) / 255
      setWarm(warm_ch)
    }
    setDimmer(device.attributes.dimmer)
    setPaletteSpeed(device.attributes.speed)
    setTimeout(() => {
      setStarted(true) //used to delay send change dimmer (change dimmer cause forced power ON)
    }, 1500)
  }, [device.attributes])

  useEffect(() => {
    populatePaletteItems(device.attributes.palette)
  }, [device.attributes.palette])

  const populatePaletteItems = (palette) => {
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
  const sendChangeColor = async (rgbColor, cold, warm) => {
    let newColor = rgbColor.replace('#', '') + toHex(cold) + toHex(warm)
    try {
      await axios.post(
        `/SmartLed/color?device_id=${device.id}&color=${newColor}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const sendChangeDimmer = async (newValue) => {
    try {
      await axios.post(
        `/SmartLed/dimmer?device_id=${device.id}&dimmer=${newValue}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const sendChangePower = async () => {
    const newStatus = 'TOGGLE'
    try {
      await axios.post(
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
      await axios.post(
        `/SmartLed/palette?device_id=${device.id}&palette=${palette}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const sendChangePaletteSpeed = async () => {
    try {
      await axios.post(
        `/SmartLed/speed?device_id=${device.id}&speed=${paletteSpeed}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const sendChangeScheme = async (scheme) => {
    try {
      await axios.post(
        `/SmartLed/scheme?device_id=${device.id}&scheme=${scheme}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  const handlePaletteChange = async (id, color) => {
    let temp = device.attributes.palette
    temp[id] = color.replaceAll('#', '').toUpperCase()
    sendChangePalette(temp)
  }
  useEffect(() => {
    //used to delay send change dimmer (because dimmer was changed before device init by debouncedDimmer )
    if (started) {
      sendChangeDimmer(debouncedDimmer)
    }
  }, [debouncedDimmer])

  useEffect(() => {
    //used to delay send change speed (because palette speed was changed before device init by debouncedPeletteSpeed)
    if (started) {
      sendChangePaletteSpeed(debouncedPeletteSpeed)
    }
  }, [debouncedPeletteSpeed])

  return (
    <div className='smart-led'>
      <div className='custom-tab-content'>
        {currentTab === 0 && (
          <div className='smart-led-tab'>
            <div
              className='slider-item'
              style={{
                display: device.attributes.led_type?.includes('rgb')
                  ? 'flex'
                  : 'none',
              }}
            >
              <label htmlFor='#'>Color</label>
              <HuePicker
                color={color}
                onChange={(color) => {
                  setColor(color.hex)
                }}
                onChangeComplete={(color) => {
                  sendChangeColor(color.hex, cold, warm)
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
                  borderColor:
                    device.attributes.status == 'ON' ? color : `#ccc`,
                  color: device.attributes.status == 'ON' ? color : '#ccc',
                }}
                onClick={sendChangePower}
              >
                {ledIcon}
              </button>
            </div>
          </div>
        )}
        {currentTab === 1 && (
          <div className='smart-led-tab'>
            {device.attributes.led_type?.includes('c') ||
            device.attributes.led_type?.includes('w') ? (
              <>
                <div
                  className='slider-item'
                  style={{
                    display: device.attributes.led_type?.includes('c')
                      ? 'flex'
                      : 'none',
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
                    display: device.attributes.led_type?.includes('w')
                      ? 'flex'
                      : 'none',
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
          <div className='smart-led-tab'>
            {device.manufacter == 'tasmota' &&
            device.attributes.led_type?.includes('rgb') ? (
              <div
                className='palette-control'
                style={{
                  display: device.manufacter == 'tasmota' ? 'flex' : 'none',
                }}
              >
                <div className='palette-control-item palette-colors'>
                  {paletteItems}
                </div>
                <div className='palette-control-item palette-buttons'>
                  <div
                    className={
                      device.attributes.scheme == '1' ||
                      device.attributes.scheme == '0'
                        ? 'palette-play-btn palette-btn-hovered'
                        : 'palette-play-btn'
                    }
                    onClick={() => {
                      if (
                        device.attributes.scheme == '1' ||
                        device.attributes.scheme == '0'
                      ) {
                        sendChangeScheme(2)
                      }
                    }}
                  >
                    <BsPlayCircle
                      size={40}
                      color={
                        device.attributes.scheme == '1' ||
                        device.attributes.scheme == '0'
                          ? 'green'
                          : '#ccc'
                      }
                    />
                  </div>
                  <div
                    className={
                      device.attributes.scheme == '1' ||
                      device.attributes.scheme == '0'
                        ? 'palette-stop-btn '
                        : 'palette-stop-btn palette-btn-hovered'
                    }
                    onClick={() => {
                      if (
                        device.attributes.scheme == '2' ||
                        device.attributes.scheme == '3'
                      ) {
                        sendChangeScheme(1)
                      }
                    }}
                  >
                    <BsStopCircle
                      size={40}
                      color={
                        device.attributes.scheme == '2' ||
                        device.attributes.scheme == '3'
                          ? 'red'
                          : '#ccc'
                      }
                    />
                  </div>
                </div>
                <div className='palette-control-item palette-speed'>
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
          onClick={() => setCurrentTab(0)}
        >
          <BiSolidColorFill size={18} />
          <p>Color</p>
        </div>
        <div
          className={`custom-tab custom-tab-middle ${
            currentTab === 1 ? 'active-tab' : ''
          }`}
          onClick={() => setCurrentTab(1)}
        >
          <RiSunFill size={18} />
          <p>Cold/Warm</p>
        </div>
        <div
          className={`custom-tab ${currentTab === 2 ? 'active-tab' : ''}`}
          onClick={() => setCurrentTab(2)}
        >
          <BiSolidPalette size={18} />
          <p>Palette</p>
        </div>
      </div>
    </div>
  )
}

function UnsupportedSmartLedOption({ additionalMessage }) {
  return (
    <div>
      <TbAlertTriangle size={50} color='gold' />
      <p>
        {`This option is unsupported for current device. ${additionalMessage}`}
      </p>
    </div>
  )
}

export default SmartLed
