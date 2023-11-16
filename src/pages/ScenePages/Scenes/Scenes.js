import React, { useState, useEffect } from 'react'
import Scene from '../../../components/SceneComponents/Scene/Scene'
import { BiRefresh } from 'react-icons/bi'
import { AiOutlinePlus } from 'react-icons/ai'
import DropDownMenu from '../../../components/DropDownMenu/DropDownMenu'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import './Scenes.css'
import AddScene from '../AddScene/AddScene'

const Scenes = () => {
  const [scenes, setScenes] = useState([])
  const [addSceneVisibility, setAddSceneVisibility] = useState(false)
  const axios = useAxiosPrivate()
  const getScenes = async () => {
    try {
      const response = await axios.get('/scenes')
      setScenes(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getScenes()
  }, [])

  const handleDeleteScene = async (selected_scene_id) => {
    try {
      const response = await axios.delete(`/scene/${selected_scene_id}`)
      setScenes(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <>
      <div className='scenes-container'>
        <div className='toolbar-scenes'>
          <div
            className='toolbar-scenes-item refresh-icon'
            onClick={() => {
              getScenes()
            }}
          >
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
                setAddSceneVisibility(true)
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
        <AddScene
          toggleVisibility={setAddSceneVisibility}
          visibility={addSceneVisibility}
        />
      </div>
    </>
  )
}

export default Scenes
