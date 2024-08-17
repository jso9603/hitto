
import Cookies from 'js-cookie';

interface User {
  uid: string;
  email: string;
}

export const getLoggedUserInfo = (): User | null => {
  const userCookie = Cookies.get('user');
  
  if (userCookie) {
    try {
      const user: User = JSON.parse(userCookie);
      return user;
    } catch (error) {
      console.error('Failed to parse user cookie:', error);
      return null;
    }
  }

  return null;
};