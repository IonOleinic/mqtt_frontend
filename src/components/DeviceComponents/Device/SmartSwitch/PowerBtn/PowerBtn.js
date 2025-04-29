import { FaPowerOff } from 'react-icons/fa'
import './PowerBtn.css'

const PowerBtn = ({ isChecked, size, handlePower, id }) => {
  return (
    <button
      className={isChecked ? 'power-btn power-btn-checked' : 'power-btn'}
      id={`power_btn${id}`}
      onClick={() => {
        handlePower(id)
      }}
    >
      <FaPowerOff size={size} />
    </button>
  )
}

export default PowerBtn
