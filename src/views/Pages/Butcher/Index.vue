<template>
  <div v-if="hasPermission('Navigation_Butcher_List')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Butchery'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1">Butchery</h1>
      <div class="flex flex-col lg:flex-row lg:justify-between mb-4">
        <div class="block lg:flex space-x-2">
          <input
            type="search"
            v-model="search.search"
            @input="searchInput()"
            placeholder="Search Butchery..."
            class="shadow shadow-gray-700 flex w-full focus-visible:bg-yellow-100 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
          />
          <select
            @change="searchInput()"
            class="shadow shadow-gray-700 flex w-full font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
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
          <ButcherReport
            v-if="hasPermission('Butchery_Report_Button')"
            @transaction_id="handleTransaction"
          />
          <label class="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              v-model="search.is_show_deleted"
              @change="searchInput()"
              class="form-checkbox"
            />
            <span class="font-bold text-red-500 text-sm md:text-md text-nowrap"
              >Show Deleted</span
            >
          </label>
        </div>
        <div class="flex space-x-2 overflow-auto">
          <Add
            v-if="hasPermission('Add_Ingredient_Button')"
            @transaction_id="handleTransaction"
          />
        </div>
      </div>

      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <!-- <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                ID #
              </th> -->
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Warehouse
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Raw Ingredient
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase text-wrap border tracking-wider"
              >
                Raw Stocks
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Butcher Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase text-wrap border tracking-wider"
              >
                Butcher Stocks
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Trimming Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase text-wrap border tracking-wider"
              >
                Trimming Stocks
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Cost Price
              </th>
              <!-- <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Yeild
              </th> -->
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
            <!-- Loop through products and display them -->
            <tr
              v-for="ing in data.ingredients"
              class="hover:bg-gray-200 font-normal"
              v-if="data.ingredients?.length > 0"
              :title="`Updated by: ${ing.userName}`"
              :key="ing.id"
            >
              <!-- <td class="px-2 py-2 border text-left text-nowrap">
                {{ ing.ingredientIdNumber ?? "-" }}
              </td> -->
              <!-- <td class="px-2 py-2 border  flex justify-center items-center">
                <div class="h-32 w-32">
                  <IngImageViewer v-if="ing.id" :key="ing.thumbNail" :ingredient_id="ing.id" :thumbnail="ing.thumbNail" :canDeleteImage="true"/>
                </div>
              </td> -->
              <td class="px-2 py-3 border first-letter:capitalize lowercase">
                {{ ing.warehouseName ?? "none" }}
              </td>
              <td class="px-2 py-3 border first-letter:capitalize lowercase">
                <span class="font-bold">{{ ing.ingredientRawName}}</span>
                 <!-- <span>{{ ing. }}</span> -->
              <!-- <sub class="text-red-500">[{{  ing.unitAbbre ?? "-" }}]</sub> -->
              </td>
              <td class="px-2 py-3 border text-center">
                {{ formatNumberWithCommas(ing.rawStocks ?? 0) }}
                <sub class="text-red-500">{{ ing.unitAbbre ?? "-" }}</sub>
              </td>
              <td class="px-2 py-3 border first-letter:capitalize lowercase bg-green-100">
                <span class="italic">{{ing.ingredientIdNumber}}</span> -
                <span class="font-bold">{{ ing.ingredientFullName }}</span>
              </td>
              <td class="px-2 py-3 border text-center bg-green-100">
                {{ formatNumberWithCommas(ing.stocks ?? 0) }}
                <sub class="text-red-500">{{ ing.unitAbbre ?? "-" }}</sub>
              </td>
              <td
                class="px-2 py-3 border first-letter:capitalize lowercase bg-orange-100"
              >
                {{ ing.ingredientTrimmingName ?? "-" }} 
                <!-- <sub class="text-red-500">[{{ ing.unitAbbre ?? "-" }}]</sub> -->
              </td>
              <td class="px-2 py-3 border text-center bg-orange-100">
                {{ formatNumberWithCommas(ing.trimmingStocks ?? 0) }}
                <sub class="text-red-500">{{ ing.unitAbbre ?? "-" }}</sub>
              </td>
              <td class="px-2 py-3 border text-right">{{ ing.costPrice ?? 0 }}</td>
              <!-- <td class="px-2 py-3 border">{{ ing.yeild ?? 0 }}</td> -->
              <td class="px-2 py-3 border">
                <div class="flex justify-center text-nowrap">
                  <!-- <View v-if="hasPermission('View_Ingredient_Button')" :data="ing" @transaction_id="handleTransaction" /> -->
                  <Cut
                    v-if="hasPermission('Cut_Ingredient_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                  <Scrap
                    v-if="hasPermission('Scrap_Ingredient_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                  <Edit
                    v-if="hasPermission('Edit_Ingredient_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                  <Delete
                    v-if="hasPermission('Delete_Ingredient_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                </div>
              </td>
            </tr>
            <tr v-if="loading == true">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="9">
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="9">
                ***No Butchery found***
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
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  barcodeConverter,
  useDebounce,
  handleApiError,
  formatNumberWithCommas,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

//actions
import Add from "./Actions/Add.vue";
import Cut from "./Actions/Cut.vue";
import View from "./Actions/View.vue";
import Edit from "./Actions/Edit.vue";
import ButcherReport from "@/views/Pages/ButcheryReport/Actions/ButcheryReport.vue";
import Delete from "./Actions/Delete.vue";
import Scrap from "./Actions/Scrap.vue";
import IngImageViewer from "./Actions/IngImageViewer.vue";

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const categories = ref([]);

// Add flag to prevent duplicate API calls
let isFetching = false;

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  category_id: 0,
  is_show_deleted: false,
});

// Fixed searchInput - removed duplicate call
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  search.value.is_show_deleted = search.value.is_show_deleted ? 1 : 0;
  await listBrands();
}, 500);

const listBrands = async () => {
  // Prevent duplicate calls
  if (isFetching) {
    console.log('listBrands already in progress, skipping...');
    return;
  }
  
  try {
    isFetching = true;
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/butcher-list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
    isFetching = false;
  }
};

const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listBrands();
};

const handleTransaction = (transaction_id) => {
  listBrands();
};

const ingredientsCategoryDropdown = async () => {
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

// Initialize component
const initializeComponent = async () => {
  await ingredientsCategoryDropdown();
  await listBrands();
};

// Call listBrands when component is mounted
onMounted(() => {
  initializeComponent();
});
</script>