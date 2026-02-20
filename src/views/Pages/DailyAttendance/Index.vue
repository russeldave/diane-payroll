<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <BreadCrumbs :page="'Daily Attendance'" />

    <div class="bg-white shadow rounded-lg p-6 border">
      <!-- TITLE + DATE (Same Row) -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <!-- LEFT SIDE -->
        <h2 class="text-2xl font-bold">Daily Attendance</h2>

        <!-- RIGHT SIDE -->
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
          placeholder="Search employee name..."
          class="shadow shadow-gray-400 w-full md:w-1/3 font-semibold text-md py-2 px-4 rounded-lg"
        />
      </div>
    </div>

    <!-- TABLE -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead
          class="text-white shadow bg-gradient-to-l from-[#4B0082] via-blue-600 via-blue-700 via-blue-500 via-blue-700 to-[#4B0082]"
        >
          <tr class="border-b-2 border-yellow-500">
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">Name</th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Shift
            </th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Time In
            </th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Time Out
            </th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">Date</th>
            <th class="px-6 py-3 border text-left text-xs font-medium uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="employee in paginatedEmployees" :key="employee.id">
            <td class="px-6 py-4 border font-medium">
              {{ employee.firstName }} {{ employee.lastName }}
            </td>

            <td class="px-6 py-4 border text-indigo-600 font-semibold">
              {{ employee.shift?.shift_name || "No Shift" }}
            </td>

            <td class="px-6 py-4 border">
              {{
                employee.attendances?.length
                  ? formatTime(employee.attendances[0].time_in)
                  : "—"
              }}
            </td>

            <td class="px-6 py-4 border">
              {{
                employee.attendances?.length && employee.attendances[0].time_out
                  ? formatTime(employee.attendances[0].time_out)
                  : "—"
              }}
            </td>

            <td class="px-6 py-4 border">
              {{ formattedCurrentDate }}
            </td>

            <td class="px-6 py-4 border">
              <AttendanceAction :employeeId="employee.id" @refresh="fetchEmployees" />
            </td>
          </tr>

          <tr v-if="loading == true">
            <td colspan="6" class="px-2 py-2 border text-center">
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
              (!allEmployees || allEmployees.length === 0) &&
              loading == false &&
              !errorMessage
            "
          >
            <td colspan="6" class="px-2 py-2 border text-center text-gray-500">
              No employees found
            </td>
          </tr>
          <tr v-if="errorMessage && loading == false">
            <td colspan="6" class="px-2 py-2 border text-center text-red-500 font-bold">
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

/* STATE */
const allEmployees = ref([]); // Store all employees from API
const shifts = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const currentDate = ref(new Date());
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});

/* COMPUTED - Paginate employees on frontend */
const paginatedEmployees = computed(() => {
  // First filter by search
  let filtered = allEmployees.value;

  if (search.value.search) {
    const searchTerm = search.value.search.toLowerCase();
    filtered = filtered.filter(
      (emp) =>
        emp.firstName?.toLowerCase().includes(searchTerm) ||
        emp.lastName?.toLowerCase().includes(searchTerm)
    );
  }

  // Then paginate
  const start = (search.value.page_num - 1) * search.value.itemsperpage;
  const end = start + search.value.itemsperpage;
  return filtered.slice(start, end);
});

/* DATE FORMAT */
const formattedCurrentDate = computed(() => {
  return currentDate.value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

/* DEBOUNCED SEARCH */
const searchInput = () => {
  search.value.page_num = 1;
  // No need to fetch again, computed will handle filtering
};

/* PAGINATION HANDLER */
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
};

/* FORMAT TIME */
const formatTime = (time) => {
  if (!time) return "—";
  try {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return "—";
  }
};

/* FETCH EMPLOYEES */
const fetchEmployees = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    console.log("Fetching all employees...");

    // Use the original GET endpoint that works
    const response = await axios.get("http://localhost:8995/api/employees-attendance");

    console.log("API Response:", response.data);

    // Store all employees
    if (Array.isArray(response.data)) {
      allEmployees.value = response.data;
    } else if (response.data && response.data.employees) {
      allEmployees.value = response.data.employees;
    } else if (response.data && response.data.data) {
      allEmployees.value = response.data.data;
    } else {
      allEmployees.value = response.data || [];
    }

    console.log("Total employees loaded:", allEmployees.value.length);
    loading.value = false;
  } catch (error) {
    console.error("Fetch error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

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

/* FETCH SHIFTS */
const fetchShifts = async () => {
  try {
    const response = await axios.post("http://localhost:8995/api/daily-attendance/list");
    shifts.value = response.data;
    console.log("Shifts loaded:", response.data);
  } catch (error) {
    console.error("Error fetching shifts:", error);
  }
};

/* MOUNT */
onMounted(() => {
  console.log("Component mounted");
  fetchEmployees();
  fetchShifts();
});
</script>
