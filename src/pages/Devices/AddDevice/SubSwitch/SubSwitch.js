import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './SubSwitch.css'
function SubSwitch({ setSubProps }) {
  return (
    <>
      <div className='form-group mt-3'>
        <label htmlFor='input nr-sockets'>Nr. of Sockets</label>
        <input
          id='input nr-sockets'
          pattern='[0-9]{1,5}'
          maxLength={1}
          type='number'
          className='form-control mt-1'
          placeholder='Enter number of sockets'
          onChange={(e) => {
            setSubProps({ nr_of_sockets: e.target.value })
          }}
        />
      </div>
    </>
  )
}

export default SubSwitch
