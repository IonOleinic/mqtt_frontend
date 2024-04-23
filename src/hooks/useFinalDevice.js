import { useEffect, useState } from 'react'
import SmartSirenAlarm from '../components/DeviceComponents/Device/SmartAlarmSiren/SmartSirenAlarm'
import SmartLed from '../components/DeviceComponents/Device/SmartLed/SmartLed'
import SmartMotionSensor from '../components/DeviceComponents/Device/SmartMotionSensor/SmartMotionSensor'
import SmartStrip from '../components/DeviceComponents/Device/SmartStrip/SmartStrip'
import SmartIR from '../components/DeviceComponents/Device/SmartIR/SmartIR'
import SmartTempSensor from '../components/DeviceComponents/Device/SmartTempSensor/SmartTempSensor'
import SmartDoorSensor from '../components/DeviceComponents/Device/SmartDoorSensor/SmartDoorSensor'

function useFinalDevice(device) {
  const [finalDevice, setFinalDevice] = useState(<></>)

  useEffect(() => {
    const loadFinalDevice = async () => {
      try {
        if (device.device_type === 'smartStrip') {
          setFinalDevice(<SmartStrip device={device} />)
        } else if (device.device_type === 'smartIR') {
          setFinalDevice(<SmartIR device={device} />)
        } else if (device.device_type === 'smartTempSensor') {
          setFinalDevice(<SmartTempSensor device={device} />)
        } else if (device.device_type === 'smartDoorSensor') {
          setFinalDevice(<SmartDoorSensor device={device} />)
        } else if (device.device_type === 'smartSirenAlarm') {
          setFinalDevice(<SmartSirenAlarm device={device} />)
        } else if (device.device_type === 'smartLed') {
          setFinalDevice(<SmartLed device={device} />)
        } else if (device.device_type === 'smartMotionSensor') {
          setFinalDevice(<SmartMotionSensor device={device} />)
        }
      } catch (error) {
        console.error(
          `Error loading final device for device with id:${device.id}`,
          error
        )
      }
    }
    loadFinalDevice()
  }, [device])

  return finalDevice
}

export default useFinalDevice
