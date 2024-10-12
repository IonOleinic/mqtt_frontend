import { CgUndo } from 'react-icons/cg'
import { IoMdTrash } from 'react-icons/io'
import useDeviceIcon from '../../../../hooks/useDeviceIcon'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { confirmDialog } from 'primereact/confirmdialog'
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
        <button
          className='btn-recover-device deleted-device-btn'
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
          <CgUndo size={25} />
        </button>
        <button
          className='btn-destroy-device deleted-device-btn'
          onClick={() => {
            confirmDialog({
              message: `Do you want to destroy device ${device.name}?`,
              header: 'Destroy Confirmation',
              icon: 'pi pi-trash',
              acceptClassName: 'p-button-danger',
              accept: () => {
                destroyDevice()
              },
              reject: () => {},
            })
          }}
        >
          <IoMdTrash size={22} />
        </button>
      </div>
    </div>
  )
}

export default DeletedDevice
