import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7146/api'

export const sendRequest = async (endpoint, data, method = 'POST', contentType = 'application/json') => {
    try {
        const token = Cookies.get('jwt')

        const headers = {}

        if (!(data instanceof FormData)) {
            headers["Content-Type"] = contentType;
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`,
            data,
            withCredentials: true,
            headers,
        })

        return response
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred');
        }
        throw new Error('An error occurred');
    }
}
