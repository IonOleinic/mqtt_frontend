import './CheckMessage.css'
function CheckMessage({ icon, message, visibility, textColor }) {
  return (
    <div
      className={`checkmark-div`}
      style={{ display: visibility ? 'flex' : 'none' }}
    >
      <h1 style={{ color: textColor !== undefined ? textColor : 'black' }}>
        {message}
      </h1>
      <div className='icon'>{icon}</div>
    </div>
  )
}

export default CheckMessage
