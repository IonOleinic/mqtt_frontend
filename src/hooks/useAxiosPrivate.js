import { axiosPrivate } from '../api/api'
import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuth from './useAuth'
function useAxiosPrivate() {
  const refresh = useRefreshToken()
  const { auth } = useAuth()

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        const userId = JSON.parse(sessionStorage.getItem('userId'))
        if (userId) {
          config.params = { ...config.params, user_id: userId }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          try {
            const newAccessToken = await refresh()
            // Create a new request configuration with updated headers
            const newRequestConfig = {
              ...prevRequest,
              headers: {
                ...prevRequest.headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
            return axiosPrivate(newRequestConfig)
          } catch (refreshError) {
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
