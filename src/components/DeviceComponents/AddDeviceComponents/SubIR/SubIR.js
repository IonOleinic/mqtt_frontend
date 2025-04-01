import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { socket } from '../../../../api/io'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import './SubIR.css'

function SubIR({ mqttName, manufacter, setAttributes }) {
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
  const [selectedBtn, setSelectedBtn] = useState(buttons[0])
  const [code, setCode] = useState('')
  const [protocol, setProtocol] = useState('')
  const [bits, setBits] = useState('')
  const [disableDoneBtn, setDisableDoneBtn] = useState(true)

  const setBtn = (btnName, btnCode) => {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].name === btnName) {
        buttons[i].code = btnCode
      }
    }
    setButtons(buttons)
  }
  const transformBtnsArrToObj = () => {
    let transformedBtns = {}
    for (let i = 0; i < buttons.length; i++) {
      transformedBtns[`${buttons[i].name}`] = {
        code: buttons[i].code,
        fullName: buttons[i].fullName,
      }
    }
    return transformedBtns
  }
  const applyBtnCode = () => {
    setBtn(selectedBtn.name, code)
    setDisableDoneBtn(false)
  }
  useEffect(() => {
    try {
      let response = axios.post(
        `/tempIR?mqtt_name=${mqttName}&manufacter=${manufacter}`
      )
    } catch (error) {
      console.log(error)
    }
    if (socket) {
      const updateTempIRHandler = (data) => {
        if (data.mqtt_name === mqttName) {
          setProtocol(data.IR_info.protocol || '')
          setInitProtocol(data.IR_info.protocol || '')
          setBits(data.IR_info.bits || '')
          setInitBits(data.IR_info.bits || '')
          setCode(data.IR_info.code || '')
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
    <div className='sub-ir'>
      <div className='form-input-group'>
        <label htmlFor='select-ir-btn'>IR Button</label>
        <Dropdown
          id='select-ir-btn'
          options={buttons}
          optionLabel='fullName'
          value={selectedBtn}
          onChange={(e) => {
            setSelectedBtn(e.value)
            setProtocol(initProtocol)
            setBits(initBits)
            setCode(e.value?.code)
          }}
        />
      </div>
      <div className='ir-group-codes'>
        <div className='form-input-group ir-codes'>
          <label htmlFor='input-ir-protocol'>IR protocol</label>
          <InputText
            id='input-ir-protocol'
            value={protocol}
            onChange={(e) => {
              setProtocol(e.target.value)
            }}
          />
        </div>
        <div className='form-input-group ir-codes'>
          <label htmlFor='input-ir-bits'>IR bits</label>
          <InputText
            id='input-ir-bits'
            value={bits}
            onChange={(e) => {
              setBits(e.target.value)
            }}
          />
        </div>
        <div className='form-input-group ir-codes'>
          <label htmlFor='input-ir-btn-code'>IR btn</label>
          <InputText
            id='input-ir-btn-code'
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
            }}
          />
        </div>
      </div>
      <div className='sub-ir-buttons'>
        <Button
          label='Done'
          severity='secondary'
          icon='pi pi-check'
          disabled={disableDoneBtn}
          onClick={() => {
            setAttributes({
              preset: {
                buttons: transformBtnsArrToObj(),
                protocol,
                bits,
              },
            })
          }}
        />
        <Button
          label='Apply'
          severity='secondary'
          icon='pi pi-check'
          onClick={applyBtnCode}
        />
      </div>
    </div>
  )
}

export default SubIR
