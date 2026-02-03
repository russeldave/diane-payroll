<template>
  <div v-if="hasPermission('Can_See_Out_Of_Stock')">
    <div class="p-4 lg:p-8 bg-white rounded-lg shadow-md">
      <!-- Search and Category Filter Section -->
      <h2 class="text-2xl font-semibold mb-4">{{ sectionTitle }}</h2>
      <div class="flex flex-col lg:flex-row lg:justify-between mb-4">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="searchInput()"
          placeholder="Search Item..."
          class="shadow shadow-gray-700 flex w-full focus-visible:bg-yellow-100 lg:w-1/4 font-bold text-xs py-2 px-4 rounded-lg mb-4 lg:mb-0"
        />
        <select
          @change.prevent="searchInput()"
          class="hover:opacity-70 text-black font-bold text-xs w-full lg:w-1/4 lg:text-sm py-2 rounded px-4 mb-4 lg:mb-0 border-2 border-black"
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
      <div class="flex items-center mb-2">
        <label class="mr-4 font-bold">Search Type:</label>
        <label class="mr-4">
          <input
            type="radio"
            v-model="search.type_id"
            value="0"
            @change.prevent="searchInput()"
            class="mr-2"
          />
          All
        </label>
        <label class="mr-4">
          <input
            type="radio"
            v-model="search.type_id"
            value="1"
            @change.prevent="searchInput()"
            class="mr-2"
          />
          Ingredients
        </label>
        <label class="mr-4">
          <input
            type="radio"
            v-model="search.type_id"
            value="2"
            @change.prevent="searchInput()"
            class="mr-2"
          />
          Production
        </label>
        <label>
          <input
            type="radio"
            v-model="search.type_id"
            value="3"
            @change.prevent="searchInput()"
            class="mr-2"
          />
          Butchery
        </label>
      </div>

      <!-- Out of Stock Items Section (Filling Parent Div) -->
      <div class="flex flex-col lg:flex-row justify-between items-start mb-6 rounded-lg">
        <div class="out-of-stock-items py-6 bg-white rounded-lg w-full lg:w-full flex-1">
          <ul class="space-y-2 overflow-y-hidden">
            <li
              v-for="item in data.ingredients"
              v-if="data.ingredients?.length > 0 && !loading"
              :key="item.id"
              class="flex justify-between items-center text-gray-700"
            >
              <div class="flex flex-col">
                <span class="font-medium">{{ item.name }}</span>
                <span class="text-xs text-gray-500"
                  >Stocks: {{ item.stocks }} <sub>{{ item.unitAbbre ?? "-" }}</sub></span
                >
              </div>
              <span
                :class="item.stocks <= 0 ? 'text-red-500' : 'text-yellow-600'"
                class="font-semibold"
              >
                {{ item.stocks <= 0 ? "Out of Stock" : "Below Stock Limit" }}
              </span>
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
      </div>

      <!-- Pagination Section -->
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
