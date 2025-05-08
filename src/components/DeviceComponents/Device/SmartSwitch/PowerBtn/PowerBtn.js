import { FaPowerOff } from 'react-icons/fa'
import './PowerBtn.css'
import { Ripple } from 'primereact/ripple'

const PowerBtn = ({ isChecked, size, handlePower, id }) => {
  return (
    <button
      className={
        isChecked
          ? 'power-btn power-btn-checked p-ripple'
          : 'power-btn p-ripple'
      }
      id={`power_btn${id}`}
      onClick={() => {
        handlePower(id)
      }}
    >
      <FaPowerOff size={size} />
      <Ripple
        pt={{
          root: {
            style: {
              background: isChecked ? '#ccc' : `rgba(99, 101, 241, 0.25)`,
            },
          },
        }}
      />
    </button>
  )
}

export default PowerBtn
