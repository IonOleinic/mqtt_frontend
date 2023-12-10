import React, { useState, useEffect } from 'react'
import Scene from '../../../components/SceneComponents/Scene/Scene'
import { AiOutlinePlus } from 'react-icons/ai'
import DropDownMenu from '../../../components/DropDownMenu/DropDownMenu'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { TbArrowsUpDown } from 'react-icons/tb'
import { TbFilter } from 'react-icons/tb'
import './Scenes.css'
import AddScene from '../AddScene/AddScene'
import add_btn_img from './images/add_btn.png'

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
          <div className='toolbar-scenes-item'>
            <span>
              <TbFilter size={30} />
            </span>
            <DropDownMenu
              className='drop-down-menu'
              title={'Choose...'}
              items={[]}
            />
          </div>
          <div className='toolbar-scenes-item'>
            <span>
              <TbArrowsUpDown size={25} />
            </span>
            <DropDownMenu
              className='drop-down-menu'
              title={'Choose...'}
              items={[]}
            />
          </div>
          <div className='toolbar-scenes-item'>
            <span>Add</span>
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
        {scenes.length === 0 ? (
          <div className='empty-page'>
            <div
              className='empty-page-inner'
              onClick={() => {
                setAddSceneVisibility((prev) => !prev)
              }}
            >
              <p>Your Scene List is Empty. Please click to add one.</p>
              <img src={add_btn_img} alt='add scene button' />
            </div>
          </div>
        ) : (
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
        )}
        <AddScene
          toggleVisibility={setAddSceneVisibility}
          visibility={addSceneVisibility}
        />
      </div>
    </>
  )
}

export default Scenes
