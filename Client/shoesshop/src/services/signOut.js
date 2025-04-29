import Cookies from 'js-cookie'

export const signOut = () => {
    Cookies.remove('jwt')
    Cookies.remove('id')
    window.location.href = "/signin"
}
