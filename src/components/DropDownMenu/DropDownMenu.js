import React, { useEffect, useRef, useState } from 'react'
import './DropDownMenu.css'
import { useClickOutside } from '../../hooks/useClickOutside'
function DropDownMenu({ message, items, updateFunc }) {
  const [title, setTitle] = useState(message)
  const [isOpen, setIsOpen] = useState(false)
  const dropDownRef = useRef()
  useEffect(() => {}, [])
  const toggleDropDownMenu = () => {
    setIsOpen(false)
  }
  useClickOutside(dropDownRef, toggleDropDownMenu)
  return (
    <div className='dropdown' ref={dropDownRef}>
      <button
        className='btn btn-secondary dropdown-toggle'
        type='button'
        id='dropdownMenuButton'
        data-toggle='dropdown'
        aria-haspopup='true'
        aria-expanded='false'
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        {title}
      </button>
      <div
        className={
          isOpen ? 'dropdown-menu' : 'dropdown-menu dropdown-menu-hidden'
        }
        style={{ display: 'flex', padding: '0.5rem' }}
        aria-labelledby='dropdownMenuButton'
      >
        <ul>
          {items.map((item, index) => {
            return (
              <li
                key={index}
                className={
                  title === item.name
                    ? 'dropdown-item dropdown-item-selected'
                    : 'dropdown-item'
                }
                onClick={() => {
                  setTitle(item.name)
                  if (item.action) {
                    item.action(item.name)
                  }
                  if (updateFunc) {
                    updateFunc(item.name)
                  }
                  setIsOpen(!isOpen)
                }}
              >
                <span className={'dropdown-item-img'}>{item.icon} </span>
                <span className='dropdown-item-name'>{item.name}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default DropDownMenu
