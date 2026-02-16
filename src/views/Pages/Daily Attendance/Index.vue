<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <BreadCrumbs :page="'Daily Attendance'" />

    <!-- TITLE + DATE -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold">Daily Attendance</h1>

      <div class="text-lg font-semibold text-gray-600 mt-2 md:mt-0">
        Current Date: {{ currentDate }}
      </div>
    </div>

    <!-- TABLE -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- HEADER -->
        <thead
          class="text-white shadow bg-gradient-to-l from-[#4B0082] via-blue-600 via-blue-700 via-blue-500 via-blue-700 to-[#4B0082]"
        >
          <tr class="border-b-2 border-yellow-500">
            <th class="px-6 py-3 border text-left">Name</th>
            <th class="px-6 py-3 border text-left">Time In</th>
            <th class="px-6 py-3 border text-left">Time Out</th>
            <th class="px-6 py-3 border text-left">Late</th>
            <th class="px-6 py-3 border text-left">Undertime</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="divide-y divide-gray-200 text-sm">
          <tr
            v-for="attendance in attendances"
            :key="attendance.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4">{{ attendance.name }}</td>
            <td class="px-6 py-4">{{ attendance.time_in }}</td>
            <td class="px-6 py-4">{{ attendance.time_out }}</td>
            <td class="px-6 py-4 text-red-500 font-semibold">
              {{ attendance.late }}
            </td>
            <td class="px-6 py-4 text-orange-500 font-semibold">
              {{ attendance.undertime }}
            </td>
          </tr>

          <tr v-if="attendances.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-400">
              No attendance records today.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";

/* ================= STATE ================= */
const attendances = ref([]);
const currentDate = ref("");

/* ================= GET CURRENT DATE ================= */
const getCurrentDate = () => {
  const today = new Date();
  currentDate.value = today.toISOString().split("T")[0];
};

/* ================= FETCH DAILY ATTENDANCE ================= */
const fetchDailyAttendance = async () => {
  try {
    const response = await axios.get("http://localhost:8995/api/daily-attendance");

    attendances.value = response.data || [];
  } catch (error) {
    console.error("Fetch error:", error.response?.data || error);
  }
};

/* ================= MOUNT ================= */
onMounted(() => {
  getCurrentDate();
  fetchDailyAttendance();
});
</script>
