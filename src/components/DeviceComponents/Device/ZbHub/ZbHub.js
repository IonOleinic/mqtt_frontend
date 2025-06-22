import { useEffect, useState } from 'react'
import { GoClock } from 'react-icons/go'
import { MdSignalCellular1Bar } from 'react-icons/md'
import { MdSignalCellular2Bar } from 'react-icons/md'
import { MdSignalCellular3Bar } from 'react-icons/md'
import { MdSignalCellular4Bar } from 'react-icons/md'
import { CgBatteryFull } from 'react-icons/cg'
import { CgBattery } from 'react-icons/cg'
import { CgBatteryEmpty } from 'react-icons/cg'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { IoMdTrash } from 'react-icons/io'
import { confirmDialog } from 'primereact/confirmdialog'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import './ZbHub.css'
import NoDataFound from '../../../NoDataFound/NoDataFound'
import { Ripple } from 'primereact/ripple'

function ZbHub({ device, refreshDevices }) {
  const axios = useAxiosPrivate()
  const [connectedDevices, setConnectedDevices] = useState([])
  const [zbDevicesvisibility, setZbDevicesVisibility] = useState(false)

  useEffect(() => {
    setConnectedDevices(device.attributes?.connected_devices || [])
  }, [device.attributes?.connected_devices])

  const sendChangePairingMode = async (pairingMode) => {
    try {
      await axios.post(
        `/zbHub/pairing-mode?hub_id=${device.id}&pairing_mode=${pairingMode}`
      )
    } catch (error) {
      console.error('Error changing pairing mode:', error)
    }
  }
  const handleDeleteZbDevice = async (zbDevice) => {
    try {
      const response = await axios.delete(
        `/zbHub/device?hub_id=${device.id}&short_addr=${zbDevice.Device}`
      )
      setConnectedDevices(response.data.connectedDevices || [])
      if (refreshDevices) {
        refreshDevices()
      }
    } catch (error) {
      console.error('Error deleting zb device:', error)
    }
  }

  return (
    <div className='zb-hub'>
      <div className='zb-pair-container'>
        <div className='zb-pair-title'>
          <p>Pairing mode : </p>
          <p
            style={{ color: device.attributes.pairingMode ? 'green' : 'black' }}
          >
            {device.attributes.pairingMode ? 'enabled' : 'disabled'}
          </p>
        </div>
        <div className='zb-pair-btns'>
          <button
            className='zb-pair-btn zb-pair-btn-start'
            disabled={device.attributes.pairingMode}
            onClick={() => sendChangePairingMode(true)}
          >
            Start pairing
          </button>
          <button
            className='zb-pair-btn zb-pair-btn-stop'
            disabled={!device.attributes.pairingMode}
            onClick={() => sendChangePairingMode(false)}
          >
            Stop pairing
          </button>
        </div>
      </div>
      <div className='zb-devices-container'>
        <button
          className='zb-devices-button p-ripple'
          onClick={() => setZbDevicesVisibility(true)}
        >
          <Ripple
            pt={{
              root: { style: { background: 'rgba(55, 55, 55, 0.3)' } },
            }}
          />
          <p>{connectedDevices.length} connected devices</p>
        </button>
        <Dialog
          header='Connected zigbee devices'
          visible={zbDevicesvisibility}
          style={{ width: '100vw', maxWidth: '370px' }}
          onHide={() => {
            setZbDevicesVisibility(false)
          }}
        >
          <div className='zb-devices-content'>
            {connectedDevices.length > 0 ? (
              <div className='zb-devices-preview'>
                {connectedDevices
                  ?.sort((a, b) => b.Device - a.Device)
                  .map((zbDevice) => (
                    <ZbDevicePreview
                      key={zbDevice.Device}
                      zbDevice={zbDevice}
                      handleDeleteZbDevice={handleDeleteZbDevice}
                    />
                  ))}
              </div>
            ) : (
              <NoDataFound />
            )}
            <Button
              style={{ marginTop: '30px' }}
              label='Ok'
              onClick={() => {
                setZbDevicesVisibility(false)
              }}
            />
          </div>
        </Dialog>
      </div>
    </div>
  )
}

function ZbDevicePreview({ zbDevice, handleDeleteZbDevice }) {
  const [batteryIcon, setBatteryIcon] = useState(<></>)
  const [signalIcon, setSignalIcon] = useState(<></>)

  useEffect(() => {
    if (zbDevice.BatteryPercentage !== undefined) {
      if (zbDevice.BatteryPercentage >= 80) {
        setBatteryIcon(<CgBatteryFull size={20} color='black' />)
      } else if (zbDevice.BatteryPercentage >= 30) {
        setBatteryIcon(<CgBattery size={20} color='black' />)
      } else {
        setBatteryIcon(<CgBatteryEmpty size={20} color='black' />)
      }
    } else {
      setBatteryIcon(<></>)
    }
    if (zbDevice.LinkQuality !== undefined) {
      if (zbDevice.LinkQuality >= 150) {
        setSignalIcon(<MdSignalCellular4Bar size={20} />)
      } else if (zbDevice.LinkQuality >= 100) {
        setSignalIcon(<MdSignalCellular3Bar size={20} />)
      } else if (zbDevice.LinkQuality >= 50) {
        setSignalIcon(<MdSignalCellular2Bar size={20} />)
      } else {
        setSignalIcon(<MdSignalCellular1Bar size={20} />)
      }
    } else {
      setSignalIcon(<></>)
    }
  }, [zbDevice])

  const toMinutes = (seconds) => {
    if (!seconds) return ' - - '
    const minutes = Math.floor(seconds / 60)
    if (minutes <= 60) {
      return minutes.toString().padStart(2, '0') + ' m'
    }
    const hours = Math.floor(minutes / 60)
    if (hours <= 24) {
      return hours.toString().padStart(2, '0') + ' h'
    }
    const days = Math.floor(hours / 24)
    if (days <= 365) {
      return days.toString().padStart(2, '0') + ' d'
    }
    const months = Math.floor(days / 30)
    if (months <= 12) {
      return months.toString().padStart(2, '0') + ' y'
    }
    const years = Math.floor(months / 12)
    if (years > 0) {
      return years.toString().padStart(2, '0') + ' y'
    }
    return '?'
  }

  return (
    <div className='zb-device-preview'>
      <div className='zb-device-info'>
        <p>{`(${zbDevice.Device}) ${zbDevice?.Name || 'unknown'}`}</p>
      </div>
      <div className='zb-device-section'>{batteryIcon}</div>
      <div className='zb-device-section'>{signalIcon}</div>
      <div className='zb-device-section zb-device-last-seen'>
        <GoClock size={16} color='black' />
        <p>{toMinutes(zbDevice?.LastSeen)}</p>
      </div>
      <div
        className='zb-device-section zb-device-delete'
        onClick={() => {
          confirmDialog({
            message: `Do you want to destroy and unpair zigbee device (${
              zbDevice.Device
            }) ${zbDevice.Name || ''} ? Associated scenes will be destroyed!`,
            header: 'Destroy Confirmation',
            icon: 'pi pi-trash',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => {
              handleDeleteZbDevice(zbDevice)
            },
            reject: () => {},
          })
        }}
      >
        <IoMdTrash size={20} />
      </div>
    </div>
  )
}

export default ZbHub
