<template>
  <div
    v-if="
      hasPermission('Navigation_Stock_Monitoring_Report') &&
      hasPermission('Navigation_Reports')
    "
  >
    <div class="px-4 min-h-screen rounded dark:border-gray-700 bg-gray-50">
      <!-- <BreadCrumbs :page="'Stock Monitoring'" /> -->
      <h1 class="text-lg md:text-2xl font-bold mb-6 mt-1 px-2 text-gray-800">
        {{ sectionTitle }}
      </h1>
      <div class="py-4 px-2 mb-4 bg-white rounded">
        <!-- Filters -->
        <div class="flex flex-col lg:flex-row lg:justify-between gap-4 mb-4">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Item..."
            class="shadow flex w-full focus-visible:bg-yellow-100 lg:w-1/4 font-bold text-xs py-2 px-4 rounded border border-gray-300"
          />
          <select
            @change.prevent="searchInput()"
            class="text-black font-bold text-xs w-full lg:w-1/4 lg:text-sm py-2 rounded px-4 rounded border-2 border-gray-300"
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
          </select>
        </div>

        <!-- Radio Buttons for Search Type -->
        <div class="flex flex-wrap items-center gap-4 mb-4">
          <label class="font-bold text-gray-700">Search Type:</label>
          <label class="flex items-center gap-2">
            <input
              type="radio"
              v-model="search.type_id"
              value="0"
              @change.prevent="searchInput()"
            />
            All
          </label>
          <label class="flex items-center gap-2">
            <input
              type="radio"
              v-model="search.type_id"
              value="1"
              @change.prevent="searchInput()"
            />
            Ingredients
          </label>
          <label class="flex items-center gap-2">
            <input
              type="radio"
              v-model="search.type_id"
              value="2"
              @change.prevent="searchInput()"
            />
            Production
          </label>
          <label class="flex items-center gap-2">
            <input
              type="radio"
              v-model="search.type_id"
              value="3"
              @change.prevent="searchInput()"
            />
            Butchery
          </label>
        </div>

        <!-- Out of Stock Items Section -->
        <div class="bg-white rounded-lg w-full py-0 px-3">
          <ul class="divide-y divide-gray-200">
            <li
              v-for="item in data.ingredients"
              v-if="data.ingredients?.length > 0 && !loading"
              :key="item.id"
              class="flex justify-between items-center py-3 hover:bg-yellow-50 cursor-pointer"
            >
              <div class="block">
                <span class="font-semibold uppercase text-gray-800"
                  >{{ item.name }}
                  <sup class="text-blue-500">{{ item.ingredientTypeAbbre }}</sup></span
                >
                <br />
                <span
                  class="bg-blue-500 rounded-full text-center px-1 py-1 text-xs text-white max-w-[200px] break-words inline-block"
                  >{{ item.ingredientCategoryName ?? "-" }}</span
                >
              </div>
              <div class="flex flex-col justify-end">
                <span
                  :class="item.stocks <= 0 ? 'text-red-600' : 'text-yellow-600'"
                  class="font-semibold text-end"
                >
                  {{ item.stocks <= 0 ? "Out of Stock" : "Below Stock Limit" }}
                </span>
                <b class="text-gray-500"
                  >Stocks: {{ item.stocks }}
                  <sub class="lowercase">{{ item.unitAbbre ?? "-" }}</sub></b
                >
              </div>
            </li>
          </ul>
          <p
            v-if="data?.length === 0 && !loading"
            class="text-green-500 mt-2 flex justify-center"
          >
            All items are in stock!
          </p>
          <div v-if="loading" class="flex justify-center items-center h-32">
            <Loader />
          </div>
        </div>

        <!-- Pagination Section -->
        <div class="flex w-full overflow-auto mt-4">
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
import { onMounted, ref, computed } from "vue";
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
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  barcodeConverter,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";

//actions
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
  type_id: 0,
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listOutOfStocks();
  handlePagination(1);
}, 500);
const listOutOfStocks = async () => {
  try {
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/out-of-stocks-list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    data.value = [];
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listOutOfStocks();
};
const handleTransaction = (transaction_id) => {
  listOutOfStocks();
};
const categoryDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}ingredient-categories/dropdown`,
      BearToken(token)
    );
    categories.value = response.data.ingredientCategories;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};
const sectionTitle = computed(() => {
  const type = Number(search.value.type_id);
  switch (type) {
    case 1:
      return "Low Stock Ingredients";
    case 2:
      return "Low Stock Production Items";
    case 3:
      return "Low Stock Butchery Items";
    default:
      return "Low Stock Items";
  }
});

// Call listOutOfStocks when component is mounted
onMounted(() => {
  categoryDropdown();
  listOutOfStocks();
});
</script>
