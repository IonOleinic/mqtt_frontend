import 'bootstrap/dist/css/bootstrap.min.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Main from './pages/Main/Main'
import Home from './pages/Home/Home'
import Devices from './pages/Devices/AllDevices/AllDevices'
import Scenes from './pages/Scenes/Scenes'
import AddSchedule from './pages/Scenes/AddSchedule/AddSchedule'
import AddDeviceScene from './pages/Scenes/AddDeviceScene/AddDeviceScene'
import AddWeatherScene from './pages/Scenes/AddWeatherScene/AddWeatherScene'
import Settings from './pages/Settings/Settings'
import SignIn from './pages/SignIn/SignIn'
import AddDevice from './pages/Devices/AddDevice/AddDevice'
import EditDevice from './pages/Devices/EditDevice/EditDevice'
import './App.css'
import './Global.css'
function App() {
  return (
    <Router>
      <Main />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path='/devices' element={<Devices />} />
        <Route path='/scenes' element={<Scenes />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/devices/adddevice' element={<AddDevice />} />
        <Route path='/devices/editdevice/:id' element={<EditDevice />} />
        <Route path='/scenes/addschedule' element={<AddSchedule />} />
        <Route path='/scenes/adddevicescene' element={<AddDeviceScene />} />
        <Route path='/scenes/addweatherscene' element={<AddWeatherScene />} />
      </Routes>
    </Router>
  )
}

export default App
