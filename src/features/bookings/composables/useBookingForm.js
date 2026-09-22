import { onMounted, ref } from 'vue'
import { saveBooking } from '../services/bookingService'

export const useBookingForm = (room, emit) => {
  const loading = ref(false)
  const errorMessage = ref('')

  // ปรับฟังก์ชันให้สร้างวันที่และเวลาปัจจุบัน พร้อมวินาที (รูปแบบ YYYY-MM-DDTHH:mm:ss)
  const getCurrentDateTimeLocal = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0') // 👈 ดึงวินาทีปัจจุบัน
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}` // 👈 เพิ่ม :ss ต่อท้าย
  }

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
    const storedUser = localStorage.getItem('username') || 'ບ.ພັດທະໄຊ ລົງຖາວັດ'
    form.value.username = storedUser
    form.value.additionalUser = storedUser
  })

  const setPriority = (level) => {
    form.value.priority = level
  }

  const parseDateTime = (dateTime) => {
    if (!dateTime) {
      return { date: '', time: '00:00:00' }
    }

    // รองรับรูปแบบ 'YYYY-MM-DDTHH:mm:ss' ที่ส่งมาจาก input
    if (dateTime.includes('T')) {
      const [datePart, timePart] = dateTime.split('T')
      // ถ้า timePart มีแค่ HH:mm ให้เติม :00 แต่ถ้ามีวินาทีมาด้วยแล้วจะใช้ค่านั้นเลย
      let formattedTime = timePart
      if (timePart.length === 5) {
        formattedTime = `${timePart}:00`
      } else if (!timePart) {
        formattedTime = '00:00:00'
      }
      return { date: datePart, time: formattedTime }
    }

    // รองรับเคสเก่าเผื่อมีข้อมูลที่เป็น 'DD/MM/YYYY HH:mm:ss' ค้างอยู่
    if (dateTime.includes(' ')) {
      const [datePart, timePart] = dateTime.split(' ')
      if (datePart.includes('/')) {
        const [day, month, year] = datePart.split('/')
        return { date: `${year}-${month}-${day}`, time: timePart || '00:00:00' }
      }
      return { date: datePart, time: timePart || '00:00:00' }
    }

    return { date: dateTime, time: '00:00:00' }
  }

  const handleSave = async () => {
    loading.value = true
    errorMessage.value = ''

    const start = parseDateTime(form.value.startDate)
    const end = parseDateTime(form.value.endDate)
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
      participantsCount: form.value.participantsCount,
      tel: form.value.tel,
      username: form.value.username
    }

    try {
      const result = await saveBooking(payload)
      emit('save', result)
    } catch (error) {
      errorMessage.value = 'ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້, ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ ຫຼື Token!'
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return { form, loading, errorMessage, setPriority, handleSave }
}