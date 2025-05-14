import { useState } from 'react'
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
import './SmartIR.css'

function SmartIR({ device }) {
  const axios = useAxiosPrivate()
  const [numbersVisible, setNumbersVisible] = useState(false)

  const handlePressBtn = async (btn) => {
    try {
      await axios.post(`/smartIR?device_id=${device.id}&btn_code=${btn}`)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='smart-ir'>
      <div className='ir-block ir-block-section'>
        <div
          className='ir-button btn-pow'
          onClick={() => {
            handlePressBtn(device.attributes.preset?.buttons?.btn_power?.code)
          }}
        >
          <BiPowerOff size={30} />
        </div>
        <div
          className='ir-button ir-number'
          onClick={() => {
            setNumbersVisible(!numbersVisible)
          }}
        >
          123
        </div>
        <div
          className='ir-button'
          onClick={() => {
            handlePressBtn(device.attributes.preset?.buttons?.btn_exit?.code)
          }}
        >
          Exit
        </div>
        <div
          className='ir-button'
          onClick={() => {
            handlePressBtn(device.attributes.preset?.buttons?.btn_back?.code)
          }}
        >
          <RiArrowGoBackFill size={25} />
        </div>
      </div>
      <div className='ir-block ir-block-section'>
        <div className='ir-block ir-block-vol-ch'>
          <div
            className='ir-button'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_volUp?.code)
            }}
          >
            <BiPlus size={30} />
          </div>
          <div>Vol</div>
          <div
            className='ir-button'
            onClick={() => {
              handlePressBtn(
                device.attributes.preset?.buttons?.btn_volDown?.code
              )
            }}
          >
            <BiMinus size={30} />
          </div>
        </div>
        <div className='ir-block ir-block-ok-menu'>
          <div className='ok-up-container'>
            <div
              className='ir-button'
              onClick={() => {
                handlePressBtn(device.attributes.preset?.buttons?.btn_up?.code)
              }}
            >
              <BiChevronUp size={30} />
            </div>
          </div>
          <div
            className='ir-button'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_left?.code)
            }}
          >
            <BiChevronLeft size={30} />
          </div>
          <div
            className='ir-button'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_ok?.code)
            }}
          >
            OK
          </div>
          <div
            className='ir-button'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_right?.code)
            }}
          >
            <BiChevronRight size={30} />
          </div>
          <div className='ok-down-container'>
            <div
              className='ir-button'
              onClick={() => {
                handlePressBtn(
                  device.attributes.preset?.buttons?.btn_down?.code
                )
              }}
            >
              <BiChevronDown size={30} />
            </div>
          </div>
        </div>
        <div className='ir-block ir-block-vol-ch'>
          <div
            className='ir-button'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_chnUp?.code)
            }}
          >
            <BiPlus size={30} />
          </div>
          <div>CH</div>
          <div
            className='ir-button'
            onClick={() => {
              handlePressBtn(
                device.attributes.preset?.buttons?.btn_chnDown?.code
              )
            }}
          >
            <BiMinus size={30} />
          </div>
        </div>
      </div>
      <div className='ir-block ir-block-section'>
        <div
          className='ir-button'
          onClick={() => {
            handlePressBtn(device.attributes.preset?.buttons?.btn_mute?.code)
          }}
        >
          <BiVolumeMute size={25} />
        </div>
        <div
          className='ir-button'
          onClick={() => {
            handlePressBtn(device.attributes.preset?.buttons?.btn_home?.code)
          }}
        >
          Menu
        </div>
        <div
          className='ir-button'
          onClick={() => {
            handlePressBtn(device.attributes.preset?.buttons?.btn_input?.code)
          }}
        >
          <MdInput size={25} />
        </div>
        <div
          className='ir-button'
          onClick={() => {
            handlePressBtn(device.attributes.preset?.buttons?.btn_info?.code)
          }}
        >
          <BiInfoCircle size={25} />
        </div>
      </div>
      <div
        className={
          numbersVisible ? 'ir-numbers' : 'ir-numbers ir-numbers-hidden'
        }
      >
        <div className='ir-numbers-section'>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_1?.code)
            }}
          >
            1
          </div>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_2?.code)
            }}
          >
            2
          </div>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_3?.code)
            }}
          >
            3
          </div>
        </div>
        <div className='ir-numbers-section'>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_4?.code)
            }}
          >
            4
          </div>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_5?.code)
            }}
          >
            5
          </div>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_6?.code)
            }}
          >
            6
          </div>
        </div>
        <div className='ir-numbers-section'>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_7?.code)
            }}
          >
            7
          </div>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_8?.code)
            }}
          >
            8
          </div>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_9?.code)
            }}
          >
            9
          </div>
        </div>
        <div className='ir-numbers-section ir-numbers-last'>
          <div
            className='ir-button ir-number'
            onClick={() => {
              handlePressBtn(device.attributes.preset?.buttons?.btn_0?.code)
            }}
          >
            0
          </div>
          <div
            className='ir-button ir-number'
            onClick={() => {
              setNumbersVisible((prev) => !prev)
            }}
          >
            X
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartIR
