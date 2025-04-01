import { useEffect, useRef, useState } from 'react'
import { Stepper } from 'primereact/stepper'
import { StepperPanel } from 'primereact/stepperpanel'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Message } from 'primereact/message'
import useDeviceTypes from '../../../hooks/useDeviceTypes'
import useOptionTemplate from '../../../hooks/useOptionTemplate'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import SubSwitch from '../../../components/DeviceComponents/AddDeviceComponents/SubSwitch/SubSwitch'
import SubIR from '../../../components/DeviceComponents/AddDeviceComponents/SubIR/SubIR'
import SubLed from '../../../components/DeviceComponents/AddDeviceComponents/SubLed/SubLed'
import { useNavigate } from 'react-router-dom'
import tasmotaLogoPng from './images/tasmota-logo-blue.png'
import openBekenLogoPng from './images/openBeken-logo.png'
import { toast } from 'react-toastify'
import './AddDevice.css'

const tasmotaIcon = (
  <img src={tasmotaLogoPng} style={{ width: '20px', height: '20px' }} />
)
const openBekenIcon = (
  <img src={openBekenLogoPng} style={{ width: '20px', height: '20px' }} />
)

const selectedManufacterOptions = [
  { name: 'tasmota', icon: tasmotaIcon },
  { name: 'openBeken', icon: openBekenIcon },
]

function AddDevice() {
  const stepperRef = useRef(null)
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const { selectedOptionTemplate, optionTemplate } = useOptionTemplate()
  const [name, setName] = useState('')
  const [mqttName, setMqttName] = useState('')
  const [isMqttNameValid, setIsMqttNameValid] = useState(undefined)
  const [isFirstStepValid, setIsFirstStepValid] = useState(false)
  const [isSecondStepValid, setIsSecondStepValid] = useState(false)
  const [selectedManufacter, setSelectedManufacter] = useState(
    selectedManufacterOptions[0]
  )
  const [selectedTypeGroup, setSelectedTypeGroup] = useState(undefined)
  const [selectedSubTypeGroup, setSelectedSubTypeGroup] = useState(undefined)
  const { typeGroups, subTypeGroups } = useDeviceTypes(selectedTypeGroup)
  const [groupId, setGroupId] = useState(null)
  const [selectedGroup, setSelectedDeviceGroup] = useState({
    id: null,
    name: 'No group',
  })
  const [groups, setGroups] = useState([])
  const [attributes, setAttributes] = useState({})
  const [subDevice, setSubDevice] = useState(undefined)
  const [resultMessage, setResultMessage] = useState('')

  const getGroups = async () => {
    try {
      let response = await axios.get('/groups')
      setGroups([{ id: null, name: 'No group' }, ...response.data])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getGroups()
  }, [])

  useEffect(() => {
    setGroupId(selectedGroup?.id)
  }, [selectedGroup])

  const validateFirstStep = () => {
    setResultMessage('')
    let isValid = false
    if (mqttName.length >= 2 && mqttName.length < 30) {
      isValid = true
    } else {
      isValid = false
    }
    setIsMqttNameValid(isValid)
    setIsFirstStepValid(isValid)
    return isValid
  }
  const validateSecondStep = () => {
    setResultMessage('')
    let isValid = false
    if (selectedTypeGroup && selectedSubTypeGroup) {
      isValid = true
      setIsSecondStepValid(true)
    } else {
      isValid = false
      setIsSecondStepValid(false)
    }
    return isValid
  }
  useEffect(() => {
    if (subTypeGroups.length > 0) {
      setSelectedSubTypeGroup(subTypeGroups[0])
    }
  }, [subTypeGroups])

  useEffect(() => {
    validateSecondStep()
    chooseSubDevice(selectedSubTypeGroup?.type)
  }, [selectedSubTypeGroup])

  useEffect(() => {
    if (validateFirstStep()) resetSelectedOptions()
  }, [mqttName])

  const resetSelectedOptions = () => {
    setIsSecondStepValid(false)
    setSelectedTypeGroup(undefined)
    setSelectedSubTypeGroup(undefined)
    setSelectedDeviceGroup({ id: null, name: 'No group' })
    setGroupId(null)
    setAttributes({})
    setSubDevice(undefined)
  }
  const chooseSubDevice = (type) => {
    setAttributes({})
    let subDevice = undefined
    switch (type) {
      case 'smartPlug':
      case 'smartStrip':
      case 'smartSwitch':
      case 'smartValve':
        subDevice = (
          <SubSwitch
            setAttributes={setAttributes}
            sub_type={selectedSubTypeGroup?.sub_type}
          />
        )
        break
      case 'smartIR':
        subDevice = (
          <SubIR
            mqttName={mqttName}
            manufacter={selectedManufacter?.name}
            setAttributes={setAttributes}
          />
        )
        break
      case 'smartDoorSensor':
        subDevice = undefined
        break
      case 'smartTempSensor':
        subDevice = undefined
        break
      case 'smartSirenAlarm':
        subDevice = undefined
        break
      case 'smartMotionSensor':
        subDevice = undefined
        break
      case 'smartLed':
        subDevice = <SubLed setAttributes={setAttributes} />
        break
      default:
        subDevice = undefined
        break
    }
    setSubDevice(subDevice)
  }
  const handleAddDevice = async () => {
    setResultMessage('')
    let deviceData = {}
    deviceData.name = name
      ? name
      : 'device_' + Math.random().toString(16).slice(2, 7)
    deviceData.mqtt_name = mqttName
    deviceData.manufacter = selectedManufacter?.name
    deviceData.device_type = selectedSubTypeGroup?.type
    deviceData.sub_type = selectedSubTypeGroup?.sub_type
    deviceData.group_id = groupId ? Number(groupId) : null
    deviceData.attributes = attributes
    try {
      let response = await axios.post('/device', deviceData)
      navigate('/devices')
    } catch (error) {
      console.log(error)
      toast.dismiss()
      toast.error(
        error.response.data?.msg || 'Error occured!. Please try again.'
      )
      setResultMessage(
        error.response.data?.msg || 'Error occured!. Please try again.'
      )
    }
  }

  return (
    <div className='device-stepper-container'>
      <Stepper
        ref={stepperRef}
        style={{ flexBasis: '50rem' }}
        orientation='vertical'
        className='device-stepper'
      >
        <StepperPanel header='Initial Setup'>
          <div className='content-container'>
            <div className='initial-setup-container'>
              <div className='form-input-group'>
                <label htmlFor='input-device-name'>Device Name</label>
                <InputText
                  id='input-device-name'
                  aria-describedby='device-name-help'
                  placeholder='Type Device Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='form-input-group'>
                <label htmlFor='select-manufacter'>Manufacter</label>
                <Dropdown
                  id='select-manufacter'
                  value={selectedManufacter}
                  options={selectedManufacterOptions}
                  optionLabel='name'
                  onChange={(e) => {
                    setSelectedManufacter(e.value)
                  }}
                  valueTemplate={selectedOptionTemplate}
                  itemTemplate={optionTemplate}
                  placeholder='Select a manufacter'
                />
              </div>
              <div className='form-input-group'>
                <label htmlFor='input-mqtt-name'>
                  MQTT Name <span style={{ color: 'red' }}>*</span>
                </label>
                <InputText
                  id='input-mqtt-name'
                  aria-describedby='mqtt-name-help'
                  placeholder='Type MQTT Name'
                  required
                  invalid={!isMqttNameValid}
                  value={mqttName}
                  onChange={(e) => {
                    setMqttName(e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
          <div className='buttons'>
            <Button
              label='Next'
              icon='pi pi-arrow-right'
              iconPos='right'
              onClick={() => {
                if (validateFirstStep()) {
                  stepperRef.current.nextCallback()
                } else {
                  toast.dismiss()
                  toast.error('Mqtt name is not valid')
                }
              }}
            />
          </div>
        </StepperPanel>
        <StepperPanel header='Device Type'>
          <div className='content-container'>
            {isFirstStepValid ? (
              <div className='all-groups-container'>
                <div className='type-groups-container'>
                  <p className='type-groups-title'>Base Groups</p>
                  <div className='type-groups'>
                    {typeGroups.map((group) => {
                      return (
                        <div
                          className={
                            group?.label == selectedTypeGroup?.label
                              ? 'type-group type-group-selected'
                              : 'type-group'
                          }
                          key={group.label}
                          onClick={() => {
                            setSelectedTypeGroup(group)
                          }}
                        >
                          <>{group.icon}</>
                          <p>{group.label}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className='sub-type-groups-container'>
                  <p className='sub-type-groups-title'>Sub Groups</p>
                  {subTypeGroups?.length > 0 ? (
                    <div className='sub-type-groups'>
                      {subTypeGroups.map((subTypeGroup) => {
                        return (
                          <div
                            className={
                              subTypeGroup?.label == selectedSubTypeGroup?.label
                                ? 'sub-type-group sub-type-group-selected'
                                : 'sub-type-group'
                            }
                            key={subTypeGroup.label}
                            onClick={() =>
                              setSelectedSubTypeGroup(subTypeGroup)
                            }
                          >
                            <>{subTypeGroup.icon}</>
                            <p>{subTypeGroup.label}</p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className='empty-sub-type-groups'>
                      <p>Please select a base device group.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='previous-steps-required-container'>
                <p>Please complete previous step.</p>
              </div>
            )}
          </div>
          <div className='buttons'>
            <Button
              label='Back'
              severity='secondary'
              icon='pi pi-arrow-left'
              onClick={() => stepperRef.current.prevCallback()}
            />
            <Button
              label='Next'
              icon='pi pi-arrow-right'
              iconPos='right'
              onClick={() => {
                if (validateFirstStep()) {
                  if (validateSecondStep()) {
                    stepperRef.current.nextCallback()
                  } else {
                    toast.dismiss()
                    toast.error('Please select a device type')
                  }
                } else {
                  toast.dismiss()
                  toast.error('Please complete the first step')
                }
              }}
            />
          </div>
        </StepperPanel>
        <StepperPanel header='Device Configuration'>
          <div className='content-container'>
            {isFirstStepValid && isSecondStepValid ? (
              <div className='device-config-container'>
                <div
                  className={
                    subDevice === undefined
                      ? 'sub-device-container-hidden'
                      : 'sub-device-container'
                  }
                >
                  {subDevice}
                </div>
                <div className='select-group-container'>
                  <div className='form-input-group'>
                    <label htmlFor='select-device-group'>Add to a group</label>
                    <Dropdown
                      id='select-device-group'
                      value={selectedGroup}
                      options={groups}
                      optionLabel='name'
                      onChange={(e) => {
                        setSelectedDeviceGroup(e.value)
                        setGroupId(e.value?.id)
                      }}
                      placeholder='Select a device group'
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className='previous-steps-required-container'>
                <p>Please complete previous steps.</p>
              </div>
            )}
          </div>
          <div className='buttons'>
            <Button
              label='Back'
              severity='secondary'
              icon='pi pi-arrow-left'
              onClick={() => stepperRef.current.prevCallback()}
            />
            <Button
              label='Next'
              icon='pi pi-arrow-right'
              iconPos='right'
              onClick={() => {
                if (validateFirstStep() && validateSecondStep()) {
                  stepperRef.current.nextCallback()
                } else {
                  toast.dismiss()
                  toast.error('Please complete the previous steps')
                }
              }}
            />
          </div>
        </StepperPanel>
        <StepperPanel header='Finish'>
          <div className='content-container'>
            {isFirstStepValid && isSecondStepValid ? (
              <div className='summarised-data-container'>
                <div className='summarised-title'>
                  <p>Summarised Options:</p>
                </div>
                <div className='summarised-data'>
                  <div className='summarised-data-row'>
                    <label>Device Name:</label>
                    <p>{name || '?'}</p>
                  </div>
                  <div className='summarised-data-row'>
                    <label>MQTT Name:</label>
                    <p>{mqttName}</p>
                  </div>
                  <div className='summarised-data-row'>
                    <label>Manufacter:</label>
                    {selectedManufacter?.icon}
                    <p>{selectedManufacter?.name}</p>
                  </div>
                  <div className='summarised-data-row'>
                    <label>Type:</label>
                    <p>{selectedTypeGroup?.label}</p>
                  </div>
                  <div className='summarised-data-row'>
                    <label>Subtype:</label>
                    {selectedSubTypeGroup?.icon}
                    <p>{selectedSubTypeGroup?.label}</p>
                  </div>
                  <div className='summarised-data-row'>
                    <label>Group:</label>
                    <p>{selectedGroup?.name}</p>
                  </div>
                  <div
                    className={
                      Object.keys(attributes).length > 0 &&
                      selectedSubTypeGroup?.type !== 'smartIR'
                        ? 'summarised-data-row summarised-attributes-row'
                        : 'hidden'
                    }
                  >
                    <label>Attributes:</label>
                    <div className='summarised-attributes'>
                      {Object.keys(attributes).map((attributeKey, index) => {
                        return (
                          <div
                            className={
                              attributes[attributeKey] !== undefined
                                ? 'attribute-data-row'
                                : 'hidden'
                            }
                            key={index}
                          >
                            <p>
                              {attributeKey.toString()?.replaceAll('_', ' ')}
                            </p>
                            <p>:</p>
                            <p>
                              {attributes[attributeKey]
                                ?.toString()
                                .replace('true', 'Yes')
                                .replace('false', 'No')}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    resultMessage ? 'result-message-container' : 'hidden'
                  }
                >
                  <Message severity='error' text={resultMessage} />
                </div>
              </div>
            ) : (
              <div className='previous-steps-required-container'>
                <p>Please complete previous steps.</p>
              </div>
            )}
          </div>
          <div className='buttons'>
            <Button
              label='Back'
              severity='secondary'
              icon='pi pi-arrow-left'
              onClick={() => stepperRef.current.prevCallback()}
            />
            <Button
              label='Create'
              icon='pi pi-plus'
              iconPos='left'
              onClick={() => {
                if (validateFirstStep() && validateSecondStep()) {
                  handleAddDevice()
                } else {
                  toast.dismiss()
                  toast.error('Please complete the previous steps')
                }
              }}
            />
          </div>
        </StepperPanel>
      </Stepper>
    </div>
  )
}

export default AddDevice
