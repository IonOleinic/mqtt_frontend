import React, { useState, useEffect } from 'react'
import Scene from './Scene/Scene'
import { useNavigate } from 'react-router-dom'
import { BiRefresh } from 'react-icons/bi'
import { GrClose } from 'react-icons/gr'
import { AiOutlinePlus } from 'react-icons/ai'
import DropDownMenu from '../DropDownMenu/DropDownMenu'
import { app } from '../api/api'
import './Scenes.css'
const Scenes = () => {
  const navigate = useNavigate()
  return (
    <>
      <div className='scenes-container'>
        <div className='toolbar-scenes'>
          <div className='toolbar-scenes-item refresh-icon' onClick={() => {}}>
            <BiRefresh size={30} />
          </div>
          <div className='toolbar-scenes-item'>
            <p>Filter by</p>
            <DropDownMenu
              className='drop-down-menu'
              message={'choose...'}
              items={[]}
            />
          </div>
          <div className='toolbar-scenes-item'>
            <p>Order by</p>
            <DropDownMenu
              className='drop-down-menu'
              message={'choose...'}
              items={[]}
            />
          </div>
          <div className='toolbar-scenes-item'>
            <p>Add</p>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => {
                navigate('/scenes/addscene')
              }}
            >
              <AiOutlinePlus size={20} color='white' />
            </button>
          </div>
        </div>
        <div className='scenes'>
          <Scene />
        </div>
      </div>
    </>
  )
}

export default Scenes
