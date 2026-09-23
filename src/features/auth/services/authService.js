import { loginuser } from '@/app/api/loginapi'

export const authenticate = async (username, password) => {
  const response = await loginuser(username, password)
  const payload = response?.data || response
  const token = payload?.access_token
    || payload?.accessToken
    || payload?.token
    || payload?.result?.access_token
    || payload?.result?.accessToken
    || payload?.result?.token

  if (!token) {
    throw new Error(payload?.message || 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດບໍ່ຖືກຕ້ອງ')
  }

  return { ...payload, token }
}

export const saveSession = (response) => {
  const token = response.token || response.access_token || response.accessToken || ''

  if (token) {
    localStorage.setItem('user-token', token)
    localStorage.setItem('token', token)
    localStorage.setItem('access_token', token)
  }

  localStorage.setItem('username', response.result?.name || '')

  if (response.result?.uid !== undefined) {
    localStorage.setItem('odoo_uid', String(response.result.uid))
  }
}

export const clearSession = () => {
  localStorage.removeItem('user-token')
  localStorage.removeItem('token')
  localStorage.removeItem('access_token')
  localStorage.removeItem('username')
  localStorage.removeItem('odoo_uid')
}