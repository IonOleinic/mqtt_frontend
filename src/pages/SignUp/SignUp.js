import { useState } from 'react'
import useAxios from '../../hooks/useAxios'
import { useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { RadioButton } from 'primereact/radiobutton'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import './SignUp.css'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d.@$!%*?&]{8,}$/

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

  const [errorMsg, setErrorMsg] = useState('')
  const [errorVisibility, setErrorVisibility] = useState(false)
  const [loading, setLoading] = useState(false)
  const [disabledRegBtn, setDisabledRegBtn] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

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
        setValidName(true)
      } else {
        setValidName(false)
      }
    }
  }, [name])

  useEffect(() => {
    setValidEmail(true)
  }, [email])

  useEffect(() => {
    setErrorVisibility(false)
  }, [name, email, password, confirmPassword])

  useEffect(() => {
    if (validEmail && validName && validPassword && validConfirmPassword) {
      setDisabledRegBtn(false)
    } else {
      setDisabledRegBtn(true)
    }
  }, [validEmail, validName, validPassword, validConfirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validEmail && validName && validPassword && validConfirmPassword) {
      setLoading(true)
      setErrorVisibility(false)
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
        setErrorVisibility(true)
        if (!error.response) {
          setErrorMsg('No server response!')
        }
        if (error.response.status === 409) {
          setValidEmail(false)
          emailRef.current.focus()
          setErrorMsg('This email is already registered.')
        } else if (error.response.status === 500) {
          setErrorMsg('Server Error. Please try again.')
        }
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }
  const login = async (email, password) => {
    try {
      const response = await axios.post(`/login`, { email, password })
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

  return (
    <div className='auth-form-container'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <div className='auth-form-content'>
          <h3 className='auth-form-title'>Sign Up</h3>
          <div className='auth-form-inputs'>
            <div className='form-input-group auth-form-input-group'>
              <label htmlFor='sign-up-name-input'>Name</label>
              <InputText
                id='sign-up-name-input'
                required
                disabled={loading}
                invalid={!validName}
                placeholder='Enter name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
              <div
                className={
                  !validName
                    ? 'auth-invalid-input-msg'
                    : 'auth-invalid-input-msg auth-invalid-input-msg-hidden'
                }
              >
                <FontAwesomeIcon icon={faTimes} className='fatimes-icon-auth' />
                <p>Invalid username.</p>
              </div>
            </div>
            <div className='form-input-group auth-form-input-group'>
              <label>Gender</label>
              <div className='form-input-group-inline sign-up-gender-radio-group'>
                <div className='sign-up-radio-button'>
                  <RadioButton
                    inputId='sign-up-male-radio'
                    disabled={loading}
                    value='male'
                    checked={gender === 'male' ? true : false}
                    onChange={(e) => {
                      setGender('male')
                    }}
                  />
                  <label htmlFor='sign-up-female-radio'>Male</label>
                </div>
                <div className='sign-up-radio-button'>
                  <RadioButton
                    disabled={loading}
                    inputId='sign-up-female-radio'
                    value='female'
                    checked={gender === 'female' ? true : false}
                    onChange={(e) => {
                      setGender('female')
                    }}
                  />
                  <label htmlFor='sign-up-female-radio'>Female</label>
                </div>
              </div>
            </div>
            <div className='form-input-group auth-form-input-group'>
              <label htmlFor='sign-up-email-input'>Email address</label>
              <InputText
                ref={emailRef}
                required
                disabled={loading}
                id='sign-up-email-input'
                type='email'
                invalid={!validEmail}
                placeholder='Enter email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
              <div
                className={
                  !validEmail
                    ? 'auth-invalid-input-msg'
                    : 'auth-invalid-input-msg auth-invalid-input-msg-hidden'
                }
              >
                <FontAwesomeIcon icon={faTimes} className='fatimes-icon-auth' />
                <p>Invalid email.</p>
              </div>
            </div>
            <div className='form-input-group auth-form-input-group'>
              <label htmlFor='sign-up-password-input'>Password</label>
              <InputText
                id='sign-up-password-input'
                required
                disabled={loading}
                type='password'
                invalid={!validPassword}
                placeholder='Enter password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
              <div
                className={
                  !validPassword
                    ? 'auth-invalid-input-msg'
                    : 'auth-invalid-input-msg auth-invalid-input-msg-hidden'
                }
              >
                <FontAwesomeIcon icon={faTimes} className='fatimes-icon-auth' />
                <p>
                  Password must include uppercase, lowercase and digits.
                  Required minimum 8 characters.
                </p>
              </div>
            </div>
            <div className='form-input-group auth-form-input-group'>
              <label htmlFor='sign-up-conf-password-input'>
                Confirm Password
              </label>
              <InputText
                id='sign-up-conf-password-input'
                required
                disabled={loading}
                type={'password'}
                invalid={!validConfirmPassword}
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                }}
              />
              <div
                className={
                  !validConfirmPassword
                    ? 'auth-invalid-input-msg'
                    : 'auth-invalid-input-msg auth-invalid-input-msg-hidden'
                }
              >
                <FontAwesomeIcon icon={faTimes} className='fatimes-icon-auth' />
                <p>Password and Confirm Password must match.</p>
              </div>
            </div>
          </div>
          <div
            className={
              errorVisibility
                ? 'form-error-msg'
                : 'form-error-msg form-error-msg-hidden'
            }
          >
            <Message severity='error' text={errorMsg} />
          </div>
          <div className='form-input-group auth-form-input-group auth-button-container'>
            <Button
              label={loading ? 'Registering...' : 'Register'}
              disabled={loading || disabledRegBtn}
            />
          </div>
          <div className='auth-external-links'>
            <p>
              <a href='./forgot'>Forgot password?</a>
            </p>
            <p>
              Already have an account? <Link to='/signin'>Sign in here</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignUp
