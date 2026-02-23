<template>
  <div class="p-6 min-h-screen bg-gray-100">
    <!-- Page Header -->
    <BreadCrumbs :page="'Attendance Logs'" />

    <div class="bg-white shadow rounded-lg p-6 border">
      <!-- TITLE -->
      <h2 class="text-2xl font-bold mb-6">Attendance Logs</h2>

      <!-- SEARCH + BUTTON ROW -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <!-- SEARCH BAR -->
        <input
          type="search"
          v-model="search"
          @input.prevent="searchInput()"
          placeholder="Search employee name..."
          class="shadow shadow-gray-400 w-full md:w-1/3 font-semibold text-md py-2 px-4 rounded-lg mb-4 md:mb-0"
        />

        <!-- NEW LOG BUTTON -->
        <button
          @click="openAddModal"
          class="bg-blue-600 hover:opacity-70 text-white px-4 py-2 rounded-lg font-bold"
        >
          + New Log
        </button>
      </div>

      <!-- TABLE -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- TABLE HEADER -->
          <thead
            class="text-white shadow bg-gradient-to-l from-[#4B0082] via-blue-600 via-blue-700 via-blue-500 via-blue-700 to-[#4B0082]"
          >
            <tr class="border-b-2 border-yellow-500">
              <th
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Date Time
              </th>
            </tr>
          </thead>

          <!-- TABLE BODY -->
          <tbody class="bg-white divide-y divide-gray-200 text-sm">
            <tr
              v-for="log in paginatedLogs"
              :key="log.id"
              class="hover:bg-gray-100 transition"
            >
              <td class="px-6 py-3 border">{{ log.id }}</td>
              <td class="px-6 py-3 border">{{ log.name }}</td>
              <td class="px-6 py-3 border">{{ formatDateTime(log.datetime) }}</td>
            </tr>

            <tr v-if="loading">
              <td colspan="3" class="text-center py-6">
                <div class="flex justify-center items-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
                  ></div>
                  <span class="ml-2">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedLogs.length === 0 && !loading">
              <td colspan="3" class="text-center py-6 text-gray-500">
                No attendance logs found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <Pagination
        v-if="filteredLogs.length > 0"
        :page_number="pagination.page_num"
        :total_rows="filteredLogs.length"
        :itemsperpage="pagination.itemsperpage"
        @page_num="handlePagination"
      />
    </div>

    <!-- ADD MODAL -->
    <AddLog ref="addModal" @refresh="fetchLogs" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import AddLog from "./Action/Add.vue";
import Pagination from "@/views/Component/Pagination.vue";

/* ================= STATE ================= */

const logs = ref([]);
const search = ref("");
const loading = ref(false);
const addModal = ref(null);

const pagination = ref({
  page_num: 1,
  itemsperpage: 10,
});

/* ================= COMPUTED ================= */

// Filter logs based on search
const filteredLogs = computed(() => {
  if (!search.value) return logs.value;

  const searchTerm = search.value.toLowerCase();
  return logs.value.filter((log) => log.name?.toLowerCase().includes(searchTerm));
});

// Paginate the filtered logs
const paginatedLogs = computed(() => {
  const start = (pagination.value.page_num - 1) * pagination.value.itemsperpage;
  const end = start + pagination.value.itemsperpage;
  return filteredLogs.value.slice(start, end);
});

/* ================= FUNCTIONS ================= */

// UPDATED: Format datetime as YYYY-MM-DD HH:MM
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
    return datetime;
  }
};

// Debounced search
const searchInput = () => {
  pagination.value.page_num = 1; // Reset to first page on search
};

// Handle pagination
const handlePagination = (page_num) => {
  pagination.value.page_num = page_num ?? 1;
};

// Fetch logs
const fetchLogs = async () => {
  try {
    loading.value = true;

    const response = await axios.get("http://localhost:8995/api/attendance-logs");

    if (Array.isArray(response.data)) {
      logs.value = response.data;
    } else if (response.data && response.data.data) {
      logs.value = response.data.data;
    } else {
      logs.value = response.data || [];
    }

    loading.value = false;
  } catch (error) {
    console.error("Fetch logs error:", error.response?.data || error);
    loading.value = false;
  }
};

// Open add modal
const openAddModal = () => {
  if (addModal.value) {
    addModal.value.openModal();
  }
};

/* ================= MOUNT ================= */

onMounted(() => {
  fetchLogs();
});
</script>
