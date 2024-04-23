import { useEffect } from 'react'
import { TbDeviceNintendo } from 'react-icons/tb'
import { TbLayoutDashboard } from 'react-icons/tb'
import { TbSettings } from 'react-icons/tb'
import { MdOutlineEventSeat } from 'react-icons/md'
import useAuth from '../../hooks/useAuth'
import { Link, NavLink } from 'react-router-dom'
import UserProfile from '../UserProfile/UserProfile'
import './Sidebar.css'

function NewSidebar({ isOpen, toggle }) {
  const { auth } = useAuth()
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768 && isOpen === true) {
        toggle()
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [window.innerWidth])
  return (
    <aside className={isOpen ? 'sidebar' : 'sidebar sidebar-hidden'}>
      <div className='sidebar-btn'>
        {auth?.accessToken ? (
          <UserProfile onClick={toggle} />
        ) : (
          <Link to='/signin'>
            <button className='signin-btn'>Sign In</button>
          </Link>
        )}
      </div>
      <ul className='sidebar-list' onClick={toggle}>
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
    </aside>
  )
}

function CustomLink({ to, children }) {
  return (
    <NavLink to={to} className='sidebar-link'>
      <li className='sidebar-item'>{children}</li>
      <span className='sidebar-item-bottom-line'></span>
    </NavLink>
  )
}

export default NewSidebar
