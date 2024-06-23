import {useEffect} from 'react'
import {Navigate} from 'react-router-dom'
import {useAuth} from './core/Auth'

export function Logout() {
  const {logout} = useAuth()
  useEffect(() => {
    logout()
  }, [logout])

  window.location.href = '/auth/login'

  return (
      <></>
  )
}
