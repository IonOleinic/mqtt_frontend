import useAxios from './useAxios'
import useAuth from './useAuth'

function useLogout() {
  const { setAuth } = useAuth()
  const axios = useAxios()
  const logout = async () => {
    try {
      let response = await axios.get('/logout')
      if (setAuth) {
        setAuth({})
      }
    } catch (error) {
      console.log(error)
    }
  }
  return logout
}

export default useLogout
