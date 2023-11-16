import CurrentWeather from '../CurrentWeather/CurrentWeather'
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  Icon,
} from './NavBarComponents'
import UserProfile from '../UserProfile/UserProfile'
import useAuth from '../../hooks/useAuth'
const Navbar = ({ toggle, isopen }) => {
  const { auth } = useAuth()

  return (
    <Nav>
      <NavLink
        to='/'
        className='logo'
        onClick={() => {
          if (isopen) {
            toggle()
          }
        }}
      >
        <img
          src={require('./images/smart-home-icon.png')}
          alt='Logo'
          const
          style={{ maxWidth: '80px', paddingTop: '0.5rem' }}
        />
      </NavLink>
      <Icon>
        <Bars isopen={isopen} onClick={toggle} />
      </Icon>
      <NavMenu>
        <NavLink to='/home'>Home</NavLink>
        <NavLink to='/devices'>Devices</NavLink>
        <NavLink to='/scenes'>Scenes</NavLink>
        <NavLink to='/settings'>Settings</NavLink>
      </NavMenu>
      <CurrentWeather />
      <NavBtn>
        {auth?.accessToken ? (
          <UserProfile />
        ) : (
          <NavBtnLink to='/signin'>Sign In</NavBtnLink>
        )}
      </NavBtn>
    </Nav>
  )
}

export default Navbar
