import React, { useState, useEffect } from 'react'
import Scene from '../../../components/SceneComponents/Scene/Scene'
import { AiOutlinePlus } from 'react-icons/ai'
import DropDownMenu from '../../../components/DropDownMenu/DropDownMenu'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { TbArrowsUpDown } from 'react-icons/tb'
import { TbFilter } from 'react-icons/tb'
import './Scenes.css'
import AddScene from '../AddScene/AddScene'
import AddBtn from '../../../components/AddBtn/AddBtn'
import ConfirmationDialog from '../../../components/ConfirmationDialog/ConfirmationDialog'
import { FaTrashAlt } from 'react-icons/fa'

const Scenes = () => {
  const [scenes, setScenes] = useState([])
  const [addSceneVisibility, setAddSceneVisibility] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState(undefined)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
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
  const getScene = async (sceneId) => {
    try {
      const response = await axios.get(`/scene/${sceneId}`)
      setSceneToDelete(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getScenes()
  }, [])

  const handleConfirmDelete = async () => {
    if (sceneToDelete)
      try {
        const response = await axios.delete(`/scene/${sceneToDelete.id}`)
        setScenes(response.data)
      } catch (error) {
        console.log(error.message)
      }
  }
  const handleCancelDelete = () => {
    // Cancel the deletion
    setSceneToDelete(undefined)
    setConfirmDialogOpen(false)
  }
  const handleDeleteScene = (sceneId) => {
    setConfirmDialogOpen(true)
    getScene(sceneId)
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
          <>
            <div className='empty-page'>
              <div
                className='empty-page-inner'
                onClick={() => {
                  setAddSceneVisibility((prev) => !prev)
                }}
              >
                <p>Your scene list is empty. Please click to add one.</p>
                <AddBtn size={150} />
              </div>
            </div>
          </>
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
        <ConfirmationDialog
          isOpen={confirmDialogOpen}
          dialogType={'delete'}
          icon={<FaTrashAlt size={18} />}
          title={'Delete scene'}
          message={`delete scene "${sceneToDelete?.name}"`}
          onConfirm={() => {
            handleConfirmDelete()
            setConfirmDialogOpen(false)
          }}
          onCancel={handleCancelDelete}
        />
      </div>
    </>
  )
}

export default Scenes
