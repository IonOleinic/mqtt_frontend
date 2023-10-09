import React from 'react'
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
function SideBar({ isOpen, toggle }) {
  return (
    <SideBarContainer isOpen={isOpen} onClick={toggle}>
      <SideBtnWrap>
        <SideBarRoute to='signin'>Sign In</SideBarRoute>
      </SideBtnWrap>

      <SideBarWrapper>
        <SideBarMenu>
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
