<script setup>
import { toRef } from "vue";
import { useBookingForm } from "../composables/useBookingForm";

const props = defineProps({
  room: {
    type: Object,
    default: () => ({
      id: 5,
      name: "ຫ້ອງປະຊຸມໃຫຍ່ (Grand) ຊັ້ນ 1",
      capacity: "ຮອງຮັບໄດ້ 24 ຄົນ",
    }),
  },
});

const emit = defineEmits(["close", "save"]);
const room = toRef(props, "room");
const { form, loading, errorMessage, setPriority, handleSave } = useBookingForm(
  room,
  emit,
);

const handleClose = () => {
  emit("close");
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs p-4 font-sans text-slate-800"
  >
    <div
      class="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200"
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white"
      >
        <h2 class="text-base font-semibold text-slate-700">Booking</h2>
        <button
          @click="handleClose"
          class="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-8">
        <h3 class="text-lg font-bold text-slate-800 mb-6">
          Rooms - {{ room.name }} :
        </h3>

        <div
          v-if="errorMessage"
          class="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs"
        >
          {{ errorMessage }}
        </div>

        <form
          @submit.prevent="handleSave"
          class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5"
        >
          <div class="space-y-4">
            <!-- ເລີ່ມ (Start - Text ດຽວ) -->
            <div class="flex items-center">
              <label class="w-28 text-xs font-semibold text-slate-700 shrink-0">
                ເລີ່ມ <span class="text-rose-500">*</span>
              </label>
              <input
                id="booking-start-date"
                name="start-date"
                type="datetime-local"
                v-model="form.startDate"
                class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                required
              />
            </div>

            <!-- ຫາ (End - Text ດຽວ) -->
            <div class="flex items-center">
              <label class="w-28 text-xs font-semibold text-slate-700 shrink-0">
                ຫາ <span class="text-rose-500">*</span>
              </label>
              <input
                id="booking-end-date"
                name="end-date"
                type="datetime-local"
                v-model="form.endDate"
                class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                required
              />
            </div>
          </div>
          <!-- ຫົວຂໍ້ການປະຊຸມ -->
          <div class="flex items-start">
            <label
              class="w-28 text-xs font-semibold text-slate-700 shrink-0 pt-2"
            >
              ຫົວຂໍ້ການປະຊຸມ
            </label>
            <textarea
              id="meeting-title"
              name="meeting-title"
              v-model="form.meetingTitle"
              rows="3"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-y"
              placeholder="ປ້ອນຫົວຂໍ້ການປະຊຸມ..."
            ></textarea>
          </div>

          <!-- 🌟 ຄວາມສໍາຄັນ (Priority Buttons) -->
          <div class="flex items-center">
            <label class="w-28 text-xs font-semibold text-slate-700 shrink-0">
              ຄວາມສໍາຄັນ
            </label>
            <div class="flex items-center space-x-2">
              <button
                type="button"
                @click="setPriority('basic')"
                class="px-2.5 py-1 text-xs rounded border transition cursor-pointer"
                :class="
                  form.priority === 'basic'
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                "
              >
                Basic
              </button>
              <button
                type="button"
                @click="setPriority('normal')"
                class="px-2.5 py-1 text-xs rounded border transition cursor-pointer"
                :class="
                  form.priority === 'normal'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                "
              >
                Normal
              </button>
              <button
                type="button"
                @click="setPriority('Urgent')"
                class="px-2.5 py-1 text-xs rounded border transition cursor-pointer"
                :class="
                  form.priority === 'Urgent'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                "
              >
                Urgent
              </button>
            </div>
          </div>

          <!-- ຜູ້ຈອງ -->
          <div class="flex items-center">
            <label class="w-28 text-xs font-semibold text-slate-700 shrink-0">
              ຜູ້ຈອງ
            </label>
            <input
              id="booking-username"
              name="username"
              type="text"
              v-model="form.username"
              readonly
              class="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-medium cursor-not-allowed"
            />
          </div>

          <!-- ພະແນກຜູ້ສ້າງ -->
          <div class="flex items-center">
            <label class="w-28 text-xs font-semibold text-slate-700 shrink-0">
              ພະແນກຜູ້ສ້າງ
            </label>
            <input
              id="department-creator"
              name="department-creator"
              type="text"
              v-model="form.departmentCreator"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <!-- ຈຳນວນຄົນ -->
          <div class="flex items-center">
            <label class="w-28 text-xs font-semibold text-slate-700 shrink-0">
              ຈຳນວນຄົນ <span class="text-rose-500">*</span>
            </label>
            <input
              id="participants-count"
              name="participants-count"
              type="number"
              v-model="form.participantsCount"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <!-- ພະແນກຜູ້ໃຊ້ -->
          <div class="flex items-center">
            <label class="w-28 text-xs font-semibold text-slate-700 shrink-0">
              ພະແນກຜູ້ໃຊ້
            </label>
            <input
              id="department-user"
              name="department-user"
              type="text"
              v-model="form.departmentUser"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <!-- ເບີໂທ (Tel) -->
          <div class="flex items-center">
            <label class="w-28 text-xs font-semibold text-slate-700 shrink-0">
              ເບີໂທ (Tel) <span class="text-rose-500">*</span>
            </label>
            <input
              id="contact-tel"
              name="contact-tel"
              type="text"
              v-model="form.tel"
              placeholder="ປ້ອນເບີໂທຕິດຕໍ່..."
              class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              required
            />
          </div>

          <div class="hidden md:block"></div>

          <!-- ຈຸດປະສົງ -->
          <div class="flex items-start md:col-span-2">
            <label
              class="w-28 text-xs font-semibold text-slate-700 shrink-0 pt-2"
            >
              ຈຸດປະສົງ <span class="text-rose-500">*</span>
            </label>
            <textarea
              id="booking-objective"
              name="booking-objective"
              v-model="form.objective"
              rows="3"
              placeholder="ປ້ອນຈຸດປະສົງການຈອງ (Description)..."
              class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              required
            ></textarea>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div
        class="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center space-x-3"
      >
        <button
          @click="handleSave"
          :disabled="loading"
          class="bg-[#243746] hover:bg-[#1a2833] text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-sm transition cursor-pointer flex items-center space-x-2 disabled:opacity-50"
        >
          <span
            v-if="loading"
            class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          <span>{{ loading ? "ກຳລັງບັນທຶກ..." : "Save" }}</span>
        </button>
        <button
          @click="handleClose"
          class="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-5 py-2 rounded-lg transition cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
