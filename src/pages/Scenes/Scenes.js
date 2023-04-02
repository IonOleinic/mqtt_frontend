import React, { useState, useEffect } from 'react'
import Scene from './Scene/Scene'
import { useNavigate } from 'react-router-dom'
import { BiRefresh } from 'react-icons/bi'
import { AiOutlinePlus } from 'react-icons/ai'
import DropDownMenu from '../DropDownMenu/DropDownMenu'
import { app } from '../api/api'
import './Scenes.css'

const Scenes = () => {
  const navigate = useNavigate()
  const [scenes, setScenes] = useState([])
  const get_scenes = async () => {
    try {
      const response = await app.get('scenes')
      setScenes(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    get_scenes()
  }, [])

  const handleDeleteScene = async (selected_scene_id) => {
    try {
      const response = await app.delete(`/scene/${selected_scene_id}`)
      setScenes(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
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
                navigate('/scenes/adddevicescene')
              }}
            >
              <AiOutlinePlus size={20} color='white' />
            </button>
          </div>
        </div>
        <div className='scenes'>
          {scenes.map((scene) => {
            return (
              <Scene
                init_scene={scene}
                key={scene.id}
                handleDeleteScene={handleDeleteScene}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Scenes
