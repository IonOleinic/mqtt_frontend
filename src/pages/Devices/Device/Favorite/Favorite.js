import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Favorite.css'
function Favorite() {
  return (
    <label for='id-of-input' class='custom-checkbox'>
      <input type='checkbox' id='id-of-input' />
      <i class='glyphicon glyphicon-star-empty'></i>
      <i class='glyphicon glyphicon-star'></i>
      <span>Favorite</span>
    </label>
  )
}

export default Favorite
