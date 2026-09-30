export const API_ENDPOINTS = {
	auth: {
		login: '/api/user/login1',
	},
	bookings: {
		list: '/api/bookings',
		events: '/api/booking/events',
		detail: '/api/booking/detail',
		create: '/api/booking/create/',
	},
} as const
