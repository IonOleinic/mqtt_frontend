import React, { useEffect } from 'react'
import {
  SideBarContainer,
  Icon,
  CloseIcon,
  SideBarWrapper,
  SideBarLink,
  SideBarRoute,
  SideBtnWrap,
  SideBarMenu,
} from './SideBarComponents'
import UserProfile from '../UserProfile/UserProfile'
import useAuth from '../../hooks/useAuth'
function SideBar({ isopen, toggle }) {
  const { auth } = useAuth()
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768 && isopen === true) {
        toggle()
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [window.innerWidth])
  return (
    <SideBarContainer isopen={isopen}>
      <SideBtnWrap>
        {auth?.accessToken ? (
          <UserProfile onClick={toggle} />
        ) : (
          <SideBarRoute to='signin' onClick={toggle}>
            Sign In
          </SideBarRoute>
        )}
      </SideBtnWrap>
      <SideBarWrapper>
        <SideBarMenu onClick={toggle}>
          <SideBarLink to='/home'>Home</SideBarLink>
          <SideBarLink to='/devices'>Devices</SideBarLink>
          <SideBarLink to='/scenes'>Scenes</SideBarLink>
          <SideBarLink to='/settings'>Settings</SideBarLink>
        </SideBarMenu>
      </SideBarWrapper>
    </SideBarContainer>
  )
}

export default SideBar
