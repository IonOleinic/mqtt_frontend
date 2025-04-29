import { useState } from 'react'
import useAxios from '../../hooks/useAxios'
import { useEffect } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { Checkbox } from 'primereact/checkbox'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import './SignIn.css'

const SignIn = () => {
  const axios = useAxios()
  const { setAuth, persist, setPersist } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validEmail, setValidEmail] = useState(true)
  const [validPassword, setValidPassword] = useState(true)
  const [errorVisibility, setErrorVisibility] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    setErrorVisibility(false)
    setValidEmail(true)
    setValidPassword(true)
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorVisibility(false)
    setValidEmail(true)
    setValidPassword(true)
    try {
      let response = await axios.post(`/login`, { email, password })
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
      setErrorVisibility(true)
      setValidEmail(false)
      setValidPassword(false)
      if (!error.response) {
        setErrorMsg('No server response!')
      }
      if (error.response.status == 400) {
        setErrorMsg('Invalid username or password!')
      } else if (error.response.status == 500) {
        setErrorMsg('Server Error!')
      }
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-form-container'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <div className='auth-form-content'>
          <h3 className='auth-form-title'>Sign In</h3>
          <div className='auth-form-inputs'>
            <div className='form-input-group auth-form-input-group'>
              <label htmlFor='sign-in-email-input'>Email address</label>
              <InputText
                id='sign-in-email-input'
                disabled={loading}
                required
                type='email'
                invalid={!validEmail}
                placeholder='Enter email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </div>
            <div className='form-input-group auth-form-input-group'>
              <label htmlFor='sign-in-password-input'>Password</label>
              <InputText
                id='sign-in-password-input'
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
            </div>
          </div>
          <div className='checkbox-remember-me'>
            <Checkbox
              id='sign-in-persist-check'
              onChange={() => setPersist((prev) => !prev)}
              checked={persist}
              disabled={loading}
            />
            <label htmlFor='sign-in-persist-check'>Remember Me</label>
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
          <div className='form-input-group auth-form-input-group form-button-container'>
            <Button
              label={loading ? 'Loging in...' : 'Login'}
              disabled={loading}
            />
          </div>
          <div className='auth-external-links'>
            <p>
              <a href='./forgot'>Forgot password?</a>
            </p>
            <p>
              Don't have an account? <Link to={'/signup'}>Sign up here</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignIn
