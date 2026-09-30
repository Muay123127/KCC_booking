import { onMounted, ref } from 'vue'
import { saveBooking } from '../services/bookingService'
import { getCurrentDateTimeLocal, parseDateTime } from '@/shared/utils/dateTime.js'

export const useBookingForm = (room, emit) => {
  const loading = ref(false)
  const errorMessage = ref('')

  const form = ref({
    startDate: getCurrentDateTimeLocal(),
    endDate: getCurrentDateTimeLocal(),
    meetingTitle: '',
    departmentCreator: '',
    departmentUser: '',
    participantsCount: 0,
    tel: '',
    username: '',
    additionalUser: '',
    objective: '',
    priority: 'normal'
  })

  onMounted(() => {
    const storedUser = localStorage.getItem('username') || 'Undefined User'
    form.value.username = storedUser
    form.value.additionalUser = storedUser
  })

  const setPriority = (level) => {
    form.value.priority = level
  }

  const handleSave = async () => {
    errorMessage.value = ''
    const tel = String(form.value.tel || '').trim()

    if (!tel) {
      errorMessage.value = 'ກະລຸນາປ້ອນເບີໂທຕິດຕໍ່'
      return
    }

    loading.value = true

    const start = parseDateTime(form.value.startDate)
    const end = parseDateTime(form.value.endDate)
    /** @type {import('../types/booking').CreateBookingPayload} */
    const payload = {
      item_id: room.value.id,
      start_date: start.date,
      stop_date: end.date,
      start_time: start.time,
      stop_time: end.time,
      priority: form.value.priority,
      description: form.value.objective,
      roomName: room.value.name,
      meetingTitle: form.value.meetingTitle,
      departmentCreator: form.value.departmentCreator,
      departmentUser: form.value.departmentUser,
      participantsCount: Number(form.value.participantsCount),
      tel,
      username: form.value.username
    }

    try {
      const result = await saveBooking(payload)
      emit('save', result)
    } catch (error) {
      errorMessage.value = error.message || 'ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້'
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return { form, loading, errorMessage, setPriority, handleSave }
}