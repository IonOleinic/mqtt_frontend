import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { Message } from 'primereact/message'
import { MdOutlineExpandMore } from 'react-icons/md'
import './SubSiren.css'

function SubSiren({ mqttName, manufacter, setAttributes }) {
  const [receiveStatusTopic, setReceiveStatusTopic] = useState(
    `${mqttName}/1/get`
  )
  const [receiveRingtoneTopic, setReceiveRingtoneTopic] = useState(
    `${mqttName}/2/get`
  )
  const [receiveVolumeTopic, setReceiveVolumeTopic] = useState(
    `${mqttName}/3/get`
  )
  const [receiveSoundDurationTopic, setReceiveSoundDurationTopic] = useState(
    `${mqttName}/4/get`
  )
  const [receiveTempTopic, setReceiveTempTopic] = useState(`${mqttName}/5/get`)
  const [receiveHumTopic, setReceiveHumTopic] = useState(`${mqttName}/6/get`)
  const [tempHumSensor, setTempHumSensor] = useState(false)
  const [nrOfRingtones, setNrOfRingtones] = useState(10)
  const [volumeMapper, setVolumeMapper] = useState({
    low: -1,
    medium: -1,
    high: -1,
    mute: -1,
  })
  const [selectedVolumeLabel, setSelectedVolumeLabel] = useState(
    Object.keys(volumeMapper)[0]
  )
  const [advancedVisibility, setAdvancedVisibility] = useState(false)

  useEffect(() => {
    if (tempHumSensor) {
      setAttributes({
        volume_mapper: volumeMapper,
        nr_of_ringtones: nrOfRingtones,
        receive_status_topic: receiveStatusTopic,
        receive_ringtone_topic: receiveRingtoneTopic,
        receive_volume_topic: receiveVolumeTopic,
        receive_sound_duration_topic: receiveSoundDurationTopic,
        receive_temp_topic: receiveTempTopic,
        receive_hum_topic: receiveHumTopic,
        temp_hum_sensor: tempHumSensor,
      })
    } else {
      setAttributes({
        volume_mapper: volumeMapper,
        nr_of_ringtones: nrOfRingtones,
        receive_status_topic: receiveStatusTopic,
        receive_ringtone_topic: receiveRingtoneTopic,
        receive_volume_topic: receiveVolumeTopic,
        receive_sound_duration_topic: receiveSoundDurationTopic,
        temp_hum_sensor: tempHumSensor,
      })
    }
  }, [
    volumeMapper,
    nrOfRingtones,
    receiveStatusTopic,
    receiveRingtoneTopic,
    receiveVolumeTopic,
    receiveSoundDurationTopic,
    receiveTempTopic,
    receiveHumTopic,
    tempHumSensor,
  ])

  return (
    <div className='sub-siren'>
      <div className='form-input-group'>
        <label htmlFor='sub-siren-nr-ringtones-input'>Nr of Ringtones</label>
        <InputNumber
          id='sub-siren-nr-ringtones-input'
          value={nrOfRingtones}
          min={1}
          max={30}
          placeholder='Enter nr of ringtones'
          onChange={(e) => {
            setNrOfRingtones(e.value)
          }}
        />
      </div>
      <div className='form-input-group-inline sub-siren-volume-mapper'>
        <div className='form-input-group sub-siren-volume-label-dropdown'>
          <label htmlFor='sub-siren-selected-vol-label-dropdown'>
            Volume Label
          </label>
          <Dropdown
            id='sub-siren-selected-vol-label-dropdown'
            value={selectedVolumeLabel}
            options={Object.keys(volumeMapper)}
            optionLabel='name'
            placeholder='Select a volume label'
            onChange={(e) => {
              setSelectedVolumeLabel(e.value)
            }}
          />
        </div>
        <div className='form-input-group sub-siren-binded-vol-input'>
          <label htmlFor='sub-siren-binded-vol-input'>Binded Volume</label>
          <InputNumber
            id='sub-siren-binded-vol-input'
            value={volumeMapper[selectedVolumeLabel]}
            placeholder='Enter binded volume'
            min={-1}
            max={3}
            onValueChange={(e) => {
              setVolumeMapper({
                ...volumeMapper,
                [selectedVolumeLabel]: e.value,
              })
            }}
          />
        </div>
      </div>
      <Message text='-1 means that option will not be displayed' />
      <div className='form-input-group-inline'>
        <label htmlFor='sub-siren-temp-hum-checkbox'>
          With Temperature & Humidity Sensor
        </label>
        <Checkbox
          id='sub-siren-temp-hum-checkbox'
          checked={tempHumSensor}
          onChange={(e) => {
            setTempHumSensor(e.checked)
          }}
        />
      </div>
      <div
        className='sub-siren-adv-button'
        onClick={() => {
          setAdvancedVisibility((prev) => !prev)
        }}
      >
        <span
          className={
            advancedVisibility
              ? 'sub-siren-adv-icon sub-siren-adv-icon-rotated'
              : 'sub-siren-adv-icon'
          }
        >
          <MdOutlineExpandMore size={25} />
        </span>
        <p>Advanced</p>
      </div>
      <div
        className={
          advancedVisibility
            ? 'sub-siren-adv'
            : 'sub-siren-adv sub-siren-adv-hidden'
        }
      >
        <div className='form-input-group'>
          <label htmlFor='sub-siren-receive-status-input'>
            Receive Status Topic
          </label>
          <InputText
            id='sub-siren-receive-status-input'
            value={receiveStatusTopic}
            placeholder='Enter status topic'
            onChange={(e) => {
              setReceiveStatusTopic(e.target.value)
            }}
          />
        </div>
        <div className='form-input-group'>
          <label htmlFor='sub-siren-receive-ringtone-input'>
            Receive Ringtone Topic
          </label>
          <InputText
            id='sub-siren-receive-ringtone-input'
            value={receiveRingtoneTopic}
            placeholder='Enter ringtone topic'
            onChange={(e) => {
              setReceiveRingtoneTopic(e.target.value)
            }}
          />
        </div>
        <div className='form-input-group'>
          <label htmlFor='sub-siren-receive-volume-input'>
            Receive Volume Topic
          </label>
          <InputText
            id='sub-siren-receive-volume-input'
            value={receiveVolumeTopic}
            placeholder='Enter volume topic'
            onChange={(e) => {
              setReceiveVolumeTopic(e.target.value)
            }}
          />
        </div>
        <div className='form-input-group'>
          <label htmlFor='sub-siren-receive-sd-input'>
            Receive Sound Duration Topic
          </label>
          <InputText
            id='sub-siren-receive-sd-input'
            value={receiveSoundDurationTopic}
            placeholder='Enter sound duration topic'
            onChange={(e) => {
              setReceiveSoundDurationTopic(e.target.value)
            }}
          />
        </div>
        <div className={tempHumSensor ? 'form-input-group' : 'hidden'}>
          <label htmlFor='sub-siren-receive-temp-input'>
            Receive Temperature Topic
          </label>
          <InputText
            id='sub-siren-receive-temp-input'
            value={receiveTempTopic}
            placeholder='Enter temperature topic'
            onChange={(e) => {
              setReceiveTempTopic(e.target.value)
            }}
          />
        </div>
        <div className={tempHumSensor ? 'form-input-group' : 'hidden'}>
          <label htmlFor='sub-siren-receive-hum-input'>
            Receive Humidity Topic
          </label>
          <InputText
            id='sub-siren-receive-hum-input'
            value={receiveHumTopic}
            placeholder='Enter humidity topic'
            onChange={(e) => {
              setReceiveHumTopic(e.target.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default SubSiren
