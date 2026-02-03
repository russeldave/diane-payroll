<template>
  <div v-if="hasPermission('Navigation_Meals_List')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Menu'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1">Menu Management</h1>
      <div class="flex flex-col lg:flex-row lg:justify-between mb-4">
        <div class="block lg:flex justify-start items-center space-x-2">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Menu..."
            class="shadow shadow-gray-700 flex w-full font-bold focus-visible:bg-yellow-100 text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
          />
          <select
            @change.prevent="searchInput()"
            class="shadow shadow-gray-700 hover:opacity-70 text-black font-bold text-sm w-full md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
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
        <div
          class="flex justify-start md:justify-end items-center space-x-2 overflow-auto"
        >
          <MenuWarehouse
            :menu_ids="menu_ids"
            @transaction_id="handleTransaction"
            @clear-menu-ids="clearMenuIds"
          />
          <a
            :href="MENU_DOWNLOAD_LINK"
            type="button"
            class="bg-purple-500 text-white hover:opacity-70 focus:bg-purple-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
          >
            <i class="fas fa-download"></i>
            Download Menu List
          </a>
          <a
            :href="MENU_INGREDIENTS_DOWNLOAD_LINK"
            type="button"
            class="bg-purple-500 text-white hover:opacity-70 focus:bg-purple-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
          >
            <i class="fas fa-download"></i>
            Download Menu Ingredients List
          </a>
          <Add
            v-if="hasPermission('Add_Meal_Button')"
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
                class="px-2 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider w-10"
              >
                Select
              </th>
              <!-- <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Image
              </th> -->
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Warehouse
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Cost Price
              </th>
              <th
                scope="col"
                class="px-2 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Retail Price
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Ingredients
              </th>
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
              v-for="(m, mm) in data.menus"
              class="hover:bg-gray-200"
              :class="{ 'bg-rose-300': m.menuStatus === 7 }"
              v-if="data.menus?.length > 0"
              :title="`Updated by: ${m.userName ?? 'None'}`"
              :key="m.id"
            >
              <td class="px-2 py-2 border text-center align-middle">
                <input
                  type="checkbox"
                  :checked="isMenuChecked(m.id)"
                  @change="(e) => toggleMenuSelection(m.id, e.target.checked)"
                />
              </td>
              <!-- <td class="px-2 py-2 border">
                <div class="flex justify-center items-center h-32 w-32">
                  <MealImageViewer v-if="m.id" :key="m.thumbNail" :menu_id="m.id" :thumbnail="m.thumbNail" :canDeleteImage="true"/>
                </div>
              </td> -->
              <td class="px-2 py-2 border capitalize">
                <div class="w-[12rem] font-bold text-md">
                  <p>{{ m.title }}</p>
                </div>
                <!-- <label for="" class="bg-amber-600 text-nowrap uppercase text-xs rounded-full p-1 text-white">{{ m.totalIngredients }} Ingredients</label> -->
              </td>
              <td class="px-2 py-2 border uppercase">{{ m.menuCategoryName }}</td>
              <td class="px-2 py-2 border">{{ m.warehouseName ?? "None" }}</td>
              <td class="px-2 py-2 border text-center">{{ m.costPrice }}</td>
              <td class="px-2 py-2 border text-center text-green-700 font-bold bg-green-200">{{ m.retailPrice }}</td>
              <td class="px-2 py-2 border text-center">
                <div class="w-[25rem] italic">
                  {{ m.ingredients ?? '' }}
                </div>
              </td>
              <td class="px-2 py-2 border">
                <div class="flex justify-center">
                  <View
                    v-if="hasPermission('View_Meal_Button')"
                    :key="m.id"
                    :data="m"
                    @transaction_id="handleTransaction"
                  />
                  <!-- <Scrap
                    v-if="hasPermission('Scrap_Meal_Button')"
                    :key="m.id"
                    :data="m"
                    @transaction_id="handleTransaction"
                  /> -->
                  <Edit
                    v-if="hasPermission('Edit_Meal_Button')"
                    :key="m.id"
                    :data="m"
                    @transaction_id="handleTransaction"
                  />
                  <Duplicate
                    v-if="hasPermission('Duplicate_Meal_Button')"
                    :key="m.id"
                    :data="m"
                    @transaction_id="handleTransaction"
                  />
                  <template v-if="hasPermission('Items_Delete_Button') && m.menuStatus !== 7">
                  <SoftDelete
                    :disabled="m.menuStatus === 7"
                    v-if="hasPermission('Items_Delete_Button')"
                    :data="m"
                    @transaction_id="handleTransaction"
                  />
                </template>
                <template v-if="hasPermission('Items_Delete_Button') && m.menuStatus === 7">
                  <Restore
                    :disabled="m.menuStatus !== 7"
                    v-if="hasPermission('Items_Delete_Button')"
                    :data="m"
                    @transaction_id="handleTransaction"
                  />
                </template>
                  <Delete
                    v-if="hasPermission('Delete_Meal_Button')"
                    :key="m.id"
                    :data="m"
                    @transaction_id="handleTransaction"
                  />
                </div>
              </td>
            </tr>
            <tr v-if="loading == true">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="7">
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="7">
                ***No Menu found***
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
} from "@/views/Utility/Helper";
import Loader from "@/views/Component/Loader.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
//actions
import Add from "./Actions/Add.vue";
import View from "./Actions/View.vue";
import Edit from "./Actions/Edit.vue";
import Duplicate from "./Actions/Duplicate.vue";
import Delete from "./Actions/Delete.vue";
import MealImageViewer from "./Actions/MealImageViewer.vue";
import Scrap from "./Actions/Scrap.vue";
import MenuWarehouse from "./Actions/MenuWarehouse.vue";
import SoftDelete from "./Actions/SoftDelete.vue";
import Restore from "./Actions/Restore.vue";

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const categories = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  category_id: 0,
  is_show_deleted: false,
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  search.value.is_show_deleted = search.value.is_show_deleted ? 1 : 0;
  await listMeals();
  handlePagination(1);
}, 500);

const listMeals = async () => {
  try {
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menus/list`,
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
  listMeals();
};
const handleTransaction = (transaction_id) => {
  listMeals();
  // alert('list reloaded');
};
const categoryDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}menu-categories/dropdown`,
      BearToken(token)
    );
    categories.value = response.data.menuCategories;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};
// Call listMeals when component is mounted
onMounted(() => {
  categoryDropdown();
  listMeals();
});

// Persistent selection across pagination
const menu_ids = ref([]);

const isMenuChecked = (id) => {
  return menu_ids.value.includes(id);
};

const toggleMenuSelection = (id, checked) => {
  if (checked) {
    if (!menu_ids.value.includes(id)) menu_ids.value.push(id);
  } else {
    menu_ids.value = menu_ids.value.filter((x) => x !== id);
  }
};

const clearMenuIds = () => {
  menu_ids.value = [];
};
</script>
