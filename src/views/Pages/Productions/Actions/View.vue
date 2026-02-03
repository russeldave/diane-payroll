<template>
  <button
    @click="itemBehavior()"
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
    :maxWidth="'6xl'"
    title="View Production Description"
    @close="isViewModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- <div class="border-2 h-20">
             <MealImageViewer v-if="menuForm.thumb_nail" :key="menuForm.thumb_nail" :menu_id="menuForm.menu_id" :thumbnail="menuForm.thumb_nail" :canDeleteImage="false"/>
          </div> -->
          <div class="md:col-span-2">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700">
              Production Name
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
      <div class="mt-2">
        <h2 class="text-lg font-semibold mb-2">
          Production Ingredients ({{ menuForm.total_ingredients ?? 0 }})
        </h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead>
              <tr :class="DEFAULT_BG">
                <!-- <th width="20%" class="px-6 py-3 text-left uppercase text-xs font-medium text-white">
                  Image
                </th> -->
                <th class="px-6 py-3 text-left uppercase text-xs font-medium text-white">
                  Warehouse
                </th>
                <th class="px-6 py-3 text-left uppercase text-xs font-medium text-white">
                  Ingredient Name
                </th>
                <th class="px-6 py-3 text-right uppercase text-xs font-medium text-white">
                  Cost Price
                </th>
                <th class="px-6 py-3 text-left uppercase text-xs font-medium text-white">
                  Quantity / Unit
                </th>
                <!-- <th class="px-6 py-3 text-left uppercase text-xs font-medium text-white">
                  Unit
                </th> -->
                <th class="px-6 py-3 text-right uppercase text-xs font-medium text-white">
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
                v-for="ingredient in ingredients"
                v-if="ingredients.length > 0 && !loading"
                :key="ingredient.id"
                class="hover:bg-gray-200"
              >
                <!-- <td class="px-6 py-4">
                  <div class="h-32 w-32">
                    <IngImageViewer v-if="ingredient.id" :key="ingredient.id" :ingredient_id="ingredient.id" :thumbnail="ingredient.thumbNail" :canDeleteImage="false"/>
                  </div>
                </td> -->
                <td class="px-6 py-4 text-left border">
                      <span class="text-sm font-bold">{{ ingredient.warehouseName }}</span>
                </td>
                <td class="px-6 py-4 text-left border">
                  <span class="text-sm font-bold">{{ data.ingredientIdNumber ?? "-" }}</span> - {{ ingredient.subIngredientNamee }}<span class="italic text-red-500"> [{{ingredient.subIngredientUnitAbbre }}]</span>
                </td>
                <td class="px-6 py-4 text-right border">
                  {{ ingredient.costPrice ?? 0 }}
                </td>
                <td class="px-6 py-4 text-left border border-r-0">
                  {{ ingredient.quantity }} <sub><span class="italic text-red-500">{{ingredient.subIngredientUnitAbbre }}</span></sub>
                </td>
                <td class="px-6 py-4 text-right border">
                  {{ parseFloat(ingredient.quantity * ingredient.costPrice).toFixed(2) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="3" class="px-6 py-4 text-right border">
                  Total Production Cost
                </th>
                <th class="px-6 py-4 text-right border">{{ totalCost.toFixed(2) }}</th>
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
} from "@/views/Utility/Helper";

import IngImageViewer from "@/views/Pages/Ingredients/Actions/IngImageViewer.vue";
import MealImageViewer from "@/views/Pages/Meals/Actions/MealImageViewer.vue";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const loading = ref(false);
const ingredients = ref([]);
const isViewModalOpen = ref(false);
const menuForm = ref({
  ingredient_id_marination: 0,
  menu_name: "",
  remarks: "",
  category_name: "",
});
const itemBehavior = () => {
  fillForm();
  getMealIngredients();
  isViewModalOpen.value = true;
};
const getMealIngredients = async () => {
  try {
    ingredients.value = [];
    loading.value = true;

    const formData = FormDx(menuForm.value);
    const response = await axios.post(
      VUE_APP_API_URL + "ingredients/production-get-sub-ingredients",
      formData,
      BearToken(token)
    );

    ingredients.value = response.data.subIngredients;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};
const ingredientCounter = () => {
  const data = props.data;

  // console.log(data);
  menuForm.value.total_ingredients = data.totalSubIngredients;
};
const fillForm = () => {
  const data = props.data;

  console.log(data);
  menuForm.value.total_ingredients = data.totalSubIngredients ?? 0;
  menuForm.value.ingredient_id_marination = data.id;
  menuForm.value.ingredient_id_number = data.ingredientIdNumber ?? 0;
  menuForm.value.menu_name = data.name;
  menuForm.value.thumb_nail = data.thumbNail;
  menuForm.value.category_name = data.ingredientCategoryName;
};
const totalCost = computed(() =>
  ingredients.value.reduce((sum, item) => sum + item.costPrice * item.quantity, 0)
);
// Call getMealIngredients when component is mounted if needed
onMounted(() => {
  ingredientCounter();
  // Optionally, you might call getMealIngredients() here
});
</script>
