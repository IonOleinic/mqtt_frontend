import './InactiveLayer.css'

function InactiveLayer({ visibility, message, icon }) {
  return (
    <div className={visibility ? 'inactive-layer' : 'inactive-layer-hidden'}>
      <span
        className={
          message ? 'inactive-layer-message' : 'inactive-layer-message-hidden'
        }
      >
        {icon}
        <p>{message}</p>
      </span>
    </div>
  )
}

export default InactiveLayer
