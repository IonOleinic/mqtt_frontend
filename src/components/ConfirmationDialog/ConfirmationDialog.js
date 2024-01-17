// ConfirmationDialog.js
import React from 'react'
import './ConfirmationDialog.css'
import useAuth from '../../hooks/useAuth'
import { FaTimes } from 'react-icons/fa'
import Draggable from 'react-draggable'
const ConfirmationDialog = ({
  isOpen,
  title,
  icon,
  message,
  onConfirm,
  onCancel,
}) => {
  const { auth } = useAuth()
  return (
    <div
      className={
        isOpen ? 'dialog-container' : 'dialog-container dialog-container-hidden'
      }
    >
      <Draggable handle='.confirm-dialog-top'>
        <div className='confirm-dialog'>
          <div className='confirm-dialog-top'>
            <div className='confirm-dialog-title'>
              {icon}
              <p>{title}</p>
            </div>
            <div className='close-dialog-button' onClick={onCancel}>
              <FaTimes size={20} />
            </div>
          </div>
          <div className='confirm-dialog-body'>
            <div className='confirm-dialog-text'>
              <p>{`Hey ${auth?.user?.name}, are you sure you want to ${message} ?`}</p>
            </div>
            <div className='confirm-dialog-buttons'>
              <button onClick={onConfirm} className='confirm-button'>
                Confirm
              </button>
              <button onClick={onCancel} className='cancel-button'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  )
}

export default ConfirmationDialog
