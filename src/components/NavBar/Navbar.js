import UserProfile from '../UserProfile/UserProfile'
import CurrentWeather from '../CurrentWeather/CurrentWeather'
import { TbDeviceNintendo } from 'react-icons/tb'
import { TbLayoutDashboard } from 'react-icons/tb'
import { TbSettings } from 'react-icons/tb'
import { MdOutlineEventSeat } from 'react-icons/md'
import { FaBars } from 'react-icons/fa'
import useAuth from '../../hooks/useAuth'
import { Link, NavLink } from 'react-router-dom'
import smartHomeIcon from './images/smart-home-icon.png'
import './Navbar.css'

function NewNavbar({ toggle, isOpen }) {
  const { auth } = useAuth()
  return (
    <nav className='nav'>
      <Link
        to='/'
        className='nav-logo'
        onClick={() => {
          if (isOpen) {
            toggle()
          }
        }}
      >
        <img src={smartHomeIcon} alt='Logo' />
      </Link>

      <ul className='nav-list'>
        <CustomLink to='/dashboard'>
          <TbLayoutDashboard />
          <p>Dashboard</p>
        </CustomLink>
        <CustomLink to='/devices'>
          <TbDeviceNintendo />
          <p>Devices</p>
        </CustomLink>
        <CustomLink to='/scenes'>
          <MdOutlineEventSeat />
          <p>Scenes</p>
        </CustomLink>
        <CustomLink to='/settings'>
          <TbSettings />
          <p>Settings</p>
        </CustomLink>
      </ul>
      <div className='nav-right'>
        <CurrentWeather />
        <div className='nav-btn'>
          {auth?.accessToken ? (
            <UserProfile />
          ) : (
            <Link to='/signin'>
              <button className='signin-btn'>Sign In</button>
            </Link>
          )}
        </div>
      </div>
      <div
        className={
          isOpen ? 'nav-btn-menu nav-btn-menu-rotated' : 'nav-btn-menu'
        }
        onClick={toggle}
      >
        <FaBars />
      </div>
    </nav>
  )
}

function CustomLink({ to, children }) {
  return (
    <NavLink to={to} className='nav-link'>
      <li className='nav-item'>{children}</li>
      <span className='nav-item-bottom-line'></span>
    </NavLink>
  )
}

export default NewNavbar
