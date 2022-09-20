import React from 'react'
import logo from '../../components/Header/logo.png'

const Header = (props) => {
    return (
      <>
        <img src={logo} alt="Logo vinci"></img>
        <h1>{props.course}</h1>
      </>
    )
  }

export default Header