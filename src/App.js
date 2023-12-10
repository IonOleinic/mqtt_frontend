import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavAndSideBar from './components/NavAndSideBar/NavAndSideBar'
import Home from './pages/Home/Home'
import Devices from './pages/DevicePages/Devices/Devices'
import Scenes from './pages/ScenePages/Scenes/Scenes'
import AddSchedule from './pages/ScenePages/AddScene/AddSchedule/AddSchedule'
import AddDeviceScene from './pages/ScenePages/AddScene/AddDeviceScene/AddDeviceScene'
import AddWeatherScene from './pages/ScenePages/AddScene/AddWeatherScene/AddWeatherScene'
import Settings from './pages/Settings/Settings'
import SignIn from './pages/SignIn/SignIn'
import SignUp from './pages/SignUp/SignUp'
import AddDevice from './pages/DevicePages/AddDevice/AddDevice'
import EditDevice from './pages/DevicePages/EditDevice/EditDevice'
import Layout from './components/Layout/Layout'
import RequireAuth from './components/RequireAuth'
import PersistLogin from './components/PersistLogin'
import './App.css'
import './Global.css'

function App() {
  return (
    <>
      <NavAndSideBar />
      <Routes>
        <Route path='/' element={<Layout />}>
          {/*Public Routes */}
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />

          {/*Private Routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path='/home' element={<Home />} />
              <Route path='/' element={<Navigate to='/home' />} />
              <Route path='/devices' element={<Devices />} />
              <Route path='/scenes' element={<Scenes />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/devices/adddevice' element={<AddDevice />} />
              <Route path='/devices/editdevice/:id' element={<EditDevice />} />
              <Route path='/scenes/addschedule' element={<AddSchedule />} />
              <Route
                path='/scenes/adddevicescene'
                element={<AddDeviceScene />}
              />
              <Route
                path='/scenes/addweatherscene'
                element={<AddWeatherScene />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
