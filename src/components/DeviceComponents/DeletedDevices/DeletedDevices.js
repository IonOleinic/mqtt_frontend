import { useState, useEffect, useRef } from 'react'
import EmptyRecycleBin from './images/empty-recycle-bin.png'
import FullRecycleBin from './images/full-recycle-bin.png'
import DeletedDevice from '../Device/DeletedDevice/DeletedDevice'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { MdSettingsBackupRestore } from 'react-icons/md'
import { IoMdTrash } from 'react-icons/io'
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
      let response = await axios.get(`/deleted-devices`)
      setDeletedDevices(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const destroyAll = async () => {
    try {
      const destroyList = deletedDevices.map((device) => device.id)
      const response = await axios.delete(
        `/destroy-all-devices-recycle?destroyList=${destroyList}`
      )
      refreshDevices()
    } catch (error) {
      console.log(error)
    }
  }
  const recoverAll = async () => {
    const recoverList = deletedDevices.map((device) => device.id)
    recoverList.forEach(async (deviceId) => {
      try {
        const response = await axios.post(`/recover-device/${deviceId}`)
        console.log(response.data)
        refreshDevices()
      } catch (error) {
        console.log(error)
      }
    })
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
          <div
            className='recover-all-devices-btn deleted-devices-toolbar-item'
            onClick={recoverAll}
          >
            <MdSettingsBackupRestore size={20} />
            <p>Recover all</p>
          </div>
          <div
            className='destroy-all-devices-btn deleted-devices-toolbar-item'
            onClick={destroyAll}
          >
            <IoMdTrash size={20} />
            <p>Destroy all</p>
          </div>
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
