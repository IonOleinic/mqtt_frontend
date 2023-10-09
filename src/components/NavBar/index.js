import React, { useEffect } from 'react'
import CurrentWeather from './CurrentWeather/CurrentWeather'
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
  function handleResize() {
    if (window.innerWidth > 768 && isOpen === true) {
      toggle()
    }
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <Nav>
      <NavLink
        to='/'
        className='logo'
        onClick={() => {
          if (isOpen) {
            toggle()
          }
        }}
      >
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
        <NavLink to='/home'>Home</NavLink>
        <NavLink to='/devices'>Devices</NavLink>
        <NavLink to='/scenes'>Scenes</NavLink>
        <NavLink to='/settings'>Settings</NavLink>
      </NavMenu>
      <CurrentWeather />
      <NavBtn>
        <NavBtnLink to='/signin'>Sign In</NavBtnLink>
      </NavBtn>
    </Nav>
  )
}

export default Navbar
