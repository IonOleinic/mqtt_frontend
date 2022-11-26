import React, { useEffect, useState } from 'react'
import './DropDownMenu.css'
function DropDownMenu({
  isOpen,
  toggleSubMenu,
  message,
  items,
  action,
  updateFunc,
}) {
  const [title, setTitle] = useState(message)
  useEffect(() => {}, [])
  return (
    <div class='dropdown'>
      <button
        class='btn btn-secondary dropdown-toggle'
        type='button'
        id='dropdownMenuButton'
        data-toggle='dropdown'
        aria-haspopup='true'
        aria-expanded='false'
        onClick={() => {
          toggleSubMenu()
        }}
      >
        {title}
      </button>
      <div
        class='dropdown-menu'
        aria-labelledby='dropdownMenuButton'
        style={{
          display: isOpen === true ? 'flex' : 'none',
          flexDirection: 'column',
        }}
      >
        {items.map((item, index) => {
          return (
            <i
              key={index}
              class='dropdown-item'
              onClick={() => {
                setTitle(item)
                toggleSubMenu()
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
