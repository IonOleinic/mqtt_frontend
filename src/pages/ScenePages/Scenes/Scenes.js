import { useState, useEffect } from 'react'
import Scene from '../../../components/SceneComponents/Scene/Scene'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { TbArrowsUpDown } from 'react-icons/tb'
import { TbFilter } from 'react-icons/tb'
import AddScene from '../AddScene/AddScene'
import AddBtn from '../../../components/AddBtn/AddBtn'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import './Scenes.css'

const Scenes = () => {
  const [scenes, setScenes] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedOrder, setSelectedOrder] = useState('')
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

  const handleDeleteScene = async (sceneId) => {
    try {
      const response = await axios.delete(`/scene/${sceneId}`)
      setScenes(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      <div className='scenes-container'>
        <div className='toolbar'>
          <div className='toolbar-item'>
            <span>
              <TbFilter size={30} />
            </span>
            <Dropdown
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.value)
              }}
              options={['General', 'Favorites']}
              optionLabel='name'
              placeholder='Select a group'
              className='w-full md:w-14rem'
            />
          </div>
          <div className='toolbar-item'>
            <span>
              <TbArrowsUpDown size={25} />
            </span>
            <Dropdown
              value={selectedOrder}
              onChange={(e) => {
                setSelectedOrder(e.value)
              }}
              options={['Date', 'Name']}
              optionLabel='name'
              placeholder='Select a order'
              className='w-full md:w-14rem'
            />
          </div>
          <div className='toolbar-item'>
            <span>Add</span>
            <Button
              icon='pi pi-plus'
              className='mr-2 toolbar-add-btn'
              onClick={() => {
                setAddSceneVisibility(true)
              }}
            />
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
      </div>
    </>
  )
}

export default Scenes
