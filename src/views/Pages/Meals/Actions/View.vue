<template>
  <button
    @click="menuBehavior()"
    class="bg-blue-500 text-white font-bold rounded-l relative text-sm md:text-md py-2 px-4 float-end text-nowrap"
  >
    <i class="fas fa-eye"></i>
    <!-- View -->
    <label
      for=""
      title="Ingredients Count"
      class="absolute -top-2 right-0 bg-red-600 text-nowrap uppercase text-xs rounded-full p-1 text-white"
      v-if="menuForm.total_ingredients > 0"
      >{{ menuForm.total_ingredients }}</label
    >
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'4xl'"
    title="View Menu Description"
    @close="closeModal()"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- <div class="border-2 h-20">
             <MealImageViewer v-if="menuForm.thumb_nail" :key="menuForm.thumb_nail" :menu_id="menuForm.menu_id" :thumbnail="menuForm.thumb_nail" :canDeleteImage="false"/>
          </div> -->
          <div class="md:col-span-2">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700">
              Menu Name
            </label>
            <input
              type="text"
              id="MenuName"
              v-model="menuForm.menu_name"
              placeholder="Input Menu Name"
              disabled
              class="mt-1 p-2 border rounded-md uppercase w-full bg-gray-200"
            />
          </div>
          <div class="">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="MenuName"
              v-model="menuForm.category_name"
              placeholder="Input Category"
              disabled
              class="mt-1 p-2 border rounded-md uppercase w-full bg-gray-200"
            />
          </div>
        </div>
      </form>

      <!-- Menu Ingredients UI -->
      <div class="mt-2 border-t-2 border-dashed border-gray-300 pt-4">
        <div class="flex flex-nowrap justify-between gap-6">
          <h2 class="text-lg font-semibold mb-2">
            Menu Ingredients ({{ menuForm.total_ingredients ?? 0 }})
          </h2>
          <div class="flex items-center gap-2">
            <!-- <span class="p-2 bg-yellow-400 text-gray-600 font-bold rounded-lg ">
              {{ menuForm.warehouse_name }}
            </span> -->
            <!-- <select
              id="warehouseName"
              v-model="menuForm.warehouse_id"
              @change="getMealIngredients()"
              class="text-gray-800 px-2 py-1 rounded text-md font-bold shadow-lg bg-amber-200"
              >
              <option value="0">--Select Warehouse--</option>
              <option
                v-for="wh in warehouses"
                :key="wh.warehouseId"
                :value="wh.warehouseId"
              >
                {{ wh.warehouseName }}
              </option>
            </select> -->
          </div>
        </div>
        <div class="overflow-x-auto mt-2">
          <table class="min-w-full bg-white border border-gray-300">
            <thead>
              <tr :class="DEFAULT_BG">
                <!-- <th width="20%" class="px-6 py-3 text-left uppercase text-xs font-medium text-white">
                  Image
                </th> -->
                <th class="px-6 py-3 text-left uppercase text-xs font-medium text-white">
                  # 
                </th>
                <th class="px-6 py-3 text-center uppercase text-xs font-medium text-white">
                  Warehosue
                </th>
                <th class="px-6 py-3 text-center uppercase text-xs font-medium text-white">
                  Ingredient Name
                </th>
                <th class="px-6 py-3 text-center uppercase text-xs font-medium text-white">
                  Stocks
                </th>
                <th class="px-6 py-3 text-center uppercase text-xs font-medium text-white">
                  Cost Price
                </th>
                <th class="px-6 py-3 text-center uppercase text-xs font-medium text-white">
                  Quantity
                </th>
                <th class="px-6 py-3 text-center uppercase text-xs font-medium text-white">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="ingredients.length === 0 && !loading" class="hover:bg-gray-200">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  No ingredients found
                </td>
              </tr>
              <tr v-if="loading" class="hover:bg-gray-200">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  <Loader />
                </td>
              </tr>
              <tr
               v-for="(ingredient, index) in ingredients"
                v-if="ingredients.length > 0 && !loading"
                :key="ingredient.id"
                class="hover:bg-gray-200"
              >
              <td class="px-6 py-4 text-left border text-wrap">
                 {{ index + 1 }}
              </td>
              <td class="px-6 py-4 text-left border text-wrap">
                 {{ ingredient.warehouseName ?? ''}}
              </td>
               <td class="px-6 py-4 text-left border text-wrap">
                <div class="text-lg font-bold text-gray-900">
                  {{ ingredient.itemNumber}}
                  <span class=" text-gray-700 ml-1">{{ ingredient.ingredientName }}</span>
                  <span class="text-red-500 italic ml-1">[{{ ingredient.unitAbbre }}]</span>
                </div>
              </td>
                 <td class="px-6 py-4 text-left border text-wrap">
                  {{ ingredient.floatStocks }}
                </td>
                <td class="px-6 py-4 text-right border">
                  {{ moneyFormatter(ingredient.costPrice ?? 0) }}
                </td>
                <td class="px-6 py-4 text-center border border-r-0">
                  {{ ingredient.quantity ?? 0 }} <sub class="text-red-500">{{ ingredient.unitAbbre }}</sub>
                </td>
                <td class="px-6 py-4 text-center border">
                  {{
                    moneyFormatter(
                      (ingredient.quantity ?? 0) * (ingredient.costPrice ?? 0)
                    )
                  }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="5" class="px-6 py-4 text-right border">
                  Overall Total Cost
                </th> 
                <th class="px-6 py-4 text-center border" colspan="1">
                  {{ moneyFormatter(totalCostVal) }}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Loader from "@/views/Component/Loader.vue";
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
  replaceUnderScore,
  handleApiError,
  moneyFormatter,
} from "@/views/Utility/Helper";

import IngImageViewer from "@/views/Pages/Ingredients/Actions/IngImageViewer.vue";
import MealImageViewer from "@/views/Pages/Meals/Actions/MealImageViewer.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});

const loading = ref(false);
const ingredients = ref([]);
const warehouses = ref([]);
const totalCostVal = ref(0);
const isViewModalOpen = ref(false);
const menuForm = ref({
  menu_id: 0,
  menu_name: "",
  remarks: "",
  category_name: "",
  warehouse_id: 0,
});

const menuBehavior = () => {
  fillForm();
  // getWarehouses();
  getMealIngredients();

  isViewModalOpen.value = true;
};
const closeModal = () => {
  emits("transaction_id", Math.random());
  // isAddModalOpen.value = true;
};

const getMealIngredients = async () => {
  try {
    ingredients.value = [];
    loading.value = true;

    const formData = FormDx(menuForm.value);
    const response = await axios.post(
      VUE_APP_API_URL + "menus/menu-get-ingredients",
      formData,
      BearToken(token)
    );

    ingredients.value = response.data.ingredients;
    loading.value = false;
    calculateTotalCost();
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};

const getWarehouses = async () => {
  try {
    loading.value = true;
    warehouses.value = [];
    const response = await axios.post(
      `api/users/warehouses-dropdown`,
      { id: 0 }
    );
    warehouses.value = response.data.userWarehouses || [];
    loading.value = false;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    loading.value = false;
  }
};

const fillForm = () => {
  // console.log('fillForm in line: 272');
  // console.log(props.data);
  const data = props.data;

  console.log("Filling form with data:", data);

  menuForm.value.menu_id = data.id;
  menuForm.value.menu_name = data.title;
  menuForm.value.description = data.description;
  menuForm.value.thumb_nail = data.thumbNail;
  menuForm.value.category_name = data.menuCategoryName;
  menuForm.value.warehouse_id = data.warehouseId ?? 0;
  menuForm.value.warehouse_name = data.warehouseName ?? "None";
};

const ingredientCounter = () => {
  const data = props.data;

  menuForm.value.total_ingredients = data.totalIngredients;
};

const calculateTotalCost = () => {
  console.log('This a test in calculate Cost')
  console.log(ingredients.value);
  totalCostVal.value = ingredients.value.reduce(
    (sum, item) => sum + item.costPrice * item.quantity,
    0
  );
  console.log(totalCostVal)
};

// Call getMealIngredients when component is mounted if needed
onMounted(() => {
  ingredientCounter();
  // Optionally, you might call getMealIngredients() here
});
</script>
