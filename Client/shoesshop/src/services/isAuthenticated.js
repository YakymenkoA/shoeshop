import Cookies from 'js-cookie'

export const isAuthenticated = () => {
  const token = Cookies.get('jwt')
  return token ? true : false;
}
