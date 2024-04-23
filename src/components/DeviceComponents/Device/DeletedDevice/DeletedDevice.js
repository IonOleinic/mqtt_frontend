import { MdSettingsBackupRestore } from 'react-icons/md'
import { IoMdTrash } from 'react-icons/io'
import useDeviceIcon from '../../../../hooks/useDeviceIcon'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import './DeletedDevice.css'

function DeletedDevice({ device, refreshDevices }) {
  const axios = useAxiosPrivate()
  const { deviceIcon } = useDeviceIcon(device)

  const recoverDevice = async () => {
    try {
      const response = await axios.post(`/recover-device/${device.id}`)
      if (refreshDevices) refreshDevices()
    } catch (error) {
      console.log(error)
    }
  }
  const destroyDevice = async () => {
    try {
      const response = await axios.delete(`/destroy-device/${device.id}`)
      if (refreshDevices) refreshDevices()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='deleted-device'>
      <div className='deleted-device-info'>
        <span className='deleted-device-icon'>{deviceIcon}</span>
        <p className='deleted-device-name'>{device.name}</p>
      </div>
      <div className='deleted-device-btns'>
        <span
          className='btn-recover-device deleted-device-btn'
          onClick={recoverDevice}
        >
          <MdSettingsBackupRestore size={20} />
        </span>
        <span
          className='btn-destroy-device deleted-device-btn'
          onClick={destroyDevice}
        >
          <IoMdTrash size={20} />
        </span>
      </div>
    </div>
  )
}

export default DeletedDevice
