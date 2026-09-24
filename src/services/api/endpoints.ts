export const API_ENDPOINTS = {
	auth: {
		login: '/api/user/login1',
	},
	bookings: {
		list: '/api/bookings',
		events: '/api/booking/events',
		detail: '/api/booking/detail',
		create: '/booking/create/',
	},
} as const
