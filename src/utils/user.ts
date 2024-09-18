
import Cookies from 'js-cookie'

import { User } from '../models/User'

export const getLoggedUserInfo = (): User | null => {
  const userCookie = Cookies.get('user')
  
  if (userCookie) {
    try {
      const user: User = JSON.parse(userCookie)
      return user
    } catch (error) {
      console.error('Failed to parse user cookie:', error)
      return null
    }
  }

  return null
}
