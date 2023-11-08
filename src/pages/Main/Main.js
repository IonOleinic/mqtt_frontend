import React, { useState } from 'react'
import SideBar from '../../components/SideBar'
import Navbar from '../../components/NavBar'
function Main() {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <SideBar isopen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} isopen={isOpen} />
    </>
  )
}

export default Main
