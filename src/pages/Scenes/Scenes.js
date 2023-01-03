import React, { useState, useEffect } from 'react'
import Scene from './Scene/Scene'
import './Scenes.css'

const Scenes = () => {
  return (
    <>
      <div className='scenes-container'>
        <Scene mqtt_name='gosund_sp111_1' />
      </div>
    </>
  )
}

export default Scenes
