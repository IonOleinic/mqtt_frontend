import React, { useEffect, useState } from 'react'
import './SmartIR.css'
import { FaTimes } from 'react-icons/fa'
import { BiPowerOff } from 'react-icons/bi'
import { BiPlus } from 'react-icons/bi'
import { BiMinus } from 'react-icons/bi'
import { BiChevronDown } from 'react-icons/bi'
import { BiChevronUp } from 'react-icons/bi'
import { BiChevronLeft } from 'react-icons/bi'
import { BiChevronRight } from 'react-icons/bi'
import { BiVolumeMute } from 'react-icons/bi'
import { BiInfoCircle } from 'react-icons/bi'
import { MdInput } from 'react-icons/md'
import { RiArrowGoBackFill } from 'react-icons/ri'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'

function SmartIR({ device }) {
  const axios = useAxiosPrivate()
  const [checkedNumbers, setCheckedNumbers] = useState(false)
  const handlePressBtn = async (btn) => {
    try {
      let response = await axios.post(
        `/smartIR?device_id=${device.id}&btn_code=${btn}`
      )
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='smart-ir'>
      <div className='ir-block power'>
        <div
          className='ir-buttons btn-pow'
          aria-disabled={true}
          onClick={() => {
            handlePressBtn(device.buttons.btn_power.code)
          }}
        >
          <BiPowerOff size={30} />
        </div>
        <div
          className='ir-buttons number'
          onClick={() => {
            setCheckedNumbers(!checkedNumbers)
          }}
        >
          123
        </div>
        <div
          className='ir-buttons number exit'
          onClick={() => {
            handlePressBtn(device.buttons.btn_exit.code)
          }}
        >
          Exit
        </div>
        <div
          className='ir-buttons number back'
          onClick={() => {
            handlePressBtn(device.buttons.btn_back.code)
          }}
        >
          <RiArrowGoBackFill size={25} />
        </div>
      </div>
      <div className='ir-block vol'>
        <div
          className='ir-buttons'
          onClick={() => {
            handlePressBtn(device.buttons.btn_volUp.code)
          }}
        >
          <BiPlus size={30} />
        </div>
        <div>Vol</div>
        <div
          className='ir-buttons'
          onClick={() => {
            handlePressBtn(device.buttons.btn_volDown.code)
          }}
        >
          <BiMinus size={30} />
        </div>
      </div>
      <div className='ir-block ok-menu'>
        <div
          className='ir-buttons ok-up'
          onClick={() => {
            handlePressBtn(device.buttons.btn_up.code)
          }}
        >
          <BiChevronUp size={30} />
        </div>
        <div
          className='ir-buttons ok-left'
          onClick={() => {
            handlePressBtn(device.buttons.btn_left.code)
          }}
        >
          <BiChevronLeft size={30} />
        </div>
        <div
          className='ir-buttons ok-enter'
          onClick={() => {
            handlePressBtn(device.buttons.btn_ok.code)
          }}
        >
          OK
        </div>
        <div
          className='ir-buttons ok-right'
          onClick={() => {
            handlePressBtn(device.buttons.btn_right.code)
          }}
        >
          <BiChevronRight size={30} />
        </div>
        <div
          className='ir-buttons ok-down'
          onClick={() => {
            handlePressBtn(device.buttons.btn_down.code)
          }}
        >
          <BiChevronDown size={30} />
        </div>
      </div>
      <div className='ir-block chanel'>
        <div
          className='ir-buttons up'
          onClick={() => {
            handlePressBtn(device.buttons.btn_chnUp.code)
          }}
        >
          <BiPlus size={30} />
        </div>
        <div>CH</div>
        <div
          className='ir-buttons down'
          onClick={() => {
            handlePressBtn(device.buttons.btn_chnDown.code)
          }}
        >
          <BiMinus size={30} />
        </div>
      </div>
      <div
        className='ir-buttons simple-button mute'
        onClick={() => {
          handlePressBtn(device.buttons.btn_mute.code)
        }}
      >
        <BiVolumeMute size={25} />
      </div>
      <div
        className='ir-buttons simple-button menu'
        onClick={() => {
          handlePressBtn(device.buttons.btn_home.code)
        }}
      >
        Menu
      </div>
      <div
        className='ir-buttons simple-button input'
        onClick={() => {
          handlePressBtn(device.buttons.btn_input.code)
        }}
      >
        <MdInput size={25} />
      </div>
      <div
        className='ir-buttons simple-button info'
        onClick={() => {
          handlePressBtn(device.buttons.btn_info.code)
        }}
      >
        <BiInfoCircle size={25} />
      </div>
      <div className='numbers' style={{ top: checkedNumbers ? '0' : '200%' }}>
        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_1.code)
          }}
        >
          1
        </div>
        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_2.code)
          }}
        >
          2
        </div>
        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_3.code)
          }}
        >
          3
        </div>
        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_4.code)
          }}
        >
          4
        </div>
        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_5.code)
          }}
        >
          5
        </div>
        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_6.code)
          }}
        >
          6
        </div>
        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_7.code)
          }}
        >
          7
        </div>
        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_8.code)
          }}
        >
          8
        </div>
        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_9.code)
          }}
        >
          9
        </div>

        <div
          className='ir-buttons number'
          onClick={() => {
            handlePressBtn(device.buttons.btn_0.code)
          }}
        >
          0
        </div>
        <div
          className='ir-buttons number div-close'
          onClick={() => {
            setCheckedNumbers(!checkedNumbers)
          }}
        >
          <b>X</b>
        </div>
      </div>
    </div>
  )
}

export default SmartIR
