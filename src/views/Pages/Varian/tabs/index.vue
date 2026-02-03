<template>
  <div v-if="hasPermission('Navigation_Variance') && hasPermission('Navigation_Reports')">
    <div class="px-4 py-2 min-h-screen">
      <BreadCrumbs :page="'Variance Report'" />
      <div class="flex flex-col lg:flex-row justify-between mb-4">
        <h1 class="text-lg md:text-2xl font-bold mt-0 mb-0">Variance Report</h1>
        <div class="flex items-center mt-0 lg:mt-0 space-x-2">
          <label class="font-semibold text-gray-700">Date</label>
          <input 
            @change.prevent="setDatePhysicalCount"
            v-model="date_of_physical_count"
            type="date"
            class="border p-2 shadow shadow-gray-700 font-bold rounded"
          />
        </div>
      </div>
      <!-- <SetPhysicalCountDate v-if="hasPermission('Variance_Set_Physical_Count_Date')" @dateUpdated="handleUpdateKey()" /> -->
      <div class="mb-2">
        <!-- Static Tabs -->
        <ul
          class="flex flex-nowrap text-lg text-nowrap overflow-auto font-bold text-center text-gray-500 dark:text-gray-400"
          >
          <li
            class="me-2"
            v-if="
              hasPermission('Variance_Monitoring_Tab') &&
              hasPermission('Navigation_Variance') &&
              hasPermission('Navigation_Reports')
              "
            >
            <a
              href="#"
              @click.prevent="activateTab('Variance')"
              title="Variance"
              :class="getTabClass('Variance')"
            >
              <i class="fas fa-list-check me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Variance</span
              >
            </a>
          </li>
          <li
            class="me-2"
            v-if="
              hasPermission('Variance_Report_Tab') &&
              hasPermission('Navigation_Variance') &&
              hasPermission('Navigation_Reports')
              "
            >
            <a
              href="#"
              @click.prevent="activateTab('Reports')"
              title="Reports"
              :class="getTabClass('Reports')"
            >
              <i class="fas fa-plus me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Create Report</span
              >
            </a>
          </li>
          <li
            class="me-2"
            v-if="
              hasPermission('Variance_Logs_Tab') &&
              hasPermission('Navigation_Variance') &&
              hasPermission('Navigation_Reports')
            "
          >
            <!-- <a
              href="#"
              @click.prevent="activateTab('Logs')"
              title="Logs"
              :class="getTabClass('Logs')"
            >
              <i class="fas fa-history me-2"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Logs</span
              >
            </a> -->
          </li>
          <li
            class="me-2"
            v-if="
              hasPermission('Variance_Logs_Tab') &&
              hasPermission('Navigation_Variance') &&
              hasPermission('Navigation_Reports')
            "
          >
            <a
              href="#"
              @click.prevent="activateTab('physicalcounts')"
              title="Logs"
              :class="getTabClass('physicalcounts')"
            >
              <i class="fa-solid fa-list-ol"></i>
              <span class="text-xs sm:text-sm md:text-md xl:text-md hidden lg:inline"
                >Physical Counts</span
              >
            </a>
          </li>
        </ul>
      </div>

      <!-- Tab content -->
      <div class="py-6 h-full rounded">
        <Report v-if="activeTab == 'Reports'" :key="updateKey" />
        <Variance v-if="activeTab == 'Variance'" :key="updateKey" />
        <Logs v-if="activeTab == 'Logs'" :key="updateKey" />
        <PhysicalCounts v-if="activeTab == 'physicalcounts'" :key="updateKey"/>
        
      </div>
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { ref } from "vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue"; 
import axios from "axios";
const token = localStorage.getItem("token");
import {
  VUE_APP_API_URL,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  useDebounce,
  handleApiError,
  Toast,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import { DEFAULT_BG } from "@/views/Utility/Global";
import Error403 from "@/views/Error/403.vue";
// Import the tab components
import Report from "@/views/Pages/Varian/tabs/Report/Index.vue";
import Variance from "@/views/Pages/Varian/tabs/Variance/Index.vue";
import Logs from "@/views/Pages/Varian/tabs/Logs/Index.vue";
import PhysicalCounts from "@/views/Pages/Varian/tabs/PhysicalCounts/index.vue"
// import SetPhysicalCountDate from "./Tabs/Variance/Actions/SetPhysicalCountDate.vue";
// Define the active tab state
const activeTab = ref("Variance");
const updateKey = ref(0);
const date_of_physical_count = ref('');

const handleUpdateKey = () => {
  updateKey.value = Math.random();
}
// Activate a tab
const activateTab = (index) => {
  activeTab.value = index;
};

const setDatePhysicalCount = async (item,index) => {
  console.log('setDatePhysicalCount');
  try {
    const formData = FormDx({ date_of_physical_count: date_of_physical_count.value});
    const response = await axios.post(`${VUE_APP_API_URL}settings/set-date-of-physical-count`,formData, BearToken(token));
    Toast("success", "Success", response.data.message);
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
}

const getTabClass = (tabName) =>
  activeTab.value === tabName
    ? `inline-flex text-white border-b-2 p-2 border-yellow-600 ${DEFAULT_BG.value} rounded-t-lg active dark:text-blue-500 dark:border-blue-500`
    : `inline-flex items-center justify-center p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group`;
</script>
