import { useRef, useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import { useClickOutside } from '../../hooks/useClickOutside'
import './VerticalMenu.css'

function VerticalMenu({ items }) {
  const verticalMenuRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  useClickOutside(verticalMenuRef, () => {
    setIsOpen(false)
  })
  return (
    <div
      className={
        isOpen ? 'vertical-menu vertical-menu-active' : 'vertical-menu'
      }
      ref={verticalMenuRef}
    >
      <span
        className='vertical-menu-top'
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}
      >
        <FiMoreVertical size={25} />
      </span>
      <ul
        className={
          isOpen
            ? 'vertical-menu-items'
            : 'vertical-menu-items vertical-menu-items-hidden'
        }
      >
        {items?.map((item, index) => {
          return (
            <li
              key={index}
              className={
                item?.isRed
                  ? 'vertical-menu-item vertical-menu-item-red'
                  : 'vertical-menu-item'
              }
              onClick={() => {
                setIsOpen((prev) => !prev)
                if (item.action) {
                  item.action(item.name)
                }
              }}
            >
              <span className='vertical-menu-item-img'>{item.icon} </span>
              <span className='vertical-menu-item-name'>{item.name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default VerticalMenu
