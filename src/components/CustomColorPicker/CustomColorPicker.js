import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { HexColorPicker } from 'react-colorful'
import './CustomColorPicker.css'

function ColorPicker({ color, onChange, visibility, setVisibility, onFinish }) {
  return (
    <Dialog
      header='Color Picker'
      visible={visibility}
      style={{ width: '100vw', maxWidth: '370px' }}
      onHide={() => {
        if (onFinish) onFinish()
        setVisibility(false)
      }}
    >
      <div
        className='custom-color-picker'
        style={{
          display: visibility == false ? 'none' : 'flex',
        }}
      >
        <HexColorPicker
          color={color}
          onChange={onChange}
          style={{ width: '100%', height: '300px' }}
        />
        <Button
          label='Ok'
          onClick={() => {
            if (onFinish) onFinish()
            setVisibility(false)
          }}
        />
      </div>
    </Dialog>
  )
}

export default ColorPicker
