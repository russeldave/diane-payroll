<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <BreadCrumbs :page="'Employee Time Settings'" />

    <h1 class="text-2xl font-bold mt-4 mb-4">Employee Time Settings</h1>

    <!-- TOP BAR -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <!-- SEARCH -->
      <input
        type="search"
        placeholder="Search Shift..."
        v-model="search"
        @input.prevent="searchInput"
        class="shadow shadow-gray-400 w-full md:w-1/3 font-semibold text-md py-2 px-4 rounded-lg mb-4 md:mb-0"
      />

      <!-- CREATE SHIFT BUTTON -->
      <button
        @click="openCreateShift"
        class="bg-blue-500 text-white hover:opacity-70 font-bold text-sm md:text-md py-2 px-4 rounded-lg"
      >
        <i class="fa fa-clock mr-2"></i> Create Shift
      </button>
    </div>

    <!-- TABLE -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- HEADER -->
        <thead
          class="text-white shadow bg-gradient-to-l from-[#4B0082] via-blue-600 via-blue-700 via-blue-500 via-blue-700 to-[#4B0082]"
        >
          <tr class="border-b-2 text-left border-yellow-500">
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Shift Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Type
            </th>
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Max Early
            </th>
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Time In
            </th>
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Time Out
            </th>
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Max Out
            </th>
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="divide-y divide-gray-200 text-sm">
          <tr v-for="shift in paginatedShifts" :key="shift.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 border">{{ shift.shift_name }}</td>
            <td class="px-6 py-4 border">{{ shift.type }}</td>

            <!-- AM/PM FORMATTED TIMES -->
            <td class="px-6 py-4 border">{{ formatTime(shift.max_early) }}</td>
            <td class="px-6 py-4 border">{{ formatTime(shift.time_in) }}</td>
            <td class="px-6 py-4 border">{{ formatTime(shift.time_out) }}</td>
            <td class="px-6 py-4 border">{{ formatTime(shift.max_out) }}</td>

            <!-- ACTIONS -->
            <td class="px-6 py-4 text-center">
              <div class="inline-flex rounded-md shadow-sm">
                <button
                  @click="viewRef.openModal(shift.id)"
                  class="bg-blue-500 text-white hover:opacity-70 font-bold text-sm py-2 px-4 rounded-l"
                >
                  <i class="fa-solid fa-street-view"></i>
                  View
                </button>

                <button
                  @click="editRef.openModal(shift.id)"
                  class="bg-yellow-500 hover:opacity-70 text-white font-bold text-sm py-2 px-4"
                >
                  <i class="fas fa-edit"></i>
                  Edit
                </button>

                <Delete :id="shift.id" @refresh="fetchShifts" />
              </div>
            </td>
          </tr>

          <tr v-if="loading">
            <td colspan="7" class="text-center py-6">
              <div class="flex justify-center items-center">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
                ></div>
                <span class="ml-2">Loading...</span>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedShifts.length === 0 && !loading">
            <td colspan="7" class="text-center py-6 text-gray-400">No shifts found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <Pagination
      v-if="filteredShifts.length > 0"
      :page_number="pagination.page_num"
      :total_rows="filteredShifts.length"
      :itemsperpage="pagination.itemsperpage"
      @page_num="handlePagination"
    />

    <!-- MODALS -->
    <CreateShift ref="createShiftRef" @refresh="fetchShifts" />
    <View ref="viewRef" />
    <Edit ref="editRef" @refresh="fetchShifts" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Pagination from "@/views/Component/Pagination.vue";

import CreateShift from "@/views/Pages/EmployeeTimeSettings/Action/Add.vue";
import View from "@/views/Pages/EmployeeTimeSettings/Action/View.vue";
import Edit from "@/views/Pages/EmployeeTimeSettings/Action/Edit.vue";
import Delete from "@/views/Pages/EmployeeTimeSettings/Action/Delete.vue";

/* ================= STATE ================= */
const shifts = ref([]);
const search = ref("");
const loading = ref(false);

const pagination = ref({
  page_num: 1,
  itemsperpage: 10,
});

const createShiftRef = ref(null);
const viewRef = ref(null);
const editRef = ref(null);

/* ================= COMPUTED ================= */

// Filter shifts based on search
const filteredShifts = computed(() => {
  if (!search.value) return shifts.value;

  const searchTerm = search.value.toLowerCase();
  return shifts.value.filter(
    (shift) =>
      shift.shift_name?.toLowerCase().includes(searchTerm) ||
      shift.type?.toLowerCase().includes(searchTerm)
  );
});

// Paginate the filtered shifts
const paginatedShifts = computed(() => {
  const start = (pagination.value.page_num - 1) * pagination.value.itemsperpage;
  const end = start + pagination.value.itemsperpage;
  return filteredShifts.value.slice(start, end);
});

/* ================= FUNCTIONS ================= */

// Debounced search
const searchInput = () => {
  pagination.value.page_num = 1; // Reset to first page on search
};

// Handle pagination
const handlePagination = (page_num) => {
  pagination.value.page_num = page_num ?? 1;
};

// Fetch shifts
const fetchShifts = async () => {
  try {
    loading.value = true;

    // Try to get paginated data from API if available
    try {
      const response = await axios.post(
        "http://localhost:8995/api/employee-time-settings/list",
        {
          search: search.value,
          page_num: pagination.value.page_num,
          itemsperpage: pagination.value.itemsperpage,
        }
      );

      // Check if API supports pagination
      if (
        response.data &&
        response.data.employeeTimeSettings &&
        response.data.total !== undefined
      ) {
        // API returns paginated data
        shifts.value = response.data.employeeTimeSettings;
        // You might need to adjust pagination total based on API response
      } else if (response.data && response.data.employeeTimeSettings) {
        // API returns all data
        shifts.value = response.data.employeeTimeSettings;
      } else if (Array.isArray(response.data)) {
        shifts.value = response.data;
      } else {
        shifts.value = response.data?.employeeTimeSettings || [];
      }
    } catch (error) {
      // If paginated endpoint fails, try the regular endpoint
      console.log("Falling back to regular endpoint");
      const response = await axios.post(
        "http://localhost:8995/api/employee-time-settings/list",
        {}
      );
      shifts.value = response.data.employeeTimeSettings || [];
    }

    loading.value = false;
  } catch (error) {
    console.error("Fetch error:", error.response?.data || error);
    loading.value = false;
  }
};

/* ================= FORMAT TIME TO AM/PM ================= */
const formatTime = (time) => {
  if (!time) return "";

  try {
    const parts = time.split(":");
    let hours = parseInt(parts[0]);
    const minutes = parts[1];

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return time;
  }
};

/* ================= OPEN CREATE MODAL ================= */
const openCreateShift = () => {
  createShiftRef.value.openShiftModal();
};

/* ================= MOUNT ================= */
onMounted(() => {
  fetchShifts();
});
</script>
