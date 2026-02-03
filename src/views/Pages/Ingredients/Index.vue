<template>
  <div v-if="hasPermission('Navigation_Ingredients_List')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Ingredients'" /> -->
      <h1 class="text-sm lg:text-2xl font-bold my-0 py-0">Ingredients Management</h1>
      <div class="flex flex-col lg:flex-row w-full justify-between">
        <div class="flex flex-col justify-start items-center space-x-2">
          <div class="flex w-full items-start justify-center ">
            <input
              type="search"
              v-model="search.search"
              @input.prevent="searchInput()"
              placeholder="Search Ingredients..."
              class="shadow shadow-gray-700 w-full focus-visible:bg-yellow-100 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
            />
            <button
              class="flex flex-row font-bold text-white rounded-r-md p-2 hover:scale-110"
              :class="search.is_full_text_search === 1 ? 'bg-blue-500' : 'bg-gray-300'"
              @click.prevent="search.is_full_text_search = search.is_full_text_search === 1 ? 0 : 1"
              >
              Text
            </button>
          </div>
          <div class="flex flex-row gap-2 ">
            <select
              @change.prevent="searchInput()"
              class="shadow shadow-gray-700 flex w-full font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
              v-model="search.category_id"
              >
              <option value="0">All Category</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
            <select
              @change.prevent="searchInput()"
              class="shadow shadow-gray-700 flex w-full font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
              v-model="search.type_id"
              >
              <option :value="0">All Types</option>
              <option
                :key=1
                :value=1
                >
                Ingredients
              </option>
              <option
                :key=2
                :value=2
              >
                Production
              </option>
              <option
                :key=3
                :value=3  
              >
              Butchery
              </option>
              <option
                :key=4
                :value=4 
                >
                Unpack
              </option>
            </select>
              <select
              @change.prevent="searchInput()"
              class="shadow shadow-gray-700 flex w-full font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
              v-model="search.stat_id"
              >
              <option :value="0">All Status</option>
                <option
                  :key=1
                  :value=1
                >
                  Out of Stock
                </option>
                <option
                  :key=2
                  :value=2
                >
                  Expired
                </option>
                <option
                  :key=3
                  :value=3  
                >
                Low Stocks
                </option>
                <option
                  :key=4
                  :value=4  
                >
                Available
                </option>
            </select>
            <label class="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                v-model="search.is_show_deleted"
                @change.prevent="searchInput()"
                class="form-checkbox"
              />
              <span class="font-bold text-red-500 text-sm md:text-md text-nowrap"
                >Show Deleted</span
              >
            </label>
          </div>
        </div>
        <div class="flex flex-row flex-nowrap items-end overflow-auto space-x-2 ml-4">
          <BulkEdit
            :ingredient_ids="ingredient_ids"
            @transaction_id="handleTransaction"
            @clear-ingredient-ids="clearIngredientIds"
          />
          <!-- :href="`${ING_DOWNLOAD_LINK}/${search.category_id}/${search.sort_by}/${search.sort_type}`" -->
          <a
            :href="`${ING_DOWNLOAD_LINK}/${search.category_id}/${search.warehouse_id}`"
            @click.prevnet="
              console.log(
                `${ING_DOWNLOAD_LINK}/${search.category_id}/${search.category_id}/${search.warehouse_id}`
              )
            "
            target="_blank"
            class="bg-purple-500 ml-2 text-white hover:opacity-70 focus:bg-purple-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
          >
            <i class="fas fa-download"></i>
            &nbsp; Download List
          </a>
          <!-- <StockCardReport
            v-if="hasPermission('Stock_Card_Report_Button')"
            @transaction_id="handleTransaction"
          /> -->
          <IngredientMenuHistory />
          <IngredientProductionHistory />
          <UploadIngredients
            v-if="hasPermission('Upload_Ingredients_Button')"
            @transaction_id="handleTransaction"
          />
          <!-- <UploadMenu
            v-if="hasPermission('Upload_Utak_Inventory_Button')"
            @transaction_id="handleTransaction"
          /> -->
          <UploadPhysicalCount v-if="hasPermission('Upload_Physical_Count_Button')" />
          <Add
            v-if="hasPermission('Add_Ingredient_Button')"
            @transaction_id="handleTransaction"
          />
        </div>
      </div>
      <div class="flex w-full overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="text-white shadow" :class="DEFAULT_BG">
            <!-- table headers -->
            <tr class="border-b-2 text-xs md:text-sm border-solid border-yellow-500">
              <th
                scope="col"
                class="px-2 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider w-10"
              >
                Select
              </th>
              <th
                class="px-2 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('id')"
              >
                ID #
                <i :class="getSortIcon('id')" class="ml-1"></i>
              </th>
              <th
                class="px-2 py-2 border text-right cursor-pointer"
                @click="handleSort('stocks')"
              >
                <div class="w-[80px] ">
                  Stocks
                  <i :class="getSortIcon('stocks')" class="ml-1"></i>
                </div>
              </th>
              <th
                class="px-2 py-2 border text-left cursor-pointer"
                @click="handleSort('name')"
              >
                <div class="w-[5rem]">
                  Name
                  <i :class="getSortIcon('name')" class="ml-1"></i>
                </div>
              </th>
              <th class="px-2 py-2 border text-left">Category</th>
              <th class="px-2 py-2 border text-left">Warehouse</th>
              <th class="px-2 py-2 border text-left">Expiration</th>
              <th class="px-2 py-2 border text-left">Zoho ID</th>
              <th
                class="px-2 py-2 border text-right cursor-pointer"
                @click="handleSort('costPrice')"
              >
              <div class="w-[90px] ">
                Cost Price
                <i :class="getSortIcon('costPrice')" class="ml-1"></i>
              </div>
              </th>
              <!-- <th
                class="px-2 py-2 border text-right cursor-pointer"
                @click="handleSort('stocks')"
              >
                <div class="w-[80px] ">
                  Stocks
                  <i :class="getSortIcon('stocks')" class="ml-1"></i>
                </div>
              </th> -->
              <th class="px-2 py-2 border text-center">Amount</th>
              <th class="px-2 py-2 border text-center">Status</th>
              <th class="px-2 py-2 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
      <template v-for="ing in data.ingredients" :key="ing.id">
          <!-- Main Row (Parent Ingredient) -->
          <tr
            class="bg-blue-100 hover:bg-blue-200 cursor-pointer font-bold"
            :class="{ 'bg-rose-300': ing.itemStatus === 7 }"
            @click="toggleExpand(ing.id)"
            :title="`Click to expand for actions`"
          >
            <td class="px-2 py-2 border text-center align-middle" @click.stop>
                <input
                  type="checkbox"
                  :checked="isIngredientChecked(ing.ingredientIdNumber)"
                  @change="
                    (e) =>
                      toggleIngredientSelection(
                        ing.ingredientIdNumber,
                        e.target.checked
                      )
                  "
                />
            </td>
            <td class="px-2 py-2 text-center border-l-4 border-blue-100">
              <div class="flex flex-nowrap items-center justify-between">
       <button
          type="button"
          :class="[
            'bg-transparent text-black hover:opacity-90 rounded font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap',
            className,
          ]"
          @click.stop="toggleExpand(ing.id)"
        >
          <i
            :class="
              (ing.childIngredients && ing.childIngredients.length && expanded[ing.id])
                ? 'fas fa-chevron-down'
                : 'fas fa-chevron-right'
            "
            class="text-black fa"
          ></i>
        </button>
                {{ ing.ingredientIdNumber ?? "-" }}
              </div>
            </td>
            <td class="px-2 py-2 border text-right">
              {{ formatNumberWithCommas(ing.stocks ?? 0) }}
              <sub class="text-red-600">{{ ing.unitAbbre ?? "-" }}</sub>
            </td>
            <td
              class="px-2 py-2 border capitalize"
              :title="`Inputted by : ${ing.userName ?? ''}`"
            >
              <div class="flex w-[13rem]">
                <div class="flex flex-row flex-wrap">
                  <ViewDetails
                    :data="ing"
                    :id="ing.ingredientIdNumber"
                    :title="`${ing.itemName}`"
                    :type="ing.ingredientTypeAbbre"
                  />  
                  <!-- <span class="italic">
                    <p class="text-red-500">[{{ing.unitAbbre }}]</p>
                  </span> -->
                </div>
                <sup class="text-blue-500 font-extrabold text-sm ml-2 font-mono">{{
                  ing.ingredientTypeAbbre ?? "-"
                }}</sup>
                <sup
                  v-if="ing.isAllowToReceiving == 1"
                  class="text-red-500 font-extrabold text-sm font-mono"
                >
                  R
                </sup>
                <sup
                  v-if="ing.isUnpack == 1"
                  class="text-green-600 font-extrabold text-sm font-mono"
                >
                  U
                </sup>
              </div>
            </td>
            <td class="px-2 py-2 border uppercase">
              {{ ing.ingredientCategoryName }}
            </td>
            <td class="px-2 py-2 border uppercase">
              {{ ing.warehouseName ?? "-" }}
            </td>
            <td class="px-2 py-2 border text-right">{{ing.expirationDate}}</td>
            <td class="px-2 py-2 border text-right">{{ing.zohoItemId}}</td>
            <td class="px-2 py-2 border text-right">{{ ing.costPrice ?? 0 }}</td>
            <!-- <td class="px-2 py-2 border text-right">
              {{ formatNumberWithCommas(ing.stocks ?? 0) }}
              <sub class="text-red-600">{{ ing.unitAbbre ?? "-" }}</sub>
            </td> -->
            <td class="px-2 py-2 border">
              <div class="flex justify-center items-center">
                <span
                  class="inline-block px-2 py-2 rounded-full text-md font-bold text-center text-nowrap"
                  >
                  ₱{{ totalCostAmount(ing) }}
                </span>
              </div>
            </td>
            <td class="px-2 py-2 border">
              <div class="flex justify-center items-center">
                <span
                  class="inline-block px-2 py-2 rounded-full text-md font-bold text-center text-nowrap"
                  :class="{
                    'bg-red-500 text-white': ing.statusName === 'Out of Stock',
                    'bg-green-500 text-white': ing.statusName === 'Available',
                    'bg-amber-500 text-white': ing.statusName === 'Expired',
                    'bg-amber-500 text-white': ing.statusName === 'Expired & Low Stock',
                  }"
                  >
                  {{ ing.statusName || "N/A" }}
                </span>
              </div>
            </td>
            <td class="px-2 py-2 border text-center">
              <div class="flex justify-center text-nowrap">     
                <OverrideSku   
                  v-if="hasPermission('Override_Ingredient_Sku')"
                    :data="ing"
                    :key="ing.id"
                    @transaction_id="handleTransaction"
                />
                <AssignConversions 
                  :data="ing"
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <History   
                  :data="ing"
                />
                <AssignWarehouse
                  v-if="hasPermission('Assign_Ingredient_Warehouse_Button')"
                  :data="ing"
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <Menus
                  v-if="hasPermission('Ingredient_Menus')"
                  :data="ing  "
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <Unpacks
                  v-if="hasPermission('Ingredient_Unpacks')"
                  :data="ing  "
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <Scrap
                  v-if="hasPermission('Scrap_Ingredient_Button')"
                  :data="ing"
                  @transaction_id="handleTransaction"
                />
                <ImagesButton
                  v-if="hasPermission('Edit_Images_Button')"
                  :data="ing"
                  :unpack="true"
                  :ingredient_id_number="ing.ingredientIdNumber"
                  @transaction_id="handleTransaction"
                />
                <Edit
                  v-if="hasPermission('Edit_Ingredient_Button')"
                  :data="ing"
                  :unpack="true"
                  @transaction_id="handleTransaction"
                />
                <Duplicate
                  v-if="hasPermission('Duplicate_Ingredient_Button')"
                  :data="ing"
                  :unpack="true"
                  @transaction_id="handleTransaction"
                />
                <Delete
                  v-if="hasPermission('Delete_Ingredient_Button')"
                  :data="ing"
                  @transaction_id="handleTransaction"
                />
                <template v-if="hasPermission('Items_Delete_Button') && ing.itemStatus !== 7">
                  <SoftDelete
                    :disabled="ing.itemStatus === 7"
                    v-if="hasPermission('Items_Delete_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                </template>
                <template v-if="hasPermission('Items_Delete_Button') && ing.itemStatus === 7">
                  <Restore
                    :disabled="ing.itemStatus !== 7"
                    v-if="hasPermission('Items_Delete_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                </template>
              </div>
            </td>
          </tr>

          <!-- Collapsible Child Ingredients Row -->
          <tr
            v-for="child in ing.childIngredients"
            :key="child.id"
            v-show="expanded[ing.id]"       
            class="bg-white hover:bg-gray-100 font-normal border-l-4 border-dashed border-blue-200"
          >
            <!-- Select Checkbox -->
            <td class="px-2 py-2 border text-center align-middle" @click.stop>
              <input
                type="checkbox"
                :checked="isIngredientChecked(child.id, true)"
                @change="(e) => toggleIngredientSelection(child.id, e.target.checked, true)"
              />
            </td>

            <!-- ID # (indented + arrow) -->
            <td class="px-2 py-2 text-right border">
              <div class="flex items-center space-x-2">
                <!-- Tree connector arrow -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-orange-500"
                  fill="none"
                  viewBox="0 0 40 24"
                  stroke="currentColor"
                >
                  <path
                    d="M6 4v8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    stroke-dasharray="4 2"
                  />
                  <path
                    d="M6 12h28"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    stroke-dasharray="4 2"
                  />
                  <path d="M34 9 L34 15 L40 12 Z" fill="currentColor" />
                </svg>
                <span>{{ child.ingredientIdNumber ?? "-" }}</span>
              </div>
            </td>

            <!-- Stocks -->
            <td class="px-2 py-2 border text-right">
              {{ formatNumberWithCommas(child.stocks ?? 0) }}
              <sub class="text-red-600">{{ child.unitAbbre ?? "-" }}</sub>
            </td>

            <!-- Name -->
            <td
              class="px-2 py-2 border capitalize"
              :title="`Inputted by : ${child.userName ?? ''}`"
            >
              <div class="flex">
                <ViewDetails
                  :data="child"
                  :id="child.id"
                  :title="`${child.itemName || ing.ingredientFullName}`"
                  :type="child.ingredientTypeAbbre"
                />
                <!-- <span class="italic">
                  <p class="text-red-500">[{{child.unitAbbre }}] </p>
                </span> -->
                <sup class="text-blue-500 font-extrabold text-xs font-mono">
                  {{ child.ingredientTypeAbbre ?? "-" }}
                </sup>
                <sup
                  v-if="child.isAllowToReceiving == 1"
                  class="text-red-500 font-extrabold text-sm font-mono"
                >
                  R
                </sup>
              </div>
            </td>

            <!-- Category -->
            <td class="px-2 py-2 border uppercase">
              {{ child.ingredientCategoryName ?? "-" }}
            </td>

            <!-- Warehouse -->
            <td class="px-2 py-2 border uppercase">
              {{ child.ingredientSubcategoryName ?? "-" }}
            </td>

            <!-- Expiration Date -->
            <td class="px-2 py-2 border text-right">
              {{child.expirationDate}}
            </td>

            <td class="px-2 py-2 border text-right">{{child.zohoItemId ?? ''}}</td>

            <!-- Cost Price -->
            <td class="px-2 py-2 border text-right">
              {{ child.costPrice ?? 0 }}
            </td>

            <!-- Amount -->
            <td class="px-2 py-2 border text-right">
            </td>

            <!-- Status -->
            <td class="px-2 py-2 border text-center">
              <span
                class="inline-block px-2 py-1 rounded-full text-xs font-bold"
                :class="{
                  'text-red-500': child.stockStatusName === 'Out of Stock',
                  'bg-yellow-100 text-yellow-800': child.stockStatusId === 2,
                  'bg-red-100 text-red-800': child.stockStatusId === 3,
                  'bg-orange-100 text-orange-800': child.stockStatusId === 4,
                }"
              >
                {{ child.stockStatusName || "N/A" }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-2 py-2 border text-center">
              <div class="flex justify-center space-x-1">
              <!-- <OverrideSku
                v-if="hasPermission('Override_Sku')"
                :key="ingredientForm.sku"
                :ingredient_id="ingredientForm.ingredient_id_number"
                :sku="ingredientForm.sku"
              /> -->
                <AssignConversions 
                  :data="child"
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <AssignWarehouse
                  v-if="hasPermission('Assign_Ingredient_Warehouse_Button')"
                  :data="child"
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <Menus
                  v-if="hasPermission('Ingredient_Menus')"
                  :data="child"
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <Unpacks
                  v-if="hasPermission('Ingredient_Unpacks')"
                  :data="child"
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <Scrap
                  v-if="hasPermission('Scrap_Ingredient_Button')"
                  :data="child"
                  @transaction_id="handleTransaction"
                />
                <Edit
                  v-if="hasPermission('Edit_Ingredient_Button')"
                  :data="child"
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <Duplicate
                  v-if="hasPermission('Duplicate_Ingredient_Button')"
                  :data="child"
                  :unpack="false"
                  @transaction_id="handleTransaction"
                />
                <Delete
                  v-if="hasPermission('Delete_Ingredient_Button')"
                  :data="child"
                  @transaction_id="handleTransaction"
                />
                <SoftDelete
                  v-if="hasPermission('Items_Delete_Button') && child.itemStatus !== 7"
                  :data="child"
                  @transaction_id="handleTransaction"
                />
                <Restore
                  v-if="hasPermission('Items_Delete_Button') && child.itemStatus === 7"
                  :data="child"
                  @transaction_id="handleTransaction"
                />
              </div>
            </td>
          </tr>

        </template>

            <tr v-if="loading">
              <td colspan="8" class="px-2 py-2 text-center text-red-500 font-bold">
                <Loader />
              </td>
            </tr>
            <tr v-if="!loading && data.totalrows === 0">
              <td colspan="8" class="px-2 py-2 text-center text-red-500 font-bold">
                ***No Ingredients found***
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
  <div v-else>
    <Error403 />
  </div>
</template>
<script setup>
  import { onMounted, ref, reactive } from "vue";
  import Swal from "sweetalert2";
  import axios from "axios";
  import Paginator from "@/views/Component/Pagination.vue";
  import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
  import Error403 from "@/views/Error/403.vue";
  import Loader from "@/views/Component/Loader.vue";
  import { VUE_APP_API_URL, DEFAULT_BG, ING_DOWNLOAD_LINK } from "@/views/Utility/Global";
  import {
    FormDx,
    BearToken,
    handleApiError,
    formatNumberWithCommas,
    useDebounce,
    Alert,
  } from "@/views/Utility/Helper";
  import { hasPermission } from "@/views/Utility/Permissions";

  //actions
  import Add from "./Actions/Add.vue";
  import AddToMenu from "./Actions/AddToMenu.vue"; 
  import Edit from "./Actions/Edit.vue";
  import ImagesButton from "./Actions/ImagesButton.vue";
  import View from "./Actions/View.vue";
  import Duplicate from "./Actions/Duplicate.vue";
  import StockCardReport from "./Actions/StockCardReport.vue";
  import Unpack from "./Actions/Unpack.vue";
  import IngredientMenuHistory from "./Actions/IngredientMenuHistory.vue";
  import IngredientProductionHistory from "./Actions/IngredientProductionHistory.vue";
  import UploadIngredients from "./Actions/UploadIngredient.vue";
  import UploadMenu from "./Actions/UploadMenu.vue";
  import Scrap from "./Actions/Scrap.vue";
  import Delete from "./Actions/Delete.vue";
  import AssignConversions from "@/views/Pages/Ingredients/Actions/AssignConversions.vue";
  import ViewDetails from "../Ingredients/Actions/ViewDetails.vue";
  import SoftDelete from "./Actions/SoftDelete.vue";
  import Restore from "./Actions/Restore.vue";
  import IngImageViewer from "./Actions/IngImageViewer.vue";
  import IngredientImage from "./Actions/IngredientImage.vue";
  import AssignWarehouse from "../Ingredients/Actions/AssignWarehouse.vue"; 
  import Menus from "../Ingredients/Actions/Menus.vue";
  import Unpacks from "../Ingredients/Actions/Unpacks.vue";
  import Location from "../Ingredients/Actions/Location.vue";
  import BulkEdit from "../Ingredients/Actions/BulkEdit.vue";
  import UploadPhysicalCount from "@/views/Pages/PhysicalCountReport/Actions/UploadPhysicalCount.vue";
  import History from "./Actions/History.vue";
  import OverrideSku from "@/views/Pages/Transactions/Tabs/Direct/DirectReceivingItems/Actions/OverrideSku.vue";

  const token = localStorage.getItem("token");
  const loading = ref(false);
  const className =
    "bg-white text-black hover:opacity-70 rounded font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap";
  const categories = ref([]);
  const sub_categories = ref([]);
  const ingredient_ids = ref([]);
  const data = ref({ ingredients: [], totalrows: 0 });
  const textToCopy = ref("")
  const search = ref({
    search: "",
    page_num: 1,
    stat_id: 0,
    itemsperpage: 10,
    category_id: 0,
    type_id:0,
    sub_category_id: 0,
    sort_by: "id",
    sort_type: "ASC",
    is_show_deleted: false,
    warehouse_id: 0,
    is_full_text_search: 0
  });

  // Track which rows are expanded
  const expanded = reactive({});

  // Add a flag to prevent duplicate calls
  let isFetching = false;

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    expanded[id] = !expanded[id];
  };

  const searchInput = useDebounce(async () => {
    search.value.page_num = 1;
    search.value.is_show_deleted = search.value.is_show_deleted ? 1 : 0;
    await listIngredients();
  }, 500);

  const handleTransaction = (transaction_id) => {
    listIngredients();
  };

  // Fetch list of ingredients
  const listIngredients = async () => {
    // Prevent duplicate calls
    if (isFetching) {
      console.log('listIngredients already in progress, skipping...');
      return;
    }
    
    try {
      isFetching = true;
      loading.value = true;
      
      const formData = FormDx(search.value);
      const response = await axios.post(
        `${VUE_APP_API_URL}ingredients/list`,
        formData,
        BearToken(token)
      );
      data.value = response.data;

      // Convert ingredients object to array and reset expanded state
      Object.keys(expanded).forEach((key) => delete expanded[key]);
      const ingredientsArray = Object.values(response.data.ingredients || {});
      ingredientsArray.forEach((ing) => {
        if (ing.id) {
          expanded[ing.id] = true;
        }
      });
    } catch (err) {
      handleApiError(err);
    } finally {
      loading.value = false;
      isFetching = false;
    }
  };

  // Pagination handler
  const handlePagination = (page_num) => {
    search.value.page_num = page_num;
    listIngredients();
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

  const ingredientsSubCategoryDropdown = async () => {
    try {
      const response = await axios.post(
        `${VUE_APP_API_URL}ingredient-sub-categories/dropdown`,
        { id: 0 },
        BearToken(token)
      );
      sub_categories.value = response.data.subCategories;
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
    listIngredients();
  };

  const getSortIcon = (column) => {
    if (search.value.sort_by !== column) {
      return "fas fa-arrows-up-down text-white";
    }
    return search.value.sort_type === "ASC"
      ? "fas fa-arrow-up text-white"
      : "fas fa-arrow-down text-white";
  };

  const isIngredientChecked = (id) => {
    return ingredient_ids.value.includes(id);
  };

  const toggleIngredientSelection = (id, checked) => {
    if (checked) {
      if (!ingredient_ids.value.includes(id)) ingredient_ids.value?.push(id);
    } else {
      ingredient_ids.value = ingredient_ids.value?.filter((x) => x !== id);
    }
  };

  const clearIngredientIds = () => {
    ingredient_ids.value = [];
  };

  const getUser = () => {
    const data = localStorage.getItem('user');
    const parsedData = JSON.parse(data);
    search.value.user_id = parsedData[0].id;
  };

  const getWare = () => {
    const data = localStorage.getItem('warehouse_id');
    search.value.warehouse_id = data;
  };

  const totalCostAmount = (item) => {
      // Ensure numeric values, default to 0
      const stocks = Number(item.stocks ?? 0);
      const costPrice = Number(item.costPrice ?? 0);
      // Return formatted total or fallback
      return isNaN(stocks) || isNaN(costPrice)
        ? '0.00'
        : (stocks * costPrice).toFixed(2);
    };

  // Initialize component
  const initializeComponent = async () => {
    await ingredientsCategoryDropdown();
    await getUser();
    await getWare();
    await listIngredients();
  };

  // Run on mount
  onMounted(() => {
    initializeComponent();
  });

</script>

<style scoped>
.pagination-button {
  @apply flex items-center justify-center px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors;
}

</style>
