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
              <th class="px-6 py-3 border text-left">ID</th>
              <th class="px-6 py-3 border text-left">Name</th>
              <th class="px-6 py-3 border text-left">Date Time</th>
            </tr>
          </thead>

          <!-- TABLE BODY -->
          <tbody class="bg-white divide-y divide-gray-200 text-sm">
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="hover:bg-gray-100 transition"
            >
              <td class="px-6 py-3 border">{{ log.id }}</td>
              <td class="px-6 py-3 border">{{ log.name }}</td>
              <td class="px-6 py-3 border">{{ log.datetime }}</td>
            </tr>

            <tr v-if="filteredLogs.length === 0">
              <td colspan="3" class="text-center py-6 text-gray-500">
                No attendance logs found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

/* ================= STATE ================= */

const logs = ref([]);
const search = ref("");
const addModal = ref(null);

/* ================= FETCH LOGS ================= */

const fetchLogs = async () => {
  try {
    const response = await axios.get("http://localhost:8995/api/attendance-logs");

    logs.value = response.data || [];
  } catch (error) {
    console.error("Fetch logs error:", error.response?.data || error);
  }
};

/* ================= OPEN ADD MODAL ================= */

const openAddModal = () => {
  if (addModal.value) {
    addModal.value.openModal();
  }
};

/* ================= SEARCH FILTER ================= */

const filteredLogs = computed(() => {
  if (!search.value) return logs.value;

  return logs.value.filter((log) =>
    log.name?.toLowerCase().includes(search.value.toLowerCase())
  );
});

/* ================= LOAD ON MOUNT ================= */

onMounted(fetchLogs);
</script>
