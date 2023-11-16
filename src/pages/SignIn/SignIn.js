import 'bootstrap/dist/css/bootstrap.min.css'
import './SignIn.css'
import { useState } from 'react'
import useAxios from '../../hooks/useAxios'
import React, { useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { BsEye } from 'react-icons/bs'
import { BsEyeSlash } from 'react-icons/bs'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const viewPasswordIconSimple = <BsEye size={18} />
const viewPasswordIconSlash = <BsEyeSlash size={18} />
const SignIn = () => {
  const axios = useAxios()
  const { setAuth, persist, setPersist } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const emailRef = useRef()
  const passwordRef = useRef()
  const [validEmail, setValidEmail] = useState(true)
  const [validPassword, setValidPassword] = useState(true)
  const [viewPassword, setViewPassword] = useState(false)
  const [viewPasswordIcon, setViewPasswordIcon] = useState(
    viewPasswordIconSimple
  )
  const [visibilityPassIcon, setVisibilityPassIcon] = useState(false)
  const [serverErrorVisibility, setServerErrorVisibility] = useState(false)
  const [serverErrorMsg, setServerErrorMsg] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerErrorVisibility(false)
    setValidEmail(true)
    setValidPassword(true)
    try {
      let response = await axios.post(`./login`, { email, password })
      setAuth((prev) => {
        return {
          ...prev,
          accessToken: response.data.accessToken,
          user: response.data.user,
        }
      })
      sessionStorage.setItem('userId', response.data?.user?.id)
      navigate(from, { replace: true })
    } catch (error) {
      if (!error.response) {
        setServerErrorVisibility(true)
        setServerErrorMsg('No server response!')
      }
      if (error.response.status == 400) {
        if (error.response.data.msg == `User doesn't exist`) {
          setValidEmail(false)
          emailRef.current.focus()
        } else {
          setValidPassword(false)
          passwordRef.current.focus()
        }
      } else if (error.response.status == 500) {
        setServerErrorVisibility(true)
        setServerErrorMsg('Server Error!')
      }
      console.log(error)
    }
  }
  const togglePersist = () => {
    setPersist((prev) => !prev)
  }
  useEffect(() => {
    localStorage.setItem('persist', persist)
  }, [persist])

  return (
    <>
      <div className='Auth-form-container'>
        <form className='Auth-form' onSubmit={handleSubmit}>
          <div className='Auth-form-content'>
            <h3 className='Auth-form-title'>Sign In</h3>
            <div className='form-group mt-3'>
              <label htmlFor='email'>Email address</label>
              <input
                ref={emailRef}
                required
                id='email'
                type='email'
                className={
                  validEmail
                    ? 'form-control mt-1'
                    : 'form-control mt-1 invalid-input'
                }
                placeholder='Enter email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setValidEmail(true)
                  setServerErrorVisibility(false)
                }}
              />
            </div>

            <div
              className={
                validEmail ? 'valid-msg-sign-in' : 'invalid-msg-sign-in '
              }
            >
              <FontAwesomeIcon
                icon={faTimes}
                className='fatimes-icon-sign-in'
              />
              <p>This accout doesn't exist.</p>
            </div>
            <div className='form-group mt-3'>
              <label htmlFor='password'>Password</label>
              <div className='pass-sign-in-div'>
                <input
                  ref={passwordRef}
                  required
                  id='password'
                  type={viewPassword ? 'text' : 'password'}
                  className={
                    validPassword
                      ? 'form-control mt-1'
                      : 'form-control mt-1 invalid-input'
                  }
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setValidPassword(true)
                    setServerErrorVisibility(false)
                    if (e.target.value.length !== 0) {
                      setVisibilityPassIcon(true)
                    } else {
                      setVisibilityPassIcon(false)
                    }
                  }}
                />
                <div
                  className={
                    visibilityPassIcon
                      ? 'show-pass-btn'
                      : 'show-pass-btn show-pass-btn-hidden'
                  }
                  onClick={() => {
                    if (viewPassword == true) {
                      setViewPasswordIcon(viewPasswordIconSimple)
                    } else {
                      setViewPasswordIcon(viewPasswordIconSlash)
                    }
                    setViewPassword(!viewPassword)
                    passwordRef.current.focus()
                    const length = passwordRef.current.value.length
                    setTimeout(() => {
                      passwordRef.current.setSelectionRange(length, length)
                    }, 0)
                  }}
                >
                  {viewPasswordIcon}
                </div>
              </div>
            </div>
            <div
              className={
                validPassword ? 'valid-msg-sign-in' : 'invalid-msg-sign-in '
              }
            >
              <FontAwesomeIcon
                icon={faTimes}
                className='fatimes-icon-sign-in'
              />
              <p>Please check password and try again.</p>
            </div>
            <div className='form-check checkbox-remember-me'>
              <input
                className='form-check-input'
                type='checkbox'
                checked={persist}
                id='flexCheckDefault'
                onChange={togglePersist}
              />
              <label className='form-check-label' htmlFor='flexCheckDefault'>
                Remember Me
              </label>
            </div>
            <div
              className={
                serverErrorVisibility
                  ? 'server-error-sign-in'
                  : 'no-server-error-sign-in'
              }
            >
              <FontAwesomeIcon
                icon={faTimes}
                className='fatimes-icon-sign-in'
              />
              <p>{serverErrorMsg}</p>
            </div>
            <div className='d-grid gap-2 mt-3 align-center'>
              <button className='btn btn-primary login-btn'>Login</button>
            </div>
            <p className='forgot-password text-right mt-2'>
              <a href='./forgot'>Forgot password?</a>
            </p>
            <p className='forgot-password text-right mt-2'>
              Don't have an account? <a href='./signup'>Sign up here</a>
            </p>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignIn
