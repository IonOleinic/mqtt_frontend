import React, { useState } from 'react'
import SideBar from '../../components/SideBar'
import Navbar from '../../components/NavBar'
function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <SideBar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} isOpen={isOpen} />
    </>
  )
}

export default Menu
