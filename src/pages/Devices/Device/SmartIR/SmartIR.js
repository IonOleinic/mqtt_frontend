import React, { useEffect, useState } from 'react'
import './SmartIR.css'
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
import { app } from '../../../api/api'

function SmartIR({ device, visibility }) {
  const handlePressBtn = async (btn) => {
    try {
      let result = await app.post(
        `/smartIR?device_name=${device.mqtt_name}&btn_code=${btn}`
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {}, [])
  return (
    <div
      className='smart-ir'
      style={{ display: visibility === true ? 'flex' : 'none' }}
    >
      <div className='ir-block power'>
        <div
          className='ir-buttons btn-pow'
          aria-disabled={true}
          onClick={() => {
            handlePressBtn(device.buttons.btn_power)
          }}
        >
          <BiPowerOff size={30} />
        </div>
      </div>
      <div className='ir-block vol'>
        <div
          className='ir-buttons'
          onClick={() => {
            handlePressBtn(device.buttons.btn_volUp)
          }}
        >
          <BiPlus size={30} />
        </div>
        <div>Vol</div>
        <div
          className='ir-buttons'
          onClick={() => {
            handlePressBtn(device.buttons.btn_volDown)
          }}
        >
          <BiMinus size={30} />
        </div>
      </div>
      <div className='ir-block ok-menu'>
        <div
          className='ir-buttons ok-up'
          onClick={() => {
            handlePressBtn(device.buttons.btn_up)
          }}
        >
          <BiChevronUp size={30} />
        </div>
        <div
          className='ir-buttons ok-left'
          onClick={() => {
            handlePressBtn(device.buttons.btn_left)
          }}
        >
          <BiChevronLeft size={30} />
        </div>
        <div
          className='ir-buttons ok-enter'
          onClick={() => {
            handlePressBtn(device.buttons.btn_ok)
          }}
        >
          OK
        </div>
        <div
          className='ir-buttons ok-right'
          onClick={() => {
            handlePressBtn(device.buttons.btn_right)
          }}
        >
          <BiChevronRight size={30} />
        </div>
        <div
          className='ir-buttons ok-down'
          onClick={() => {
            handlePressBtn(device.buttons.btn_down)
          }}
        >
          <BiChevronDown size={30} />
        </div>
      </div>
      <div className='ir-block chanel'>
        <div
          className='ir-buttons up'
          onClick={() => {
            handlePressBtn(device.buttons.btn_chnUp)
          }}
        >
          <BiPlus size={30} />
        </div>
        <div>CH</div>
        <div
          className='ir-buttons down'
          onClick={() => {
            handlePressBtn(device.buttons.btn_chnDown)
          }}
        >
          <BiMinus size={30} />
        </div>
      </div>
      <div
        className='ir-buttons simple-button mute'
        onClick={() => {
          handlePressBtn(device.buttons.btn_mute)
        }}
      >
        <BiVolumeMute size={25} />
      </div>
      <div
        className='ir-buttons simple-button menu'
        onClick={() => {
          handlePressBtn(device.buttons.btn_home)
        }}
      >
        Menu
      </div>
      <div
        className='ir-buttons simple-button input'
        onClick={() => {
          handlePressBtn(device.buttons.btn_input)
        }}
      >
        <MdInput size={25} />
      </div>
      <div
        className='ir-buttons simple-button info'
        onClick={() => {
          handlePressBtn(device.buttons.btn_info)
        }}
      >
        <BiInfoCircle size={25} />
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_1)
        }}
      >
        1
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_2)
        }}
      >
        2
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_3)
        }}
      >
        3
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_4)
        }}
      >
        4
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_5)
        }}
      >
        5
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_6)
        }}
      >
        6
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_7)
        }}
      >
        7
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_8)
        }}
      >
        8
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_9)
        }}
      >
        9
      </div>
      <div
        className='ir-buttons number back'
        onClick={() => {
          handlePressBtn(device.buttons.btn_back)
        }}
      >
        <RiArrowGoBackFill size={25} />
      </div>
      <div
        className='ir-buttons number'
        onClick={() => {
          handlePressBtn(device.buttons.btn_0)
        }}
      >
        0
      </div>
      <div
        className='ir-buttons number exit'
        onClick={() => {
          handlePressBtn(device.buttons.btn_exit)
        }}
      >
        Exit
      </div>
    </div>
  )
}

export default SmartIR
