import http from './http.ts'
import { API_ENDPOINTS } from './endpoints.ts'

export const loginuser = async (login, password) => {
    const response = await http.post(API_ENDPOINTS.auth.login, {
        login,
        password
    })
    return response.data
}

export default http