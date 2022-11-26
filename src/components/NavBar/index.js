import React, { useEffect } from 'react'
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  Icon,
} from './NavBarComponents'
const Navbar = ({ toggle, isOpen }) => {
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768 && isOpen === true) {
        toggle()
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <Nav>
      <NavLink to='/'>
        <img
          src={require('./images/smart_home_png.png')}
          alt='Logo'
          const
          style={{ maxWidth: '80px', paddingTop: '0 rem' }}
        />
      </NavLink>
      <Icon>
        <Bars isOpen={isOpen} onClick={toggle} />
      </Icon>
      <NavMenu>
        <NavLink to='/home' activestyle='true'>
          Home
        </NavLink>
        <NavLink to='/devices' activestyle='true'>
          Devices
        </NavLink>
        <NavLink to='/scenes' activestyle='true'>
          Scenes
        </NavLink>
        <NavLink to='/settings' activestyle='true'>
          Settings
        </NavLink>
        <NavLink to='/about' activestyle='true'>
          About
        </NavLink>
        <NavBtn>
          <NavBtnLink to='/signin'>Sign In</NavBtnLink>
        </NavBtn>
      </NavMenu>
    </Nav>
  )
}

export default Navbar
