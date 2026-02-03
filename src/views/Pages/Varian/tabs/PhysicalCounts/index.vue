<template>
  <div v-if="hasPermission('Variance_Logs_Tab')">
    <div class="px-0 min-h-screen">
      <div class="flex px-0 flex-col md:flex-row md:justify-between">
        <div class="block md:flex items-center gap-2">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Logs..."
            class="shadow shadow-gray-700 flex w-full font-bold focus-visible:bg-yellow-200 text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
          />

          <select
            v-model="search.type"
            class="flex w-full shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4"
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

          <!-- <select
            @change.prevent="searchInput()"
            class="shadow shadow-gray-700 hover:opacity-70 text-black font-bold text-sm md:text-md w-full py-2 rounded px-4 mb-4 float-end text-nowrap"
            v-model="search.category_id"
          >
            <option value="0">--Select Category--</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.value"
            >
              {{ category.label }}
            </option>
          </select> -->
        </div>
        <div>
          <!-- <a
            target="_blank"
            class="bg-lime-500 text-white hover:opacity-70 focus:bg-lime-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
            :href="`${VUE_APP_API_URL}ingredient-reports/download-excel-variance-current-date`"
          >
            <i class="fas fa-file-excel"></i>
            Download Excel
          </a> -->
        </div>
      </div>
      <div class="px-3 mt-4">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead :class="DEFAULT_BG" class="text-white">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                >
                  Ingredient
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider border"
                >
                  Quantity
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                >
                  Counted By
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="3" class="px-6 py-4 text-center">
                  <Loader />
                </td>
              </tr>
              <tr v-else-if="!loading && data.physicalCounts?.length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
              <tr
                v-for="scrap in data?.physicalCounts"
                :key="scrap.id"
                v-if="!loading && data.physicalCounts?.length > 0"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border text-center"
                >
                  {{ scrap.ingredientIdNumber }} -- {{ scrap.itemName }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border text-right"
                >
                  {{ scrap.count }} <sub>{{ scrap.unitAbbre }}</sub>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                  {{ scrap.userName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                  <span v-if="scrap.status == 1" class="bg-yellow-500 text-white text-md font-medium px-2 py-1 rounded">Pending</span>
                  <span v-else class="bg-green-500 text-white text-sm font-medium px-2 py-1 rounded">Approved</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                  {{ scrap.dateOfCount }}
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
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import ImageViewer from "@/views/Component/ImageViewer.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  CATEGORIES,
  DEFAULT_BG,
  ING_DOWNLOAD_LINK,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  barcodeConverter,
  useDebounce,
  handleApiError,
  moneyFormatter,
  Toast,
  formatQuantityColor,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const categories = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  category_id: 0,
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listIngredientVariances();
  handlePagination(1);
}, 500);

const handleTypeChange = () => {
  // Reset date format based on type
  if (search.value.type === "2") {
    // For daily, use YYYY-MM-DD format
    search.value.date = new Date().toISOString().split("T")[0];
  } else {
    // For monthly, use YYYY-MM format
    search.value.date = new Date().toISOString().slice(0, 7);
  }
  listIngredientVariances();
};

const handleDateChange = () => {
  search.value.page_num = 1;
  listIngredientVariances();
};

const listIngredientVariances = async () => {
  try {
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}variances/all-physical-counts`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listIngredientVariances();
};
const handleTransaction = (transaction_id) => {
  listIngredientVariances();
};
// const ingredientsCategoryDropdown = async () => {
//   try {
//     const response = await axios.get(
//       `${VUE_APP_API_URL}ingredient-categories/dropdown`,
//       BearToken(token)
//     );
//     categories.value = response.data.ingredientCategories;
//   } catch (error) {
//     console.log(error);
//     handleApiError(error);
//   }
// };

// Call listIngredientVariances when component is mounted
onMounted(() => {
//   ingredientsCategoryDropdown();
  listIngredientVariances();
});
</script>
