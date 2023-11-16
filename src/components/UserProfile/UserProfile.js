import React, { useEffect, useState, useRef } from 'react'
import './UserProfile.css'
import useAuth from '../../hooks/useAuth'
import useLogout from '../../hooks/useLogout'
import { BiUser } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'
import { BiHelpCircle } from 'react-icons/bi'
import { BiLogOut } from 'react-icons/bi'
import { useClickOutside } from '../../hooks/useClickOutside'
function UserProfile(props) {
  const logout = useLogout()
  const { auth } = useAuth()
  const profileDropDownRef = useRef()
  const [dropDownVisibility, setDropDownVisibility] = useState(false)
  useClickOutside(profileDropDownRef, () => {
    setDropDownVisibility(false)
  })

  return (
    <div className='user-profile'>
      <div
        className='user-img-name'
        onClick={() => {
          setDropDownVisibility((prev) => !prev)
        }}
        ref={profileDropDownRef}
      >
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjVRB7ZmUQnwE-OwQPZyjAsEBOTY4nJQMr652DQ4d8cXqLNz-k7rJNhOywu43nkAsqsPQ&usqp=CAU'
          alt=''
          draggable='false'
        />
        <h3>{`Hi, ${auth?.user?.name}`}</h3>
      </div>
      <div
        className={
          dropDownVisibility
            ? 'profile-dropdown-list'
            : 'profile-dropdown-list profile-dropdown-list-hidden'
        }
        onClick={props.onClick}
      >
        <ul
          onClick={() => {
            setDropDownVisibility(false)
          }}
        >
          <DropDownItem name='Profile' img={<BiUser size={20} />} />
          <DropDownItem name='Settings' img={<FiSettings size={20} />} />
          <DropDownItem name='Help' img={<BiHelpCircle size={20} />} />
          <DropDownItem
            name='Log out'
            img={<BiLogOut size={20} />}
            onClick={logout}
          />
        </ul>
      </div>
    </div>
  )
}
function DropDownItem(props) {
  return (
    <li className='user-profile-item' onClick={props.onClick}>
      {props.img}
      <span>{props.name}</span>
    </li>
  )
}
export default UserProfile
