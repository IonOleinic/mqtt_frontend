import React, { useEffect, useState } from 'react'
import './SubIR.css'
import { app } from '../../../api/api'
import { socket } from '../../../api/io'

let buttons_init = [
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
]
function SubIR({ mqtt_name, manufacter, setSubProps, disable_add_btn }) {
  const [initProtocol, setInitProtocol] = useState('')
  const [initBits, setInitBits] = useState('')
  const [buttons, setButtons] = useState(buttons_init)
  const [selectedBtn, setSelectedBtn] = useState(buttons_init[0].name)
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
    setButtons(buttons_init)
    console.log(buttons)
    try {
      let result = app.post('/tempIR', {
        mqtt_name,
        manufacter,
      })
    } catch (error) {
      console.log(error)
    }
    if (socket) {
      socket.on('update_temp_ir', (data) => {
        if (data.mqtt_name === mqtt_name) {
          let buffer = data.received_code.split(' ')
          setProtocol(buffer[0].replace('IR_', ''))
          setInitProtocol(buffer[0].replace('IR_', ''))
          setBits(buffer[1])
          setInitBits(buffer[1])
          setCode(buffer[2])
        }
      })
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
              setSubProps({ buttons, protocol, bits })
              disable_add_btn(false)
              setButtons(buttons_init)
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
