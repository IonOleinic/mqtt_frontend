import React, { useEffect, useState } from 'react'
import './DropDownMenu.css'
function DropDownMenu({ message, items, action, updateFunc }) {
  const [title, setTitle] = useState(message)
  const [isopen, setIsOpen] = useState(false)
  useEffect(() => {}, [])
  return (
    <div className='dropdown'>
      <button
        className='btn btn-secondary dropdown-toggle'
        type='button'
        id='dropdownMenuButton'
        data-toggle='dropdown'
        aria-haspopup='true'
        aria-expanded='false'
        onClick={() => {
          setIsOpen(!isopen)
        }}
        onBlur={() => {
          setTimeout(() => {
            setIsOpen(false)
          }, 250)
        }}
      >
        {title}
      </button>
      <div
        className='dropdown-menu'
        aria-labelledby='dropdownMenuButton'
        style={{
          display: isopen === true ? 'flex' : 'none',
          flexDirection: 'column',
        }}
      >
        {items.map((item, index) => {
          return (
            <i
              key={index}
              className='dropdown-item'
              onClick={() => {
                setTitle(item)
                if (action) {
                  action(item)
                }
                if (updateFunc) {
                  updateFunc(item)
                }
              }}
            >
              {item}
            </i>
          )
        })}
      </div>
    </div>
  )
}

export default DropDownMenu
