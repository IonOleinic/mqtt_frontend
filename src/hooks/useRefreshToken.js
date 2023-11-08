import useAxios from './useAxios'
import useAuth from './useAuth'

function useRefreshToken() {
  const axios = useAxios()
  const { setAuth } = useAuth()
  const refresh = async () => {
    try {
      const response = await axios.get('/refresh-token', {
        withCredentials: true,
      })
      setAuth((prev) => {
        return {
          ...prev,
          accessToken: response.data.accessToken,
          user: response.data.user,
        }
      })
      return response.data.accessToken
    } catch (error) {
      console.log(error)
    }
  }
  return refresh
}

export default useRefreshToken
