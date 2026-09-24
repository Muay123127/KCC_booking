import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/features/Home/views/HomeView.vue'
import LoginView from '@/features/auth/view/LoginView.vue'
import Logout from '@/features/auth/view/Logout.vue'
import ProfileView from '@/features/profiles/ProfileView.vue'
import MeetingRooms from '@/features/bookings/views/BookingEvents.vue'
import RoomEventsView from '@/features/rooms/RoomEventsView.vue'
import CarEventsView from '@/features/cars/CarEventsView.vue'
import AddBooking from '@/features/bookings/views/AddBookingModal.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView, 
    meta: { requiresAuth: true, layout: 'default' } // ຕ້ອງ Login ແລ້ວຈຶ່ງເຂົ້າໄດ້[cite: 1]
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true, layout: 'auth' } // Login ແລ້ວຫ້າມເຂົ້ານີ້[cite: 1]
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout,
    meta: { layout: 'auth' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/booking-rooms',
    name: 'BookingRooms',
    component: RoomEventsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/meeting-rooms/:id?', 
    name: 'MeetingRooms',
    component: MeetingRooms,
    meta: { requiresAuth: true }
  },
  {
    path: '/booking-cars',
    name: 'BookingCars',
    component: CarEventsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/booking/:id?', 
    name: 'book',
    component: AddBooking,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard ตรวจสอบสิทธิ์ก่อนเปลี่ยนหน้า
router.beforeEach((to) => {
  const token = localStorage.getItem('user-token')

  if (to.meta.requiresAuth && !token) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresGuest && token) {
    return { name: 'home' }
  }

  return true
})

export default router