import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './SubIR.css'
import { app, serverURL, serverPort } from '../../../api/api'
import io from 'socket.io-client'
import { TiInputChecked } from 'react-icons/ti'
let socket = undefined
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
]
function SubIR({ mqtt_name, manufacter, setSubProps }) {
  const [buttons, setButtons] = useState(buttons_init)
  const [selectedBtn, setSelectedBtn] = useState(buttons_init[0].name)
  const [code, setCode] = useState('')
  const [protocol, setProtocol] = useState('')
  const [bits, setBits] = useState('')
  function initSocket(__bool) {
    if (__bool) {
      if (!socket) {
        socket = io.connect(`${serverURL}:${serverPort}`, {
          secure: false,
          forceNew: true,
        })
        socket.on('connect', function () {
          console.log('connected')
        })
        socket.on('disconnect', function () {
          console.log('disconnected')
        })
      } else {
        socket.connect() // Yep, socket.socket ( 2 times )
        console.log('reconected')
      }
    } else {
      socket.disconnect()
    }
  }
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
    console.log(protocol, bits)
    console.log(buttons)
  }
  useEffect(() => {
    try {
      let result = app.post('/tempIR', {
        mqtt_name,
        manufacter,
      })
    } catch (error) {
      console.log(error)
    }
    initSocket(true)
    if (socket) {
      socket.on('update_temp_ir', (data) => {
        if (data.mqtt_name === mqtt_name) {
          console.log('updating')
          let buffer = data.received_code.split(' ')
          setProtocol(buffer[0])
          setBits(buffer[1])
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
            setSelectedBtn(e.target.value)
            let button = buttons.find((elem) => elem.name === e.target.value)
            setProtocol('')
            setBits('')
            setCode('')
          }}
        >
          {buttons.map((button) => {
            let checked = button.code === '' ? '' : '✔'
            return (
              <option value={button.name}>
                {button.fullName} {checked}
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
      <div className='d-grid gap-2 mt-3'>
        <button
          type='button'
          className='btn btn-primary btn-apply'
          onClick={apply_btn_code}
        >
          Apply
        </button>
      </div>
    </>
  )
}

export default SubIR
