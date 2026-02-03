<template>
  <div v-if="hasPermission('Navigation_Scrap_Report')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Scrap Report'" /> -->
      <h1 class="text-lg md:text-2xl font-bold mb-4 mt-1 px-2">Scrap Report</h1>
      <!-- advance filter -->
      <div class="flex px-4 flex-col md:flex-row md:justify-between mb-4">
        <div class="block md:flex items-center gap-2">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Scrap..."
            class="shadow shadow-gray-700 flex w-full font-bold focus-visible:bg-yellow-200 text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
          />

          <select
            v-model="search.type"
            class="shadow shadow-gray-700 flex w-full text-sm md:text-md py-2 px-4 rounded mb-4"
            @change="handleTypeChange"
          >
            <option value="0">All</option>
            <option value="1">Hourly</option>
            <option value="2">Daily</option>
            <option value="3">Weekly</option>
            <option value="4">Monthly</option>
          </select>

          <input
            v-if="search.type === '1'"
            type="datetime-local"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '2'"
            type="date"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '3'"
            type="week"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '4'"
            type="month"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4"
            @change="handleDateChange"
          />

          <ScrapReport
            v-if="hasPermission('Scrap_Report_Button')"
            @transaction_id="handleTransaction"
          />
        </div>
      </div>

      <div class="px-4 overflow-x-auto">
        <div class="flex w-full overflow-auto text-nowrap">
          <table class="min-w-full divide-y divide-gray-200">
            <thead :class="DEFAULT_BG" class="text-white">
              <tr>
                <th
                  class="px-6 py-4 border text-left text-xs font-medium uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-4 border text-left text-xs font-medium uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  class="px-6 py-4 border text-left text-xs font-medium uppercase tracking-wider"
                >
                  Ingredient
                </th>
                <th
                  class="px-6 py-4 border text-right text-xs font-medium uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  class="px-6 py-4 border text-left text-xs font-medium uppercase tracking-wider"
                >
                  Reason
                </th>
                <th
                  class="px-6 py-4 border text-left text-xs font-medium uppercase tracking-wider"
                >
                  Created By
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-4 border text-center">
                  <Loader />
                </td>
              </tr>
              <tr v-else-if="!loading && data.scrapLists?.length === 0">
                <td colspan="6" class="px-6 py-4 border text-center text-gray-500">
                  No scrap records found
                </td>
              </tr>
              <tr
                v-for="scrap in data?.scrapLists"
                :key="scrap.id"
                v-if="!loading && data.scrapLists?.length > 0"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 border whitespace-nowrap text-left text-sm text-gray-500"
                >
                  {{ scrap.scrapedDate }}
                </td>
                <td
                  class="px-6 py-4 border whitespace-nowrap text-left text-sm text-gray-500 uppercase"
                >
                  {{ scrap.scrapedType ?? "-" }}
                </td>
                <td
                  class="px-6 py-4 border whitespace- text-left text-sm text-wrap text-gray-500 capitalize"
                >
                  {{ scrap.ingredientName ?? "-" }}
                </td>
                <td
                  class="px-6 py-4 border whitespace-nowrap text-right text-sm text-gray-900 text-right"
                >
                  {{ scrap.quantity }} <sub>{{ scrap.unitAbbre }}</sub>
                </td>
                <td class="px-6 py-4 border text-sm text-left text-gray-900 text-wrap">
                  {{ scrap.reason }}
                </td>
                <td
                  class="px-6 py-4 border whitespace-nowrap text-sm text-left text-gray-500 capitalize"
                >
                  {{ scrap.userName }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex w-full overflow-auto">
          <Paginator
            v-if="data.totalrows"
            :page_number="search.page_num"
            :total_rows="data.totalrows"
            :itemsperpage="search.itemsperpage"
            @page_num="handlePagination"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import DatePicker from "@/views/Component/DatePicker.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import { FormDx, BearToken, useDebounce } from "@/views/Utility/Helper";
import {
  orderStatusFormatter,
  orderStatusClassFormatter,
} from "@/views/Utility/Formatter";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

//modules
import ScrapReport from "@/views/Pages/Scrap/Actions/ScrapReport.vue";

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
  menu_id: 0, // Default to all menus
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getScrapReport();
  handlePagination(1);
}, 500);

const handleDateChange = () => {
  search.value.page_num = 1;
  getScrapReport();
};

const handleTypeChange = () => {
  // Reset date format based on type
  if (search.value.type === "2") {
    // For daily, use YYYY-MM-DD format
    search.value.date = new Date().toISOString().split("T")[0];
  } else {
    // For monthly, use YYYY-MM format
    search.value.date = new Date().toISOString().slice(0, 7);
  }
  getScrapReport();
};

const getScrapReport = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}scrap-reports/list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getScrapReport();
};

// Call getScrapReport when component is mounted
onMounted(() => {
  getScrapReport();
});
</script>
