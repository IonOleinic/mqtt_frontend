import { useState, useEffect } from 'react'
import DeletedDevice from '../DeletedDevice/DeletedDevice'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { CgUndo } from 'react-icons/cg'
import { IoMdTrash } from 'react-icons/io'
import { confirmDialog } from 'primereact/confirmdialog'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import NoDataFound from '../../NoDataFound/NoDataFound'
import EmptyRecycleBin from './DeletedDevicesIcons/EmptyRecycleBin'
import FullRecycleBin from './DeletedDevicesIcons/FullRecycleBin'
import './DeletedDevices.css'

function DeletedDevices({ devices, refreshDevices }) {
  const axios = useAxiosPrivate()
  const [deletedDevices, setDeletedDevices] = useState([])
  const [visibility, setVisibility] = useState(false)

  const getDeletedDevices = async () => {
    try {
      const response = await axios.get(`/deleted-devices`)
      setDeletedDevices(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const destroyAll = async () => {
    try {
      const destroyList = deletedDevices.map((device) => device.id)
      await axios.delete(`/destroy-all-devices?destroyList=${destroyList}`)
      refreshDevices()
    } catch (error) {
      console.log(error)
    }
  }
  const recoverAll = async () => {
    try {
      const recoverList = deletedDevices.map((device) => device.id)
      await axios.delete(`/recover-all-devices?recoverList=${recoverList}`)
      refreshDevices()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getDeletedDevices()
  }, [devices])

  useEffect(() => {
    if (deletedDevices.length == 0) {
      setTimeout(() => {
        setVisibility(false)
      }, 400)
    }
  }, [deletedDevices])
  return (
    <div className='deleted-devices-container'>
      <Dialog
        header='Deleted Devices'
        visible={visibility}
        style={{ width: '100vw', maxWidth: '370px' }}
        onHide={() => {
          setVisibility(false)
        }}
      >
        <div className='deleted-devices-content'>
          {deletedDevices.length > 0 ? (
            <div className='deleted-devices'>
              {deletedDevices.map((device) => {
                return (
                  <DeletedDevice
                    key={device.id}
                    device={device}
                    refreshDevices={refreshDevices}
                  />
                )
              })}
            </div>
          ) : (
            <NoDataFound />
          )}
          <div
            className={
              deletedDevices.length > 0
                ? 'deleted-devices-toolbar'
                : 'deleted-devices-toolbar-hidden'
            }
          >
            <button
              className='recover-all-devices-btn deleted-devices-toolbar-item'
              onClick={() => {
                confirmDialog({
                  message:
                    deletedDevices.length === 1
                      ? `Do you want to recover device ${deletedDevices[0].name}?`
                      : `Do you want to recover ${deletedDevices.length} devices?`,
                  header: 'Recover Confirmation',
                  icon: 'pi pi-undo',
                  accept: () => {
                    recoverAll()
                  },
                  reject: () => {},
                })
              }}
            >
              <CgUndo size={30} />
              <p>Recover all</p>
            </button>
            <button
              className='destroy-all-devices-btn deleted-devices-toolbar-item'
              onClick={() => {
                confirmDialog({
                  message:
                    deletedDevices.length === 1
                      ? `Do you want to destroy device ${deletedDevices[0].name}?`
                      : `Do you want to destroy ${deletedDevices.length} devices?`,
                  header: 'Destroy Confirmation',
                  icon: 'pi pi-trash',
                  defaultFocus: 'reject',
                  acceptClassName: 'p-button-danger',
                  accept: () => {
                    destroyAll()
                  },
                  reject: () => {},
                })
              }}
            >
              <IoMdTrash size={27} />
              <p>Destroy all</p>
            </button>
          </div>
          <Button
            style={{ marginTop: '30px' }}
            label='Ok'
            onClick={() => {
              setVisibility(false)
            }}
          />
        </div>
      </Dialog>
      <div
        className='recycle-bin'
        onClick={() => {
          setVisibility((prev) => !prev)
        }}
      >
        {deletedDevices.length > 0 ? (
          <FullRecycleBin size={60} />
        ) : (
          <EmptyRecycleBin size={60} />
        )}
      </div>
    </div>
  )
}

export default DeletedDevices
