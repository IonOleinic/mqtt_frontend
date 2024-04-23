import { useState } from 'react'
import useAxios from '../../hooks/useAxios'
import { useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import './SignUp.css'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d.@$!%*?&]{8,}$/
const nameRegex = /^[a-zA-Z' -]+$/
function SignUp() {
  const { setAuth } = useAuth()
  const axios = useAxios()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('male')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const emailRef = useRef()
  const [validEmail, setValidEmail] = useState(true)
  const [validName, setValidName] = useState(true)
  const [validPassword, setValidPassword] = useState(true)
  const [validConfirmPassword, setValidConfirmPassword] = useState(true)

  const [serverErrorMsg, setServerErrorMsg] = useState('')
  const [serverErrorVisibility, setServerErrorVisibility] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validEmail && validEmail && validPassword && validConfirmPassword)
      try {
        const response = await axios.post('/register', {
          name,
          email,
          password,
          gender,
        })
        if (response.status === 201) {
          login(email, password)
        }
      } catch (error) {
        console.log(error)
        if (error.response.status === 409) {
          setValidEmail(false)
          emailRef.current.focus()
        } else if (error.response.status === 500) {
          setServerErrorMsg('Server Error. Please try again.')
          setServerErrorVisibility(true)
        }
      }
  }
  const login = async (email, password) => {
    try {
      const response = await axios.post(`./login`, { email, password })
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
      console.log('Failed Login:', error.message)
      navigate('/signin')
    }
  }
  useEffect(() => {
    if (password) setValidPassword(passwordRegex.test(password))
    if (confirmPassword) {
      if (password === confirmPassword) {
        setValidConfirmPassword(true)
      } else {
        setValidConfirmPassword(false)
      }
    }
  }, [password, confirmPassword])
  useEffect(() => {
    if (name) {
      if (name.length >= 3) {
        setValidName(nameRegex.test(name))
      } else {
        setValidName(false)
      }
    }
  }, [name])
  useEffect(() => {
    setValidEmail(true)
  }, [email])
  useEffect(() => {
    setServerErrorVisibility(false)
  }, [name, email, password, confirmPassword])
  return (
    <div className='Auth-form-container'>
      <form className='Auth-form' onSubmit={handleSubmit}>
        <div className='Auth-form-content'>
          <h3 className='Auth-form-title'>Sign Up</h3>
          <div className='form-group mt-3'>
            <label htmlFor='name'>Name</label>
            <input
              required
              id='name'
              type='text'
              className={
                validName
                  ? 'form-control mt-1'
                  : 'form-control mt-1 invalid-input'
              }
              placeholder='Enter name'
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </div>
          <div
            className={
              validName ? 'valid-msg-auth' : 'valid-msg-auth invalid-msg-auth'
            }
          >
            <FontAwesomeIcon icon={faTimes} className='fatimes-icon-auth' />
            <p>Invalid username.</p>
          </div>
          <div className='form-group mt-3'>
            <label>Gender</label>
            <div className='signup-gender-group'>
              <div class='form-check'>
                <input
                  class='form-check-input'
                  type='radio'
                  name='flexRadioDefault'
                  id='flexRadioDefault1'
                  checked={gender === 'male' ? true : false}
                  onChange={(e) => {
                    setGender('male')
                  }}
                />
                <label class='form-check-label' for='flexRadioDefault1'>
                  Male
                </label>
              </div>
              <div class='form-check'>
                <input
                  class='form-check-input'
                  type='radio'
                  name='flexRadioDefault'
                  id='flexRadioDefault2'
                  value='female'
                  checked={gender === 'female' ? true : false}
                  onChange={(e) => {
                    setGender('female')
                  }}
                />
                <label class='form-check-label' for='flexRadioDefault2'>
                  Female
                </label>
              </div>
            </div>
          </div>
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
              }}
            />
          </div>
          <div
            className={
              validEmail ? 'valid-msg-auth' : 'valid-msg-auth invalid-msg-auth'
            }
          >
            <FontAwesomeIcon icon={faTimes} className='fatimes-icon-auth' />
            <p>An account with this email already exists.</p>
          </div>

          <div className='form-group mt-3'>
            <label htmlFor='password'>Password</label>
            <input
              required
              id='password'
              type={'password'}
              className={
                validPassword
                  ? 'form-control mt-1'
                  : 'form-control mt-1 invalid-input'
              }
              placeholder='Enter password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </div>
          <div
            className={
              validPassword
                ? 'valid-msg-auth'
                : 'valid-msg-auth invalid-msg-auth'
            }
          >
            <FontAwesomeIcon icon={faTimes} className='fatimes-icon-auth' />
            <p>
              Password must include uppercase, lowercase and digits. Required
              minimum 8 characters.
            </p>
          </div>
          <div className='form-group mt-3'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input
              required
              id='confirmPassword'
              type={'password'}
              className={
                validConfirmPassword
                  ? 'form-control mt-1'
                  : 'form-control mt-1 invalid-input'
              }
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
              }}
            />
          </div>
          <div
            className={
              validConfirmPassword
                ? 'valid-msg-auth'
                : 'valid-msg-auth invalid-msg-auth '
            }
          >
            <FontAwesomeIcon icon={faTimes} className='fatimes-icon-auth' />
            <p>Password and Confirm Password must match.</p>
          </div>

          <div
            className={
              serverErrorVisibility
                ? 'server-error-auth'
                : 'no-server-error-auth'
            }
          >
            <FontAwesomeIcon icon={faTimes} className='fatimes-icon-auth' />
            <p>{serverErrorMsg}</p>
          </div>
          <div className='d-grid gap-2 mt-3 align-center'>
            <button className='btn btn-primary'>Register</button>
          </div>
          <p className='forgot-password text-right mt-2'>
            <a href='./forgot'>Forgot password?</a>
          </p>
          <p className='forgot-password text-right mt-2'>
            Already have an account? <Link to={'/signin'}>Sign in here</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default SignUp
