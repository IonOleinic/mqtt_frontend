import 'bootstrap/dist/css/bootstrap.min.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Menu from './pages/Menu/Menu'
import Home from './pages/Home/Home'
import Devices from './pages/Devices/AllDevices/AllDevices'
import Scenes from './pages/Scenes/Scenes'
import AddSchedule from './pages/Scenes/AddSchedule/AddSchedule'
import AddDeviceScene from './pages/Scenes/AddDeviceScene/AddDeviceScene'
import Settings from './pages/Settings/Settings'
import About from './pages/About/About'
import SignIn from './pages/SignIn/SignIn'
import AddDevice from './pages/Devices/AddDevice/AddDevice'
import EditDevice from './pages/Devices/EditDevice/EditDevice'
import './App.css'
import './Global.css'
function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path='/devices' element={<Devices />} />
        <Route path='/scenes' element={<Scenes />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/about' element={<About />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/devices/adddevice' element={<AddDevice />} />
        <Route path='/devices/editdevice/:id' element={<EditDevice />} />
        <Route path='/scenes/addschedule' element={<AddSchedule />} />
        <Route path='/scenes/adddevicescene' element={<AddDeviceScene />} />
      </Routes>
    </Router>
  )
}

export default App
