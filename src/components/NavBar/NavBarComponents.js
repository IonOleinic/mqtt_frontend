import styled from 'styled-components'
import { NavLink as Link } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'

export const Nav = styled.nav`
  //background: #0384fc;
  background: black;
  height: 80px;
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 3rem;
  z-index: 10;
  @media screen and (min-width: 1070px) {
    padding: 0.5rem 6rem;
  }
  @media screen and (min-width: 1400px) {
    padding: 0.5rem 10rem;
  }
`

export const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 20px;
  padding: 0 0.8rem;
  height: 100%;
  cursor: pointer;
  transition: all 0.2s;
  &.active {
    color: #4abced;
  }
  &:hover {
    color: #4abced;
  }
  @media screen and (max-width: 1020px) {
    font-size: 16px;
  }
  @media screen and (max-width: 900px) {
    font-size: 14px;
  }
`

export const Icon = styled.div`
  display: none;
  color: #fff;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 55%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`

export const Bars = styled(FaBars)`
  @media (max-width: 768px) {
    transform: rotate ${({ isOpen }) => (isOpen ? '(90 deg)' : '(0 deg)')};
  }
`

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* Second Nav */
  /* margin-right: 24px; */
  /* Third Nav */
  width: 100vw;
  white-space: nowrap;
  @media screen and (max-width: 768px) {
    display: none;
  }
`

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  // margin-right: 24px;
  /* Third Nav */
  /* justify-content: flex-end;
  width: 100vw; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`

export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: #256ce1;
  padding: 10px 22px;
  color: #fff;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  /* Second Nav */
  margin-left: 24px;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
  @media screen and (max-width: 1020px) {
    font-size: 16px;
  }
  @media screen and (max-width: 900px) {
    font-size: 14px;
  }
`
