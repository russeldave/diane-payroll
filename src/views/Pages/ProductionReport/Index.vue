<template>
  <div
    v-if="
      hasPermission('Navigation_Production_Report') && hasPermission('Navigation_Reports')
    "
  >
    <div class="px-4 min-h-screen rounded dark:border-gray-700">
      <!-- <BreadCrumbs :page="'Production Report'" /> -->
      <h1 class="text-lg md:text-2xl font-bold mb-4 mt-1 px-2">Production Report</h1>
      <div class="flex px-4 flex-col md:flex-row md:justify-between mb-4">
        <div class="block md:flex items-center gap-2">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Production Report..."
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
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '2'"
            type="date"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '3'"
            type="week"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '4'"
            type="month"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
            @change="handleDateChange"
          />
          <select
            v-model="search.menu_id"
            @change.prevent="searchInput()"
            class="shadow shadow-gray-700 flex w-full text-sm md:text-md py-2 px-4 rounded mb-4"
          >
            <option value="0">All Menu Categories</option>
            <option v-for="menu in menus" :key="menu.id" :value="menu.id">
              {{ menu.name }}
            </option>
          </select>
          <ProductionReport
            v-if="hasPermission('Production_Report_Button')"
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
                  width="10%"
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Date of Production
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Ingredient Name
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Stocks
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Yeild
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Produced Qty
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Total Produced
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Created By
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="prod in data.productions"
                class="hover:bg-gray-200"
                v-if="data.productions?.length > 0 && !loading"
                :key="prod.id"
                :title="`Ingredient: ${prod.ingredientName} \n Prepared By: ${prod.userName} \n Date: ${prod.dateOfPrepared}`"
              >
                <td class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900">
                  {{ prod.dateOfPrepared }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 first-letter:capitalize lowercase text-wrap"
                >
                  {{ prod.ingredientName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border text-right whitespace-nowrap text-sm text-gray-900 uppercase"
                >
                  {{
                    formatNumberWithCommas(prod.onDateStocks ?? 0) ??
                    parseFloat(0).toFixed(2)
                  }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
                >
                  {{
                    formatNumberWithCommas(prod.setYeild ?? 0) ?? parseFloat(0).toFixed(2)
                  }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
                >
                  {{
                    formatNumberWithCommas(prod.quantity ?? 0) ?? parseFloat(0).toFixed(2)
                  }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
                >
                  {{
                    formatNumberWithCommas(prod.totalProduced ?? 0) ??
                    parseFloat(0).toFixed(2)
                  }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-left text-gray-900 capitalize"
                >
                  {{ prod.userName ?? "-" }}
                </td>
              </tr>
              <tr v-if="data.productions?.length == 0 && !loading" class="text-center">
                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="7">
                  No transactions found.
                </td>
              </tr>
              <tr v-if="loading" class="text-center">
                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="7">
                  <Loader />
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
import {
  FormDx,
  BearToken,
  useDebounce,
  formatNumberWithCommas,
} from "@/views/Utility/Helper";
import {
  orderStatusFormatter,
  orderStatusClassFormatter,
} from "@/views/Utility/Formatter";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

//modules
import ProductionReport from "./Actions/ProductionReport.vue";

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const menus = ref([]); // Add a reference for menus
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
  await listProductionReports();
  handlePagination(1);
}, 500);

const handleDateChange = () => {
  search.value.page_num = 1;
  listProductionReports();
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
  listProductionReports();
};

const listProductionReports = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredient-logs/prepared-productions`,
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
  listProductionReports();
};

const categoryDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}menu-categories/list-cashier`,
      BearToken(token)
    );
    menus.value = response.data.menuCategories ?? [];
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
};

// Call listProductionReports when component is mounted
onMounted(() => {
  categoryDropdown();
  listProductionReports();
});
</script>
