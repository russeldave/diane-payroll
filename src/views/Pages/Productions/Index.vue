<template>
  <div v-if="hasPermission('Navigation_Productions_List')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Productions'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1">Productions</h1>
      <div class="flex flex-col lg:flex-row lg:justify-between mb-4">
        <div class="block lg:flex justify-start items-center space-x-2">
          <input
            type="search"
            v-model="search.search"
            @input="searchInput()"
            placeholder="Search  Productions..."
            class="shadow shadow-gray-700 flex w-full font-bold focus-visible:bg-yellow-100 text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
          />
          <select
            @change="searchInput()"
            class="hover:opacity-70 shadow shadow-gray-700 text-black font-bold text-sm md:text-md w-full py-2 rounded px-4 mb-4 float-end text-nowrap"
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
          <ProductionReport
            v-if="hasPermission('Production_Report_Button')"
            @transaction_id="handleTransaction"
          />
          <a 
            :href="`${VUE_APP_API_URL}variance-download-excel/download-productions-with-ingredients`"
              @click.prevnet="
                console.log(
                  `${VUE_APP_API_URL}variance-download-excel/download-productions-with-ingredients`
                )
              "
            src=""
            target="_blank"
            class="rounded-md px-4 py-2 mb-4 text-white font-bold border border-2 border-green-600 bg-green-400 hover:bg-green-600">
            Download
          </a>
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
        <div class="flex justify-between items-center space-x-2 overflow-auto">
          <PrepareAll
            v-if="hasPermission('Prepare_All_Ingredient_Button')"
            @transaction_id="handleTransaction"
          />
          <Add
            v-if="hasPermission('Add_Production_Button')"
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
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('id')"
              >
                ID #
                <i :class="getSortIcon('id')" class="ml-1"></i>
              </th>
              <!-- <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Image
                </th> -->
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('name')"
              >
                Name
                <i :class="getSortIcon('name')" class="ml-1"></i>
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Warehouse
              </th>
              <th
                scope="col"
                @click="handleSort('stocks')"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Stocks
                <i :class="getSortIcon('stocks')" class="ml-1"></i>
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-wrap text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('retailPrice')"
                >
                <div class="w-20">
                  Retail Price
                  <i :class="getSortIcon('retailPrice')" class="ml-1"></i>
                </div>
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-wrap text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('costPrice')"
                >
                <div class="w-20">
                  Cost Per Unit
                  <i :class="getSortIcon('costPrice')" class="ml-1"></i>
                </div>
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Yeild
              </th>
              <th
                scope="col"
                width="5%"
                class="px-6 py-3 text-center text-wrap text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                Total Cost
              </th>
              <th
                scope="col"
                width="5%"
                class="px-6 py-3 text-center text-wrap text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                Ingredients
              </th>
              <!-- <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Description
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
              class="hover:bg-gray-200"
              v-if="data.ingredients?.length > 0"
              :title="`Updated by: ${ing.userName}`"
              :key="ing.id"
            >
              <td class="px-2 py-2 border text-center">
               <span class="font-bold">{{ ing.ingredientIdNumber ?? "-" }}</span>
              </td>
              <!-- <td class="px-2 py-2 border  flex justify-center items-center">
                  <div class="h-32 w-32">
                    <IngImageViewer v-if="ing.id" :key="ing.thumbNail" :ingredient_id="ing.id" :thumbnail="ing.thumbNail" :canDeleteImage="true"/>
                  </div>
                </td> -->
              <td class="px-2 py-2 border font-bold">
                <div class="w-[23rem]">
                  {{ ing.name }} 
                  <sub class="italic"> 
                    <span class="text-red-500"> [{{ing.unitAbbre }}]</span>
                  </sub> 
                </div>
              </td>
              <td class="px-2 py-2 border uppercase">{{ ing.ingredientCategoryName }}</td>
              <td class="px-2 py-2 border uppercase">{{ ing.warehouseName ?? "" }}</td>
              <td class="px-2 py-2 border text-left font-bold text-lg bg-[#7bed9f]">
                {{ formatNumberWithCommas(ing.stocks ?? 0) }}
                <sub class="text-red-500">{{ ing.unitAbbre ?? "-" }}</sub>
              </td>
              <td class="px-2 py-2 border text-center font-bold text-green-600 text-xl">{{ ing.retailPrice ?? 0 }}</td>
              <td class="px-2 py-2 border text-center font-bold text-red-600 text-xl">{{ ing.costPrice ?? 0 }}</td>
              <td class="px-2 py-2 border text-right">{{ ing.yeild ?? 0 }}</td>
              <td class="px-2 py-2 border text-center">{{ ing.grandTotal ?? 0 }}</td>
              <!-- <td class="px-2 py-2 border">{{ ing.description }}</td> -->
              <td class="px-2 py-2 border text-center">
                <div class="w-[25rem] italic">
                  {{ ing.subIngredients ?? '' }}
                </div>
              </td>
              <td class="px-2 py-2 border">
                <div class="flex justify-center text-nowrap">
                  <View
                    v-if="hasPermission('View_Ingredient_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                  <AssignWarehouse
                    v-if="hasPermission('Assign_Ingredient_Warehouse_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                  <Prepare
                    v-if="hasPermission('Prepare_Ingredient_Button') && ing.warehouseName?.length"
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
                  <Duplicate
                    v-if="hasPermission('Duplicate_Ingredient_Button')"
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
                ***No Production Ingredients found***
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
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL, 
  PERMISSION,
  BUILDING,
  CATEGORIES,
  DEFAULT_BG,
  MENU_DOWNLOAD_LINK,
  MENU_INGREDIENTS_DOWNLOAD_LINK,
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
import Loader from "@/views/Component/Loader.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
//actions
import Add from "./Actions/Add.vue";
import View from "./Actions/View.vue";
import Prepare from "./Actions/Prepare.vue";
import AssignWarehouse from"@/views/Pages/Ingredients/Actions/AssignWarehouse.vue"
import PrepareAll from "./Actions/PrepareAll.vue";
import Edit from "./Actions/Edit.vue";
import Delete from "./Actions/Delete.vue";
import Duplicate from "./Actions/Duplicate.vue";
import ProductionReport from "@/views/Pages/ProductionReport/Actions/ProductionReport.vue";
import MealImageViewer from "./Actions/MealImageViewer.vue";
import Scrap from "./Actions/Scrap.vue";

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
  sort_by: "id",
  sort_type: "ASC",
  is_show_deleted: false,
});

// Fixed searchInput - removed duplicate call
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  search.value.is_show_deleted = search.value.is_show_deleted ? 1 : 0;
  await listProductions();
}, 500);

const listProductions = async () => {
  // Prevent duplicate calls
  if (isFetching) {
    console.log('listProductions already in progress, skipping...');
    return;
  }
  
  try {
    isFetching = true;
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/production-list`,
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
  listProductions();
};

const handleTransaction = (transaction_id) => {
  listProductions();
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

// Add these new functions for sorting
const handleSort = (column) => {
  if (search.value.sort_by === column) {
    // Toggle sort direction if clicking the same column
    search.value.sort_type = search.value.sort_type === "ASC" ? "DESC" : "ASC";
  } else {
    // Set new column and default to ascending
    search.value.sort_by = column;
    search.value.sort_type = "ASC";
  }
  listProductions();
};

const getSortIcon = (column) => {
  if (search.value.sort_by !== column) {
    return "fas fa-arrows-up-down text-white";
  }
  return search.value.sort_type === "ASC"
    ? "fas fa-arrow-up text-white"
    : "fas fa-arrow-down text-white";
};

// Initialize component
const initializeComponent = async () => {
  await categoryDropdown();
  await listProductions();
};

// Call listProductions when component is mounted
onMounted(() => {
  initializeComponent();
});
</script>