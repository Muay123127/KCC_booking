import { loginuser } from '@/app/api/loginapi'

export const authenticate = async (username, password) => {
  const response = await loginuser(username, password)
  const payload = response?.data || response
  const token = findToken(payload)

  if (!token) {
    throw new Error(payload?.message || 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດບໍ່ຖືກຕ້ອງ')
  }

  return { ...payload, token }
}

export const saveSession = (response) => {
  const token = normalizeToken(response.token || findToken(response))

  if (token) {
    localStorage.setItem('user-token', token)
    localStorage.setItem('token', token)
    localStorage.setItem('access_token', token)
  }

  const user = response.result || response.data?.result || response.data || {}
  localStorage.setItem('username', user.name || user.username || '')

  if (user.uid !== undefined) {
    localStorage.setItem('odoo_uid', String(user.uid))
  }
}

const findToken = (payload) => {
  if (!payload || typeof payload !== 'object') return ''

  return normalizeToken(
    payload.access_token
      || payload.accessToken
      || payload.token
      || payload.data?.access_token
      || payload.data?.accessToken
      || payload.data?.token
      || payload.result?.access_token
      || payload.result?.accessToken
      || payload.result?.token
      || payload.data?.result?.access_token
      || payload.data?.result?.accessToken
      || payload.data?.result?.token,
  )
}

const normalizeToken = (value) => {
  if (!value) return ''
  return String(value).replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '').trim()
}

export const clearSession = () => {
  localStorage.removeItem('user-token')
  localStorage.removeItem('token')
  localStorage.removeItem('access_token')
  localStorage.removeItem('username')
  localStorage.removeItem('odoo_uid')
}