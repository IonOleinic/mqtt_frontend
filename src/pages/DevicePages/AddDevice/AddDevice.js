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
import tasmotaLogoPng from '../../../components/DeviceComponents/ManufacterImages/tasmota-logo-blue.png'
import openBekenLogoPng from '../../../components/DeviceComponents/ManufacterImages/openBeken-logo.png'
import { toast } from 'react-toastify'
import SubSiren from '../../../components/DeviceComponents/AddDeviceComponents/SubSiren/SubSiren'
import wifiLogo from '../../../components/DeviceComponents/ConnectionTypeImages/wifi-logo.png'
import zigbeeLogo from '../../../components/DeviceComponents/ConnectionTypeImages/zigbee-logo.png'
import './AddDevice.css'

const selectedManufacterOptions = [
  {
    name: 'tasmota',
    icon: (
      <img src={tasmotaLogoPng} style={{ width: '20px', height: '20px' }} />
    ),
  },
  {
    name: 'openBeken',
    icon: (
      <img src={openBekenLogoPng} style={{ width: '20px', height: '20px' }} />
    ),
  },
]

function AddDevice() {
  const stepperRef = useRef(null)
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const { selectedOptionTemplate, optionTemplate } = useOptionTemplate()
  const [devices, setDevices] = useState([])
  const [name, setName] = useState('')
  const [mqttName, setMqttName] = useState('')
  const [shortAddr, setShortAddr] = useState('')
  const [isMqttNameValid, setIsMqttNameValid] = useState(undefined)
  const [isShortAddrValid, setIsShortAddrValid] = useState(undefined)
  const [isZbHubValid, setIsZbHubValid] = useState(undefined)
  const [isFirstStepValid, setIsFirstStepValid] = useState(false)
  const [isSecondStepValid, setIsSecondStepValid] = useState(false)
  const [selectedManufacter, setSelectedManufacter] = useState(
    selectedManufacterOptions[0]
  )
  const [selectedZbHub, setSelectedZbHub] = useState(undefined)
  const [selectedTypeGroup, setSelectedTypeGroup] = useState(undefined)
  const [selectedSubTypeGroup, setSelectedSubTypeGroup] = useState(undefined)
  const { typeGroups, subTypeGroups, getSpecificDeviceIcon } =
    useDeviceTypes(selectedTypeGroup)
  const [groupId, setGroupId] = useState(null)
  const [selectedGroup, setSelectedDeviceGroup] = useState({
    id: null,
    name: 'No group',
  })
  const [groups, setGroups] = useState([])
  const [attributes, setAttributes] = useState({})
  const [subDevice, setSubDevice] = useState(undefined)
  const [resultMessage, setResultMessage] = useState('')

  const getDevices = async () => {
    try {
      const response = await axios.get(`/devices`)
      setDevices(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getGroups = async () => {
    try {
      const response = await axios.get('/groups')
      setGroups([{ id: null, name: 'No group' }, ...response.data])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getDevices()
    getGroups()
  }, [])

  useEffect(() => {
    setGroupId(selectedGroup?.id)
  }, [selectedGroup])

  const validateFirstStep = () => {
    setResultMessage('')
    toast.dismiss()
    if (!selectedTypeGroup || !selectedSubTypeGroup) {
      return false
    }
    return true
  }
  const validateSecondStep = () => {
    setResultMessage('')
    toast.dismiss()
    if (selectedSubTypeGroup?.connectionType === 'zigbee') {
      if (selectedZbHub === undefined) {
        toast.error('Zigbee hub is not selected')
        setIsZbHubValid(false)
        return false
      }
      if (shortAddr.length < 4 || shortAddr.length > 12) {
        toast.error('Zigbee short address is not valid')
        setIsShortAddrValid(false)
        return false
      }
    } else {
      if (mqttName.length < 2 || mqttName.length > 30) {
        toast.error('Mqtt name is not valid')
        setIsMqttNameValid(false)
        return false
      }
    }
    return true
  }
  useEffect(() => {
    if (subTypeGroups.length > 0) {
      setSelectedSubTypeGroup(subTypeGroups[0])
    }
  }, [subTypeGroups])

  useEffect(() => {
    const isFirstStepValid = validateFirstStep()
    setIsFirstStepValid(isFirstStepValid)
    if (isFirstStepValid) resetSelectedOptions()
    chooseSubDevice(selectedSubTypeGroup?.type)
  }, [selectedSubTypeGroup])

  useEffect(() => {
    setIsMqttNameValid(true)
  }, [mqttName])
  useEffect(() => {
    setIsShortAddrValid(true)
  }, [shortAddr])
  useEffect(() => {
    setIsZbHubValid(true)
  }, [selectedZbHub])

  const resetSelectedOptions = () => {
    setIsSecondStepValid(false)
    setMqttName('')
    setShortAddr('')
    setSelectedDeviceGroup({ id: null, name: 'No group' })
    setGroupId(null)
    setAttributes({})
    setSubDevice(undefined)
    setSelectedZbHub(undefined)
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
        subDevice = (
          <SubSiren
            mqttName={mqttName}
            manufacter={selectedManufacter?.name}
            setAttributes={setAttributes}
          />
        )
        break
      case 'smartMotionSensor':
        subDevice = undefined
        break
      case 'smartLed':
        subDevice = <SubLed setAttributes={setAttributes} />
        break
      case 'zbHub':
        subDevice = undefined
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
    deviceData.connection_type = selectedSubTypeGroup?.connectionType
    deviceData.group_id = groupId ? Number(groupId) : null
    deviceData.attributes = attributes
    deviceData.attributes.short_addr =
      selectedSubTypeGroup?.connectionType === 'zigbee' ? shortAddr : undefined
    deviceData.attributes.zb_hub_mqtt_name = selectedZbHub?.mqtt_name

    try {
      await axios.post('/device', deviceData)
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
    <div className='dev-step-contn'>
      <Stepper
        ref={stepperRef}
        style={{ flexBasis: '50rem' }}
        orientation='vertical'
        className='dev-step'
      >
        <StepperPanel header='Device Type'>
          <div className='dev-step-content'>
            <div className='dev-step-all-groups'>
              <div className='dev-step-type-groups-contn'>
                <p className='dev-step-groups-title'>Base Groups</p>
                <div className='dev-step-type-groups'>
                  {typeGroups.map((group) => {
                    return (
                      <div
                        className={
                          group?.label == selectedTypeGroup?.label
                            ? 'dev-step-type-group dev-step-type-group-selected'
                            : 'dev-step-type-group'
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
              <div className='dev-step-sub-type-groups-contn'>
                <p className='dev-step-groups-title'>Sub Groups</p>
                {subTypeGroups?.length > 0 ? (
                  <div className='dev-step-sub-type-groups'>
                    {subTypeGroups.map((subTypeGroup) => {
                      return (
                        <div
                          className={
                            subTypeGroup?.label == selectedSubTypeGroup?.label
                              ? 'dev-step-sub-type-group dev-step-sub-type-group-selected'
                              : subTypeGroup?.disabled
                              ? 'dev-step-sub-type-group dev-step-sub-type-group-disabled'
                              : 'dev-step-sub-type-group'
                          }
                          key={subTypeGroup.label}
                          onClick={() => {
                            if (!subTypeGroup.disabled)
                              setSelectedSubTypeGroup(subTypeGroup)
                          }}
                        >
                          <>{subTypeGroup.icon}</>
                          <p>{subTypeGroup.label}</p>
                          {subTypeGroup.connectionType && (
                            <img
                              src={
                                subTypeGroup.connectionType === 'zigbee'
                                  ? zigbeeLogo
                                  : wifiLogo
                              }
                              alt='connection type icon'
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className='dev-step-empty-sub-type-groups'>
                    <p>Please select a base device group.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='dev-step-buttons'>
            <Button
              label='Next'
              icon='pi pi-arrow-right'
              iconPos='right'
              onClick={() => {
                const isFirstStepValid = validateFirstStep()
                setIsFirstStepValid(isFirstStepValid)
                if (isFirstStepValid) {
                  stepperRef.current.nextCallback()
                } else {
                  toast.dismiss()
                  toast.error('Please choose a device type')
                }
              }}
            />
          </div>
        </StepperPanel>
        <StepperPanel header='Name Setup'>
          <div className='dev-step-content'>
            {isFirstStepValid ? (
              <div className='dev-step-name-setup'>
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
                    disabled={
                      selectedSubTypeGroup?.type === 'zbHub'
                        ? true
                        : selectedSubTypeGroup?.connectionType === 'zigbee'
                        ? true
                        : false
                    }
                  />
                </div>
                <div
                  className='form-input-group'
                  style={{
                    display:
                      selectedSubTypeGroup?.connectionType === 'zigbee'
                        ? 'none'
                        : 'flex',
                  }}
                >
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
                <div
                  className='form-input-group'
                  style={{
                    display:
                      selectedSubTypeGroup?.connectionType === 'zigbee'
                        ? 'flex'
                        : 'none',
                  }}
                >
                  <label htmlFor='select-zb-hub'>
                    Select a Hub for zigbee device
                    <span style={{ color: 'red' }}> *</span>
                  </label>
                  <Dropdown
                    id='select-zb-hub'
                    value={selectedZbHub}
                    options={devices
                      .filter((device) => device.device_type === 'zbHub')
                      .map((zbHub) => ({
                        name: zbHub.name,
                        mqtt_name: zbHub.mqtt_name,
                        icon: getSpecificDeviceIcon(zbHub),
                      }))}
                    optionLabel='name'
                    onChange={(e) => {
                      setSelectedZbHub(e.value)
                    }}
                    invalid={!isZbHubValid}
                    valueTemplate={selectedOptionTemplate}
                    itemTemplate={optionTemplate}
                    placeholder='Select a zigbee Hub'
                  />
                </div>
                <div
                  className='form-input-group'
                  style={{
                    display:
                      selectedSubTypeGroup?.connectionType === 'zigbee'
                        ? 'flex'
                        : 'none',
                  }}
                >
                  <label htmlFor='input-short-addr'>
                    Short address of zigbee device
                    <span style={{ color: 'red' }}> *</span>
                  </label>
                  <InputText
                    id='input-short-addr'
                    aria-describedby='short-addr-help'
                    placeholder='0x0000'
                    required
                    invalid={!isShortAddrValid}
                    value={shortAddr}
                    onChange={(e) => {
                      setShortAddr(e.target.value)
                      setMqttName(`zb_${e.target.value}`)
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className='dev-step-prev-steps-required'>
                <p>Please complete previous step.</p>
              </div>
            )}
          </div>
          <div className='dev-step-buttons'>
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
                const isFirstStepValid = validateFirstStep()
                const isSecondStepValid = validateSecondStep()
                setIsFirstStepValid(isFirstStepValid)
                setIsSecondStepValid(isSecondStepValid)
                if (isFirstStepValid) {
                  if (isSecondStepValid) {
                    stepperRef.current.nextCallback()
                  }
                } else {
                  toast.dismiss()
                  toast.error('Please complete previous step')
                }
              }}
            />
          </div>
        </StepperPanel>
        <StepperPanel header='Device Configuration'>
          <div className='dev-step-content'>
            {isFirstStepValid && isSecondStepValid ? (
              <div className='dev-step-device-config'>
                <div
                  className={
                    subDevice === undefined
                      ? 'dev-step-sub-device-contn-hidden'
                      : 'dev-step-sub-device-contn'
                  }
                >
                  {subDevice}
                </div>
                {/* <div
                  className='dev-step-select-conn-type-contn'
                  style={{
                    display:
                      selectedSubTypeGroup?.type === 'zbHub' ? 'none' : 'flex',
                  }}
                >
                  <div className='form-input-group'>
                    <label htmlFor='select-connection-type'>
                      Connection Type
                    </label>
                    <Dropdown
                      id='select-connection-type'
                      value={selectedConnectionType}
                      options={selectedConnectionTypeOptions}
                      optionLabel='name'
                      onChange={(e) => {
                        setSelectedConnectionType(e.value)
                      }}
                      valueTemplate={selectedOptionTemplate}
                      itemTemplate={optionTemplate}
                      placeholder='Select connection type'
                    />
                  </div>
                </div> */}
                <div className='dev-step-select-group-contn'>
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
              <div className='dev-step-prev-steps-required'>
                <p>Please complete previous steps.</p>
              </div>
            )}
          </div>
          <div className='dev-step-buttons'>
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
          <div className='dev-step-content'>
            <div className='dev-step-summar-data-contn'>
              {isFirstStepValid && isSecondStepValid ? (
                <div className='dev-step-summar-data'>
                  <div className='dev-step-summar-title'>
                    <p>Summarised Options:</p>
                  </div>
                  <div className='dev-step-summar-data'>
                    <div className='dev-step-summar-data-row'>
                      <label>Device Name:</label>
                      <p>{name || '?'}</p>
                    </div>
                    <div className='dev-step-summar-data-row'>
                      <label>Connection Type:</label>
                      <img
                        style={{ maxWidth: '30px', height: '20px' }}
                        src={
                          selectedSubTypeGroup.connectionType === 'zigbee'
                            ? zigbeeLogo
                            : wifiLogo
                        }
                        alt='connection type icon'
                      />
                      <p>({selectedSubTypeGroup.connectionType || 'wifi'})</p>
                    </div>
                    <div className='dev-step-summar-data-row'>
                      <label>
                        {selectedSubTypeGroup?.connectionType === 'zigbee'
                          ? 'Short Address:'
                          : 'MQTT Name:'}
                      </label>
                      <p>
                        {selectedSubTypeGroup?.connectionType === 'zigbee'
                          ? shortAddr
                          : mqttName}
                      </p>
                    </div>
                    <div className='dev-step-summar-data-row'>
                      <label>Manufacter:</label>
                      {selectedManufacter?.icon}
                      <p>{selectedManufacter?.name}</p>
                    </div>
                    <div className='dev-step-summar-data-row'>
                      <label>Type:</label>
                      <p>{selectedTypeGroup?.label}</p>
                    </div>
                    <div className='dev-step-summar-data-row'>
                      <label>Subtype:</label>
                      {selectedSubTypeGroup?.icon}
                      <p>{selectedSubTypeGroup?.label}</p>
                    </div>
                    <div className='dev-step-summar-data-row'>
                      <label>Group:</label>
                      <p>{selectedGroup?.name}</p>
                    </div>
                    <div
                      className={
                        Object.keys(attributes).length > 0 &&
                        selectedSubTypeGroup?.type !== 'smartIR'
                          ? 'dev-step-summar-data-row dev-step-summar-attr-row'
                          : 'hidden'
                      }
                    >
                      <label>Attributes:</label>
                      <div className='dev-step-summar-attr'>
                        {Object.keys(attributes).map((attributeKey, index) => {
                          return (
                            <div
                              className={
                                attributes[attributeKey] !== undefined &&
                                typeof attributes[attributeKey] !== 'object'
                                  ? 'dev-step-attribute-data-row'
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
                      resultMessage ? 'dev-step-res-msg-contn' : 'hidden'
                    }
                  >
                    <Message severity='error' text={resultMessage} />
                  </div>
                </div>
              ) : (
                <div className='dev-step-prev-steps-required'>
                  <p>Please complete previous steps.</p>
                </div>
              )}
            </div>
          </div>
          <div className='dev-step-buttons'>
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
