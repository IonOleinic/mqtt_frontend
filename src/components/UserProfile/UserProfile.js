import { useEffect, useState, useRef } from 'react'
import useAuth from '../../hooks/useAuth'
import useLogout from '../../hooks/useLogout'
import { BiUser } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'
import { BiHelpCircle } from 'react-icons/bi'
import { BiLogOut } from 'react-icons/bi'
import { useClickOutside } from '../../hooks/useClickOutside'
import { confirmDialog } from 'primereact/confirmdialog'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import userMaleIcon from './images/user_male.png'
import userFemaleIcon from './images/user_female.png'
import './UserProfile.css'

function UserProfile(props) {
  const axios = useAxiosPrivate()
  const logout = useLogout()
  const { auth } = useAuth()
  const [user, setUser] = useState({})
  const profileDropDownRef = useRef()
  const [dropDownVisibility, setDropDownVisibility] = useState(false)
  const [userProfileIcon, setUserProfileIcon] = useState(userMaleIcon)

  useClickOutside(profileDropDownRef, () => {
    setDropDownVisibility(false)
  })
  const getUser = async (userId) => {
    try {
      const response = await axios.get(`/user/${userId}`)
      setUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const loadDeviceCache = async () => {
    try {
      const response = await axios.get(`/load-device-cache`)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUser(auth.user?.id)
  }, [auth.user.id])

  useEffect(() => {
    if (user.gender === 'female') {
      setUserProfileIcon(userFemaleIcon)
    }
  }, [user])
  useEffect(() => {
    // console.log('load cache')
    // loadDeviceCache()
  }, [auth.accessToken])
  return (
    <div className='user-profile-container'>
      <div
        className='user-profile-top'
        onClick={() => {
          setDropDownVisibility((prev) => !prev)
        }}
      >
        <div className='user-img-name' ref={profileDropDownRef}>
          <img src={userProfileIcon} alt='' draggable='false' />
          <p>{`Hi, ${auth?.user?.name}`}</p>
        </div>
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
            onClick={() => {
              confirmDialog({
                message: `Are you sure that want to sign out?`,
                header: 'Sign out confirmation',
                icon: 'pi pi-sign-out',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept: () => {
                  logout()
                },
                reject: () => {},
              })
            }}
            isRed={true}
          />
        </ul>
      </div>
    </div>
  )
}
function DropDownItem(props) {
  return (
    <li
      className={
        props.isRed
          ? 'user-profile-item user-profile-item-red'
          : 'user-profile-item'
      }
      onClick={props.onClick}
    >
      {props.img}
      <span>{props.name}</span>
    </li>
  )
}
export default UserProfile
