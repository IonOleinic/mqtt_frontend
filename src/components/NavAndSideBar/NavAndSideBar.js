import React, { useState } from 'react'
import SideBar from '../SideBar'
import Navbar from '../NavBar'
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
