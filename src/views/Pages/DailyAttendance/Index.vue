<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <BreadCrumbs :page="'Daily Attendance'" />

    <div class="bg-white shadow rounded-lg p-6 border">
      <!-- TITLE + DATE (Same Row) -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 class="text-2xl font-bold">Daily Attendance</h2>
        <div class="text-lg font-semibold text-gray-600">
          Current Date: {{ formattedCurrentDate }}
        </div>
      </div>

      <!-- SEARCH ROW -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="searchInput()"
          placeholder="Search employee name or number..."
          class="shadow shadow-gray-400 w-full md:w-1/3 font-semibold text-md py-2 px-4 rounded-lg"
        />
        <!-- NEW LOG BUTTON -->
        <button
          @click="openAddModal"
          class="bg-blue-600 hover:opacity-70 text-white px-4 py-2 rounded-lg font-bold"
        >
          + New Log
        </button>
        <!-- ADD MODAL -->
        <AddLog ref="addModal" />
      </div>
    </div>

    <!-- TABLE -->
    <div class="bg-white shadow rounded-lg overflow-hidden mt-4">
      <table class="min-w-full divide-y divide-gray-200">
        <thead
          class="text-white shadow bg-gradient-to-l from-[#4B0082] via-blue-600 via-blue-700 via-blue-500 via-blue-700 to-[#4B0082]"
        >
          <tr class="border-b-2 border-yellow-500">
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">Name</th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Employee #
            </th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Shift
            </th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Time In
            </th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Time Out
            </th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Total Hours
            </th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="employee in paginatedEmployees" :key="employee.id">
            <td class="px-6 py-4 border font-medium">
              {{ employee.firstName }} {{ employee.lastName }}
              <span v-if="employee.middleName" class="text-gray-500 text-sm ml-1">
                {{ employee.middleName }}
              </span>
            </td>

            <td class="px-6 py-4 border">
              {{ employee.employeeNumber || "—" }}
            </td>

            <td class="px-6 py-4 border text-indigo-600 font-semibold">
              <div v-if="employee.shift">
                {{ employee.shift.shift_name || "No Shift" }}
              </div>
              <span v-else class="text-gray-400">No Shift</span>
            </td>

            <td class="px-6 py-4 border">
              <div v-if="employee.attendances?.length && employee.attendances[0].time_in">
                <span class="font-medium">{{
                  formatDateTime(employee.attendances[0].time_in)
                }}</span>
              </div>
              <span v-else class="text-gray-400">—</span>
            </td>

            <td class="px-6 py-4 border">
              <div
                v-if="employee.attendances?.length && employee.attendances[0].time_out"
              >
                <span class="font-medium">{{
                  formatDateTime(employee.attendances[0].time_out)
                }}</span>
              </div>
              <span
                v-else-if="
                  employee.attendances?.length && employee.attendances[0].time_in
                "
                class="text-yellow-600"
              >
                Not yet out
              </span>
              <span v-else class="text-gray-400">—</span>
            </td>

            <td class="px-6 py-4 border">
              <span
                v-if="employee.attendances?.length && employee.attendances[0].time_in"
              >
                <span :class="getTotalHoursClass(employee)" class="font-medium">
                  {{ calculateTotalHours(employee) }}
                </span>
              </span>
              <span v-else class="text-gray-400">—</span>
            </td>

            <td class="px-6 py-4 border">
              <AttendanceAction
                :employeeId="employee.id"
                :hasTimeIn="
                  !!(employee.attendances?.length && employee.attendances[0]?.time_in)
                "
                :hasTimeOut="
                  !!(employee.attendances?.length && employee.attendances[0]?.time_out)
                "
                @refresh="fetchEmployees"
              />
            </td>
          </tr>

          <tr v-if="loading">
            <td colspan="7" class="px-2 py-2 border text-center">
              <div class="flex justify-center items-center">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
                ></div>
                <span class="ml-2">Loading...</span>
              </div>
            </td>
          </tr>

          <tr
            v-if="
              !loading && (!allEmployees || allEmployees.length === 0) && !errorMessage
            "
          >
            <td colspan="7" class="px-2 py-2 border text-center text-gray-500">
              No employees found
            </td>
          </tr>

          <tr v-if="errorMessage && !loading">
            <td colspan="7" class="px-2 py-2 border text-center text-red-500 font-bold">
              {{ errorMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      v-if="allEmployees.length > 0"
      :page_number="search.page_num"
      :total_rows="allEmployees.length"
      :itemsperpage="search.itemsperpage"
      @page_num="handlePagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import AttendanceAction from "@/views/Pages/DailyAttendance/Action/AttendanceAction.vue";
import Pagination from "@/views/Component/Pagination.vue";
import AddLog from "@/views/Pages/AttendanceLogs/Action/Add.vue";

const allEmployees = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const currentDate = ref(new Date());
const addModal = ref(null);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const formattedCurrentDate = computed(() => {
  return currentDate.value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const paginatedEmployees = computed(() => {
  let filtered = allEmployees.value;

  if (search.value.search) {
    const searchTerm = search.value.search.toLowerCase();
    filtered = filtered.filter(
      (emp) =>
        emp.firstName?.toLowerCase().includes(searchTerm) ||
        emp.lastName?.toLowerCase().includes(searchTerm) ||
        emp.employeeNumber?.toLowerCase().includes(searchTerm)
    );
  }

  const start = (search.value.page_num - 1) * search.value.itemsperpage;
  const end = start + search.value.itemsperpage;
  return filtered.slice(start, end);
});

const searchInput = () => {
  search.value.page_num = 1;
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
};

// NEW: Format datetime as YYYY-MM-DD HH:MM
const formatDateTime = (datetime) => {
  if (!datetime) return "—";
  try {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (e) {
    return "—";
  }
};

// FIXED: Format shift time without showing "Invalid Date"
const formatShiftTime = (shift) => {
  if (!shift || !shift.time_in) return "";

  // Helper function to format time string without using Date object
  const formatTimeString = (timeStr) => {
    if (!timeStr) return "—";

    // Check if it's a valid time string (HH:MM:SS or HH:MM format)
    if (typeof timeStr === "string" && timeStr.includes(":")) {
      const parts = timeStr.split(":");
      if (parts.length >= 2) {
        let hours = parseInt(parts[0]);
        const minutes = parts[1];

        // Convert to 12-hour format
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12

        return `${hours}:${minutes} ${ampm}`;
      }
    }

    return timeStr;
  };

  const timeIn = formatTimeString(shift.time_in);
  const timeOut = shift.time_out ? formatTimeString(shift.time_out) : "—";

  return `${timeIn} - ${timeOut}`;
};

const calculateTotalHours = (employee) => {
  if (!employee.attendances?.length) return "—";

  const attendance = employee.attendances[0];

  if (!attendance.time_in) return "—";
  if (!attendance.time_out) return "In Progress";

  try {
    const timeIn = new Date(attendance.time_in);
    const timeOut = new Date(attendance.time_out);

    // Calculate difference in milliseconds
    const diffMs = timeOut - timeIn;

    // Convert to hours and minutes
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs}h ${diffMins}m`;
  } catch (e) {
    return "—";
  }
};

const getTotalHoursClass = (employee) => {
  if (!employee.attendances?.length) return "";

  const attendance = employee.attendances[0];

  if (!attendance.time_in) return "";
  if (!attendance.time_out) return "text-yellow-600";

  // Check if undertime (less than expected shift hours)
  if (employee.shift?.time_in && employee.shift?.time_out) {
    try {
      const timeIn = new Date(attendance.time_in);
      const timeOut = new Date(attendance.time_out);

      const shiftTimeIn = new Date();
      const shiftTimeOut = new Date();

      const [inHours, inMinutes] = employee.shift.time_in.split(":");
      const [outHours, outMinutes] = employee.shift.time_out.split(":");

      shiftTimeIn.setHours(parseInt(inHours), parseInt(inMinutes), 0);
      shiftTimeOut.setHours(parseInt(outHours), parseInt(outMinutes), 0);

      // Handle graveyard shift
      if (shiftTimeOut < shiftTimeIn) {
        shiftTimeOut.setDate(shiftTimeOut.getDate() + 1);
      }

      const actualHours = (timeOut - timeIn) / (1000 * 60 * 60);
      const expectedHours = (shiftTimeOut - shiftTimeIn) / (1000 * 60 * 60);

      if (actualHours < expectedHours - 0.5) {
        // Less than expected by 30 mins
        return "text-orange-600 font-semibold";
      }

      return "text-green-600 font-semibold";
    } catch (e) {
      return "";
    }
  }

  return "";
};

const fetchEmployees = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    const response = await axios.get("/api/employees-with-attendance");

    if (Array.isArray(response.data)) {
      allEmployees.value = response.data;
    } else if (response.data && response.data.data) {
      allEmployees.value = response.data.data;
    } else {
      allEmployees.value = response.data || [];
    }

    loading.value = false;
  } catch (error) {
    loading.value = false;

    if (error.response) {
      errorMessage.value = `Server Error: ${error.response.status} - ${
        error.response.data?.message || error.message
      }`;
    } else if (error.request) {
      errorMessage.value =
        "No response from server. Please check if the server is running.";
    } else {
      errorMessage.value = `Error: ${error.message}`;
    }
  }
};

// Open add modal
const openAddModal = () => {
  if (addModal.value) {
    addModal.value.openModal();
  }
};

onMounted(() => {
  fetchEmployees();
});
</script>
