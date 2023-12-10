import React, { useEffect, useRef, useState } from 'react'
import './DropDownMenu.css'
import { useClickOutside } from '../../hooks/useClickOutside'
function DropDownMenu({ title, setTitle, items, showTitleIcon }) {
  const [titleIcon, setTitleIcon] = useState(<></>)
  const [isOpen, setIsOpen] = useState(false)
  const dropDownRef = useRef()
  useEffect(() => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].name === title) {
        setTitleIcon(items[i].icon)
      }
    }
  }, [])
  useClickOutside(dropDownRef, () => {
    setIsOpen(false)
  })
  return (
    <div className='dropdown' ref={dropDownRef}>
      <button
        className='btn btn-secondary dropdown-toggle dropdown-btn'
        type='button'
        id='dropdownMenuButton'
        data-toggle='dropdown'
        aria-haspopup='true'
        aria-expanded='false'
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <span
          className={
            showTitleIcon
              ? 'dropdown-title-icon'
              : 'dropdown-title-icon dropdown-title-icon-hidden'
          }
        >
          {titleIcon}
        </span>
        <span className='dropdown-title-text'>{title}</span>
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
                  setTitleIcon(item.icon)
                  if (item.action) {
                    item.action(item.name)
                  }
                  setIsOpen(!isOpen)
                }}
              >
                <span className='dropdown-item-img'>{item.icon} </span>
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
