import axios from 'axios'

const getStoredToken = () => {
	if (typeof localStorage === 'undefined') return ''

	const token =
		localStorage.getItem('user-token') ||
		localStorage.getItem('token') ||
		localStorage.getItem('access_token')

	return token?.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '').trim() || ''
}

const http = axios.create({
	baseURL: '/',
	headers: {
		'Content-Type': 'application/json',
	},
})

http.interceptors.request.use((config) => {
	const token = getStoredToken()

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

export default http
