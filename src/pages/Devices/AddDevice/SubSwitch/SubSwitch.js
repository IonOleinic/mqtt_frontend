import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './SubSwitch.css'
function SubSwitch() {
  return (
    <>
    <div className='form-group mt-3'>
          <label>Nr. of Sockets</label>
          <input
            type='text'
            className='form-control mt-1'
            placeholder='Enter number of sockets'
          />
        </div>
    </>
  )
}

export default SubSwitch