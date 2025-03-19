import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navigation from './components/Navigation/Navigation'
import Dashboard from './pages/Dashboard/Dashboard'
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
import AppLayout from './components/Layouts/AppLayout'
import RequireAuth from './components/Auth/RequireAuth'
import PersistLogin from './components/Auth/PersistLogin'

function App() {
  return (
    <>
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <Navigation />
      <Routes>
        <Route path='/' element={<AppLayout />}>
          {/*Public Routes */}
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />

          {/*Private Routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/' element={<Navigate to='/dashboard' />} />
              <Route path='/devices' element={<Devices />} />
              <Route path='/scenes' element={<Scenes />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/devices/add-device' element={<AddDevice />} />
              <Route path='/devices/edit-device/:id' element={<EditDevice />} />
              <Route path='/scenes/add-schedule' element={<AddSchedule />} />
              <Route
                path='/scenes/add-device-scene'
                element={<AddDeviceScene />}
              />
              <Route
                path='/scenes/add-weather-scene'
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
