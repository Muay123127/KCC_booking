<template>
  <div class="flex h-screen bg-slate-100 font-sans text-sm overflow-hidden antialiased">
    <!-- Sidebar Component (ຖ້າມີ) -->
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <!-- Navbar Component -->
      <Navbar />

      <!-- Main Content Container -->
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          
          <!-- Header Profile Section -->
          <div class="p-8 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50 to-white">
            <div class="flex items-center space-x-5">
              <!-- Avatar Circle with Initial -->
              <div class="w-20 h-20 bg-rose-500 rounded-2xl flex items-center justify-center font-bold text-white text-3xl shadow-md">
                {{ userInitial }}
              </div>
              <div>
                <h1 class="text-2xl font-bold text-slate-800">{{ userName || 'ກຳລັງໂຫຼດ...' }}</h1>
                <p class="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">ຜູ້ຊ່ວຍຜູ້ຄວບຄຸມລະບົບ - ERP</p>
              </div>
            </div>
          </div>

          <!-- Contact Grid Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 border-b border-slate-100 bg-slate-50/30 text-xs">
            <div class="space-y-4">
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="font-semibold text-slate-400">Work Mobile</span>
                <span class="text-slate-700 font-medium">+856 20 XXXXXXXX</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="font-semibold text-slate-400">Work Phone</span>
                <span class="text-slate-700 font-medium">-</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="font-semibold text-slate-400">Manager</span>
                <span class="text-slate-700 font-medium">Administrator</span>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="font-semibold text-slate-400">Work Email</span>
                <span class="text-slate-700 font-medium">user@khouanchay.com</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="font-semibold text-slate-400">Work Location</span>
                <span class="text-slate-700 font-medium">Headquarters</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="font-semibold text-slate-400">Coach</span>
                <span class="text-slate-700 font-medium">Administrator</span>
              </div>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <div class="flex border-b border-slate-200 px-8 space-x-8 text-xs font-medium overflow-x-auto">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="currentTab = tab.id"
              :class="[
                'py-4 border-b-2 transition whitespace-nowrap cursor-pointer',
                currentTab === tab.id 
                  ? 'border-rose-500 text-rose-600 font-bold' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              ]"
            >
              {{ tab.name }}
            </button>
          </div>

          <!-- Tab Contents -->
          <div class="p-8 text-xs">
            <!-- Preferences Tab Content -->
            <div v-if="currentTab === 'preferences'" class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-slate-600">Notification</span>
                  <div class="flex items-center space-x-4 text-slate-700">
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input id="notif-email" type="radio" name="notif" class="text-rose-600 focus:ring-rose-500" />
                      <span>Handle by Emails</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input id="notif-odoo" type="radio" name="notif" checked class="text-rose-600 focus:ring-rose-500" />
                      <span>Handle in Odoo</span>
                    </label>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <span class="font-semibold text-slate-600">Email</span>
                  <span class="text-slate-800 font-medium">{{ userName }}@kcc.com</span>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-slate-600">Language</span>
                  <select id="profile-language" name="language" class="border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none">
                    <option>English (US)</option>
                    <option>Lao (ລາວ)</option>
                  </select>
                </div>

                <div class="flex items-center justify-between">
                  <span class="font-semibold text-slate-600">Timezone</span>
                  <select id="profile-timezone" name="timezone" class="border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none">
                    <option>Asia/Bangkok</option>
                  </select>
                </div>

                <div class="flex items-center justify-between">
                  <span class="font-semibold text-slate-600">Sidebar Type</span>
                  <select id="profile-sidebar-type" name="sidebar-type" class="border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none">
                    <option>Large</option>
                    <option>Compact</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Other Tabs Placeholder -->
            <div v-else class="text-center py-12 text-slate-400">
              ກຳລັງພັດທະນາຂໍ້ມູນສ່ວນຂອງ {{ tabs.find(t => t.id === currentTab)?.name }}...
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/app/components/Sidebar.vue'
import Navbar from '@/app/components/Navbar.vue'

const userName = ref('')
const currentTab = ref('preferences')

const tabs = [
  { id: 'preferences', name: 'Preferences' },
  { id: 'security', name: 'Account Security' },
  { id: 'devices', name: 'Devices' },
  { id: 'resume', name: 'Resume' },
  { id: 'work', name: 'Work Information' },
  { id: 'private', name: 'Private Information' },
  { id: 'hr', name: 'HR Settings' },
]

onMounted(() => {
  userName.value = localStorage.getItem('username') || 'User Profile'
})

const userInitial = computed(() => {
  if (!userName.value) return 'U'
  return userName.value.trim().charAt(0)
})
</script>