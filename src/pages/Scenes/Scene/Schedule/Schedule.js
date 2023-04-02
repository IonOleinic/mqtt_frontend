import React, { useEffect } from 'react'
import './Schedule.css'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { TbRepeatOnce } from 'react-icons/tb'
import { BsClock } from 'react-icons/bs'
function Schedule({ scene }) {
  useEffect(() => {}, [])
  const addZero = (i) => {
    if (i <= 9) {
      return '0' + i
    } else {
      return i
    }
  }
  return (
    <div className='schedule'>
      <div className='schedule-top'>
        <div className='schedule-device'>
          <img src={scene.device_img} alt='schedule device img' />
          <p>{scene.device_name}</p>
        </div>
        <div className='arrow-right'>
          <HiOutlineArrowRight size={30} color={'black'} />
        </div>
        <div className='schedule-action'>
          <p>{scene.actionText}</p>
        </div>
      </div>
      <div className='schedule-time'>
        <div className='schedule-time-group'>
          <span className='schedule-clock-icon'>
            <BsClock size={18} color={'black'} />
          </span>
          <p>{addZero(scene.hour)}</p>
          <p>:</p>
          <p>{scene.minute}</p>
          <span
            className='schedule-repeat-once-icon'
            style={{
              display: scene.dayOfWeek == '' ? 'inline' : 'none',
            }}
          >
            <TbRepeatOnce size={18} color={'red'} />
          </span>
        </div>
      </div>
      <div className='schedule-repeat'>
        <p
          style={{
            color: scene.dayOfWeek.includes(1) ? 'black' : '#ccc',
            borderColor: scene.dayOfWeek.includes(1) ? 'black' : '#ccc',
          }}
        >
          Mon
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(2) ? 'black' : '#ccc',
            borderColor: scene.dayOfWeek.includes(2) ? 'black' : '#ccc',
          }}
        >
          Tue
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(3) ? 'black' : '#ccc',
            borderColor: scene.dayOfWeek.includes(3) ? 'black' : '#ccc',
          }}
        >
          Wed
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(4) ? 'black' : '#ccc',
            borderColor: scene.dayOfWeek.includes(4) ? 'black' : '#ccc',
          }}
        >
          Thru
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(5) ? 'black' : '#ccc',
            borderColor: scene.dayOfWeek.includes(5) ? 'black' : '#ccc',
          }}
        >
          Fri
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(6) ? 'black' : '#ccc',
            borderColor: scene.dayOfWeek.includes(6) ? 'black' : '#ccc',
          }}
        >
          Sat
        </p>
        <p
          style={{
            color: scene.dayOfWeek.includes(0) ? 'black' : '#ccc',
            borderColor: scene.dayOfWeek.includes(0) ? 'black' : '#ccc',
          }}
        >
          Sun
        </p>
      </div>
      <span
        className='scene-disabled-mask'
        style={{ display: scene.active == 'true' ? 'none' : 'revert' }}
      ></span>
    </div>
  )
}

export default Schedule
