<template>
  <div v-if="hasPermission('Variance_Report_Tab')">
    <div class="px-0 min-h-screen">
      <div class="flex flex-col lg:flex-row lg:justify-between mb-4">
        <div class="block lg:flex space-x-2">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Ingredients..."
            class="shadow shadow-gray-700 flex w-full focus-visible:bg-yellow-100 text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
          />
          <select
            v-model="search.warehouse_id"
            @change="searchInput"
            class="shadow shadow-gray-700 hover:opacity-70 text-black text-sm md:text-md w-full py-2 rounded px-4 mb-4 float-end text-nowrap"
          >
            <option v-for="(w, ww) in warehouses" :key="w.value" :value="w.value">
              {{ w.label }}
            </option>
            <option value="0">All</option>
          </select>
          <input
            type="date"
            v-model="search.filter_date"
            class="shadow shadow-gray-700 hover:opacity-70 text-black text-sm md:text-md w-full py-2 rounded px-4 mb-4 float-end text-nowrap"
          />
          <button
            @click.prevent="filterVariance()"
            class="bg-red-500 text-white hover:opacity-70 focus:bg-blue-300 text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
          >
            <i class="fas fa-filter"></i>
            Filter
          </button>
          <button
          @click="downloadExcel"
            class="bg-purple-500 text-white hover:opacity-70 focus:bg-purple-300 text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
            :href="`${VUE_APP_API_URL}ingredient-reports/download-excel-variance-filter-by-date/${search.filter_date}/${search.ingredient_type_id}/${search.category_id}`"
          >
            <i class="fas fa-file-excel"></i>
            <span>
              Download Excel
            </span>
            <span v-if="isProcessing" class="ml-2 text-xs">Processing...</span>
        </button>
        </div>
        <div class="flex space-x-2 overflow-auto">
          <!-- <UploadMenu
            v-if="hasPermission('Upload_Utak_Inventory_Button')"
            @transaction_id="handleTransaction"
          /> -->
        </div>
      </div>

      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-wrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                ID #
              </th>
              <th
                scope="col"
                width="15%"
                class="px-2 py-2 text-left text-xs font-medium uppercase border tracking-wider"
              >
                Name
              </th>
                            <th
                scope="col"
                width="15%"
                class="px-2 py-2 text-left text-xs font-medium uppercase border tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Cost Price
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Beginning
              </th>
              <!-- <th
                scope="col"
                width="10%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                Override Beginning
              </th> -->
              <th
                scope="col"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Added
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Deduct
              </th>
              <!-- <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                Deduct (Utak POS)
              </th> -->
              <th
                scope="col"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Current
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Total Cost
              </th>
              <!-- <th
                scope="col"
                width="10%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                Input (Physical Count)
              </th> -->
              <th
                scope="col"
                width="10%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                Physical Count
              </th>
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                O/S
              </th>
              <!-- <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                Status
              </th> -->
              <th
                scope="col"
                width="10%"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Adjusted
              </th>
              <!-- <th
                scope="col"
                width="10%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                Action
              </th> -->
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-xs">
            <!-- Loop through products and display them -->
            <tr
              v-for="(ing, index) in data.warehouseItems"
              class="hover:bg-gray-200"
              v-if="data.warehouseItems?.length > 0"
              :key="ing.id"
            >
              <td class="px-2 py-2 border text-center">
                {{ ing.ingredientIdNumber ?? "-" }}
              </td>
              <td class="px-2 py-2 border capitalize">
                <p class="text-wrap">
                  {{ ing.itemName }}
                  <i>{{ ing.unitAbbre }}</i>
                  <sup class="text-blue-500 font-extrabold text-sm ml-2 font-mono">{{
                    ing.ingredientTypeAbbre ?? "-"
                  }}</sup>
                </p>
              </td>
              <td class="px-2 py-2 border text-left">{{ ing.warehouseName ?? "" }}</td>
              <td class="px-2 py-2 border text-right">
                <p :class="formatQuantityColor(ing.costPrice)">
                  {{ moneyFormatter(ing.CostPrice ?? 0) }}
                </p>
              </td>
              <td class="px-2 py-2 border text-right">
                <p :class="formatQuantityColor(ing.beginning)">
                  {{ ing.beginning }}
                  <sub>{{ ing.unitAbbre }}</sub>
                </p>
              </td>
              <!-- <td class="px-2 py-2 border text-right">
                <p :class="formatQuantityColor(ing.override_beginning)"></div>
              </td> -->
              <td class="px-2 py-2 border text-right">
                <Added
                  :key="ing.id + '_&&_' + search.filter_date"
                  :dateCreated="search.filter_date"
                  :data="ing"
                />
              </td>
              <td class="px-2 py-2 border text-right">
                <Deducted
                  :key="ing.id + '_&&_' + search.filter_date"
                  :dateCreated="search.filter_date"
                  :data="ing"
                />
              </td>
              <!-- <td class="px-2 py-2 border text-right">
                <p :class="formatQuantityColor(ing.deductUtak)"></div>
              </td> -->
              <td class="px-2 py-2 text-right text-nowrap bg-green-100">
                <p :class="formatQuantityColor(ing.stocks)">
                  {{ ing.floatStocks }}
                  <sub>{{ ing.unitAbbre }}</sub>
                </p>
              </td>
              <td class="px-2 py-2 border text-right text-nowrap">
                <p hidden>
                  {{
                    (ing.total_cost = ((ing.stocks ?? 0) * (ing.costPrice ?? 0))?.toFixed(
                      2
                    ))
                  }}
                </p>

                <p :class="formatQuantityColor(ing.total_cost)">
                  {{ moneyFormatter(ing.total_cost ?? 0) }}
                </p>
              </td>
              <!-- <td class="px-2 py-2 border text-right">
                <p :class="formatQuantityColor(ing.physical_count)"></div>
              </td> -->
              <td class="px-2 py-2 border text-center">
                <p :class="formatQuantityColor(ing.physicalCount)">
                  {{ ing.physicalCount }}
                  <sub>{{ ing.unitAbbre }}</sub>
                </p>
                <small class="text-gray-600">{{ ing.dateOfAdjusted }}</small>
              </td>
              <td class="px-2 py-2 border text-right">
                <p :class="formatQuantityColor(ing.OS)">{{ ing.OS }}</p>
              </td>
              <!-- <td class="px-2 py-2 border text-center">
                <span class="rounded-full px-2 py-1 bg-red-500 text-white">Shortage</span>
              </td> -->
              <td
                class="px-2 py-2 border text-right"
                :class="ing.adjusted >= 0 ? 'text-black-500' : 'text-red-500'"
              >
                <p :class="formatQuantityColor(ing.adjusted)">{{ ing.adjusted }}</p>
              </td>
              <!-- <td class="px-2 py-2 border text-center">
                
                
              </td> -->
            </tr>
            <tr v-if="loading == true">
              <td class="px-2 py-2 border text-center text-red-500" colspan="15">
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td class="px-2 py-2 border text-center text-red-500" colspan="15">
                ***No Variance found***
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
  DATE_NOW,
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
  convertWordToDate,
  formatQuantityColor,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

import UploadMenu from "@/views/Pages/Ingredients/Actions/UploadMenu.vue";
import Added from "./Actions/Added.vue";
import Deducted from "./Actions/Deducted.vue";
const isProcessing = ref(false);

const token = localStorage.getItem("token");
const user_warehouse_id = localStorage.getItem("warehouse_id");
const loading = ref(false);
const data = ref({});
const warehouses = ref([]);
const categories = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  category_id: 0,
  warehouse_id: 0,
  ingredient_type_id: 0,
  filter_date: "",
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listIngredientVariances();
  handlePagination(1);
}, 500);
const filterVariance = () => {
  search.value.page_num = 1;
  listIngredientVariances();
};
const listIngredientVariances = async () => {
  try {
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}variances/snapshot-list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;

    data.value.ingredients?.forEach((item) => {
      item.override_beginning = 0;
      item.physical_count = 0;
    });

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

const warehouseDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}warehouses/dropdown`,
      BearToken(token)
    );
    warehouses.value = response.data.warehouses;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};
const defaultFilterDate = async () => {
  // Get current date
  const today = new Date();

  // Move back by 1 day
  today.setDate(today.getDate() - 1);

  // Format it according to your existing convertWordToDate function
  search.value.filter_date = convertWordToDate(today);
};

const downloadExcel = async () => {
  console.log("Download Excel");
  if (isProcessing.value) return; // avoid double clicks
  isProcessing.value = true;
  const url = `${VUE_APP_API_URL}ingredient-reports-auth/download-excel-variance-filter-by-date/${search.value.filter_date}/${search.value.warehouse_id}`;

  try {
    const response = await axios.get(url, {
      ...BearToken(token),
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "sales-per-cashier.xlsx";
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Download error:", err);
    Swal.fire("Download Failed", "There was a problem downloading the report.", "error");
  } finally {
    isProcessing.value = false;
  }
};

// Call listIngredientVariances when component is mounted
onMounted(() => {
  warehouseDropdown()
  defaultFilterDate();
  listIngredientVariances();
});
</script>
