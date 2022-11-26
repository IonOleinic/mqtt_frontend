import React from 'react'
import './Switch.css'

const Switch = ({ isChecked, handlePower, toggleChecked, id }) => {
  return (
    <label className='switch'>
      <input
        id={`toggle_btn${id}`}
        type='checkbox'
        checked={isChecked}
        onClick={() => {
          handlePower(id)
        }}
        onChange={() => {
          toggleChecked(id)
        }}
      ></input>
      <span className='slider round'></span>
    </label>
  )
}

export default Switch
