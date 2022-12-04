import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './SubSwitch.css'
function SubSwitch({setSubProps}) {
  return (
    <>
    <div className='form-group mt-3'>
          <label>Nr. of Sockets</label>
          <input
            pattern="[0-9]{1,5}"
            maxLength={2}
            type='text'
            className='form-control mt-1'
            placeholder='Enter number of sockets'
            onChange={(e)=>{
              setSubProps({nr_of_sockets:e.target.value})
            }}
          />
        </div>
    </>
  )
}

export default SubSwitch