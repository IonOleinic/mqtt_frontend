import { CgUndo } from 'react-icons/cg'
import { IoMdTrash } from 'react-icons/io'
import useDeviceIcon from '../../../hooks/useDeviceIcon'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { confirmDialog } from 'primereact/confirmdialog'
import './DeletedDevice.css'

function DeletedDevice({ device, refreshDevices }) {
  const axios = useAxiosPrivate()
  const { deviceIcon } = useDeviceIcon(device)

  const recoverDevice = async () => {
    try {
      await axios.post(`/recover-device/${device.id}`)
      if (refreshDevices) refreshDevices()
    } catch (error) {
      console.log(error)
    }
  }
  const destroyDevice = async () => {
    try {
      await axios.delete(`/destroy-device/${device.id}`)
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
        <button
          className='recover-device-btn deleted-device-btn'
          onClick={() => {
            confirmDialog({
              message: `Do you want to recover device ${device.name}?`,
              header: 'Recover Confirmation',
              icon: 'pi pi-undo',
              accept: () => {
                recoverDevice()
              },
              reject: () => {},
            })
          }}
        >
          <CgUndo size={28} />
        </button>
        <button
          className='destroy-device-btn deleted-device-btn'
          onClick={() => {
            confirmDialog({
              message: `Do you want to destroy device ${device.name}?`,
              header: 'Destroy Confirmation',
              icon: 'pi pi-trash',
              acceptClassName: 'p-button-danger',
              defaultFocus: 'reject',
              accept: () => {
                destroyDevice()
              },
              reject: () => {},
            })
          }}
        >
          <IoMdTrash size={25} />
        </button>
      </div>
    </div>
  )
}

export default DeletedDevice
