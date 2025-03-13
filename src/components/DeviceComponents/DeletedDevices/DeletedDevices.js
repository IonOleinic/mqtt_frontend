import { useState, useEffect, useRef } from 'react'
import EmptyRecycleBin from './images/empty-recycle-bin.png'
import FullRecycleBin from './images/full-recycle-bin.png'
import DeletedDevice from '../Device/DeletedDevice/DeletedDevice'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { CgUndo } from 'react-icons/cg'
import { IoMdTrash } from 'react-icons/io'
import { confirmDialog } from 'primereact/confirmdialog'
import './DeletedDevices.css'

function DeletedDevices({ devices, refreshDevices }) {
  const axios = useAxiosPrivate()
  const [deletedDevices, setDeletedDevices] = useState([])
  const [deletedDevicesVisibility, setDeletedDevicesVisibility] =
    useState(false)
  const deletedDevicesRef = useRef()
  useClickOutside(deletedDevicesRef, () => {
    setDeletedDevicesVisibility(false)
  })
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
      const response = await axios.delete(
        `/destroy-all-devices?destroyList=${destroyList}`
      )
      refreshDevices()
    } catch (error) {
      console.log(error)
    }
  }
  const recoverAll = async () => {
    try {
      const recoverList = deletedDevices.map((device) => device.id)
      const response = await axios.delete(
        `/recover-all-devices?recoverList=${recoverList}`
      )
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
        setDeletedDevicesVisibility(false)
      }, 400)
    }
  }, [deletedDevices])
  return (
    <div className='deleted-devices-container' ref={deletedDevicesRef}>
      <div
        className={
          deletedDevicesVisibility
            ? 'deleted-devices-outside'
            : 'deleted-devices-outside deleted-devices-outside-hidden'
        }
      >
        <div
          className={
            deletedDevicesVisibility
              ? 'deleted-devices'
              : 'deleted-devices deleted-devices-hidden'
          }
        >
          {deletedDevices.length > 0 ? (
            deletedDevices.map((device) => {
              return (
                <DeletedDevice
                  key={device.id}
                  device={device}
                  refreshDevices={refreshDevices}
                />
              )
            })
          ) : (
            <>
              <img
                src='https://i.pinimg.com/originals/ae/8a/c2/ae8ac2fa217d23aadcc913989fcc34a2.png'
                alt=''
              />
            </>
          )}
        </div>
        <div
          className={
            deletedDevices.length > 0 && deletedDevicesVisibility
              ? 'deleted-devices-toolbar'
              : deletedDevices.length > 0 && !deletedDevicesVisibility
              ? 'deleted-devices-toolbar deleted-devices-toolbar-hidden-transition'
              : 'deleted-devices-toolbar deleted-devices-toolbar-hidden'
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
            <CgUndo size={25} />
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
                acceptClassName: 'p-button-danger',
                accept: () => {
                  destroyAll()
                },
                reject: () => {},
              })
            }}
          >
            <IoMdTrash size={22} />
            <p>Destroy all</p>
          </button>
        </div>
      </div>

      <div
        className='recycle-bin'
        onClick={() => {
          setDeletedDevicesVisibility((prev) => !prev)
        }}
      >
        <img
          src={deletedDevices.length > 0 ? FullRecycleBin : EmptyRecycleBin}
          alt='recycle-bin-devices'
        />
      </div>
    </div>
  )
}

export default DeletedDevices
