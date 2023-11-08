import React, { useEffect, useState } from 'react'
import './SubIR.css'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { socket } from '../../../api/io'

function SubIR({ mqtt_name, manufacter, setSubProps, disable_add_btn }) {
  const axios = useAxiosPrivate()
  const [initProtocol, setInitProtocol] = useState('')
  const [initBits, setInitBits] = useState('')
  const [buttons, setButtons] = useState([
    {
      fullName: 'Power',
      name: 'btn_power',
      code: '',
    },
    {
      fullName: 'Vol+',
      name: 'btn_volUp',
      code: '',
    },
    {
      fullName: 'Vol-',
      name: 'btn_volDown',
      code: '',
    },
    {
      fullName: 'OK',
      name: 'btn_ok',
      code: '',
    },
    {
      fullName: 'CH+',
      name: 'btn_chnUp',
      code: '',
    },
    {
      fullName: 'CH-',
      name: 'btn_chnDown',
      code: '',
    },
    {
      fullName: 'Up',
      name: 'btn_up',
      code: '',
    },
    {
      fullName: 'Down',
      name: 'btn_down',
      code: '',
    },
    {
      fullName: 'Left',
      name: 'btn_left',
      code: '',
    },
    {
      fullName: 'Right',
      name: 'btn_right',
      code: '',
    },
    {
      fullName: 'Mute',
      name: 'btn_mute',
      code: '',
    },
    {
      fullName: 'Exit',
      name: 'btn_exit',
      code: '',
    },
    {
      fullName: 'Back',
      name: 'btn_back',
      code: '',
    },
    {
      fullName: 'info',
      name: 'btn_info',
      code: '',
    },
    {
      fullName: 'Home',
      name: 'btn_home',
      code: '',
    },
    {
      fullName: 'input',
      name: 'btn_input',
      code: '',
    },
  ])
  const [selectedBtn, setSelectedBtn] = useState(buttons[0].name)
  const [code, setCode] = useState('')
  const [protocol, setProtocol] = useState('')
  const [bits, setBits] = useState('')
  const [disableDoneBtn, setDisableDoneBtn] = useState(true)

  const set_btn = (btn_name, btn_code) => {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].name === btn_name) {
        buttons[i].code = btn_code
      }
    }
    setButtons(buttons)
  }
  const apply_btn_code = () => {
    set_btn(selectedBtn, code)
    setDisableDoneBtn(false)
  }
  useEffect(() => {
    try {
      let response = axios.post(
        `/tempIR?mqtt_name=${mqtt_name}&manufacter=${manufacter}`
      )
    } catch (error) {
      console.log(error)
    }
    if (socket) {
      const updateTempIRHandler = (data) => {
        if (data.mqtt_name === mqtt_name) {
          setProtocol(data.IR_info.protocol)
          setInitProtocol(data.IR_info.protocol)
          setBits(data.IR_info.bits)
          setInitBits(data.IR_info.bits)
          setCode(data.IR_info.code)
        }
      }
      socket.on('update_temp_ir', updateTempIRHandler)
      // Cleanup function to remove the listener when the component unmounts
      return () => {
        socket.off('update_temp_ir', updateTempIRHandler)
      }
    }
  }, [])
  return (
    <>
      <div className='form-group mt-3 '>
        <label htmlFor='select-ir-btn'>IR Button</label>
        <select
          id='select-ir-btn'
          className='form-select select-type'
          aria-label='Default select example'
          onChange={(e) => {
            let button = buttons.find((elem) => elem.name === e.target.value)
            setSelectedBtn(button.name)
            setProtocol(initProtocol)
            setBits(initBits)
            setCode(button.code)
          }}
        >
          {buttons.map((button, index) => {
            let checked = button.code === '' ? '' : '✔'
            return (
              <option key={index} value={button.name}>
                {button.fullName}
                {'\t'}
                {checked}
              </option>
            )
          })}
        </select>
      </div>
      <div className='ir-group-codes'>
        <div className='form-group mt-3 ir-codes'>
          <label htmlFor='input-ir-protocol'>IR protocol</label>
          <input
            id='input-ir-protocol'
            type='text'
            className='form-control mt-1 '
            value={protocol}
            onChange={(e) => {
              setProtocol(e.target.value)
            }}
          />
        </div>
        <div className='form-group mt-3 ir-codes'>
          <label htmlFor='input-ir-bits'>IR bits</label>
          <input
            id='input-ir-bits'
            type='text'
            className='form-control mt-1 '
            value={bits}
            onChange={(e) => {
              setBits(e.target.value)
            }}
          />
        </div>
        <div className='form-group mt-3 ir-codes'>
          <label htmlFor='input-ir-btn-code'>IR btn</label>
          <input
            id='input-ir-btn-code'
            type='text'
            className='form-control mt-1 '
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
            }}
          />
        </div>
      </div>
      <div className='ir-align'>
        <div className='d-grid gap-2 mt-3 btn-ir'>
          <button
            disabled={disableDoneBtn}
            type='button'
            className='btn btn-primary '
            onClick={() => {
              setSubProps({
                PRESET: {
                  buttons,
                  protocol,
                  tasmotaBits: bits,
                  openBekenBits: bits,
                },
              })
              disable_add_btn(false)
            }}
          >
            Done
          </button>
        </div>
        <div className='d-grid gap-2 mt-3 btn-ir'>
          <button
            type='button'
            className='btn btn-primary '
            onClick={apply_btn_code}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  )
}

export default SubIR
