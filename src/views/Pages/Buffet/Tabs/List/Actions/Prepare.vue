<template>
  <a
    @click="(isViewModalOpen = true), itemBehavior()"
    class="underline text-blue-500 hover:text-blue-700 cursor-pointer"
  >
    {{ props.data.dishesName }} ({{ props.data.dishesId }})
    <!-- <label for="" title="Ingredients Count" class="absolute -top-2 right-0 bg-red-600 text-nowrap uppercase text-xs rounded-full p-1 text-white">{{ prepareForm.total_ingredients }}</label> -->
  </a>
  <!-- Add Item Modal -->
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'6xl'"
    title="Prepare Productions"
    @close="isViewModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- <div class="border-2 h-20">
             <MealImageViewer v-if="prepareForm.thumb_nail" :key="prepareForm.thumb_nail" :menu_id="prepareForm.menu_id" :thumbnail="prepareForm.thumb_nail" :canDeleteImage="false"/>
          </div> -->
          <div class="space-y-3">
            <div class="">
              <label for="LeagueName" class="block text-sm font-medium text-gray-700">
                Marinate/Sauce Name
              </label>
              <input
                type="text"
                id="MenuName"
                v-model="prepareForm.production_name"
                placeholder="Input Menu Name"
                disabled
                class="mt-1 p-2 border rounded-md uppercase w-full bg-gray-200"
              />
            </div>
            <div class="">
              <label for="LeagueName" class="block text-sm font-medium text-gray-700">
                Yeild ({{ prepareForm.unit_abbre ?? "-" }})
              </label>
              <div class="flex relative">
                <input
                  type="text"
                  id="MenuName"
                  v-model="prepareForm.yeild"
                  placeholder="Input quantity"
                  disabled
                  class="mt-1 p-2 border rounded-l w-full bg-gray-200"
                />
                <!-- <p class="absolute bottom-0 right-0 bg-red-100 rounded py-1/2 px-2">{{ prepareForm.unit_abbre ?? '-' }}</p> -->
              </div>
            </div>
            <div class="">
              <label for="LeagueName" class="block text-sm font-medium text-gray-700">
                Produced Quantity (Required)
              </label>
              <div class="flex">
                <input
                  type="text"
                  id="MenuName"
                  v-model="prepareForm.production_quantity"
                  placeholder="Input quantity"
                  class="mt-1 p-2 border rounded-l w-full"
                />
              </div>
            </div>
            <div class="">
              <label for="LeagueName" class="block text-sm font-medium text-gray-700">
                Total Produced
              </label>
              <p hidden>
                {{
                  (prepareForm.total =
                    prepareForm.production_quantity * prepareForm.yeild)
                }}
              </p>
              <div class="flex">
                <input
                  type="text"
                  id="MenuName"
                  v-model="prepareForm.total"
                  disabled
                  placeholder="Input quantity"
                  class="mt-1 p-2 border rounded-l w-full bg-gray-200"
                />
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <button
                type="button"
                @click.prevent="prepareProduction()"
                class="bg-green-500 text-white hover:bg-green-600 font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </div>
          <!-- Menu Ingredients UI -->
          <div class="md:col-span-2">
            <h2 class="text-lg font-semibold mb-2">
              Productions Ingredients ({{ prepareForm.total_ingredients ?? 0 }})
            </h2>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr :class="DEFAULT_BG">
                    <!-- <th width="20%" class="px-6 py-3 text-left uppercase text-xs font-medium text-white">
                      Image
                    </th> -->
                    <th
                      class="px-6 py-3 text-left uppercase text-xs font-medium text-white"
                    >
                      Ingredient Name
                    </th>
                    <!-- <th class="px-6 py-3 text-right uppercase text-xs font-medium text-white">
                      Cost Price
                    </th> -->
                    <th
                      class="px-6 py-3 text-left uppercase text-xs font-medium text-white"
                    >
                      Quantity / Unit
                    </th>
                    <th
                      class="px-6 py-3 text-left uppercase text-xs font-medium text-white"
                    >
                      Deducted
                    </th>
                    <!-- <th class="px-6 py-3 text-right uppercase text-xs font-medium text-white">
                      Total Cost
                    </th> -->
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-if="ingredients.length === 0 && !loading"
                    class="hover:bg-gray-200"
                  >
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
                      {{ ingredient.subIngredientNamee }} ({{
                        ingredient.subIngredientUnitAbbre
                      }})
                    </td>
                    <td class="px-6 py-4 text-left border">
                      {{ ingredient.quantity }} {{ ingredient.unitName }}
                      <sub>{{ ingredient.subIngredientUnitAbbre }}</sub>
                    </td>
                    <td class="px-6 py-4 text-left border bg-red-50">
                      {{ ingredient.quantity * prepareForm.production_quantity }}
                      <sub>{{ ingredient.subIngredientUnitAbbre }}</sub>
                    </td>
                  </tr>
                </tbody>
                <!-- <tfoot>
                  <tr>
                    <th colspan="3" class="px-6 py-4 text-right border">Overall Total Cost</th>
                    <th class="px-6 py-4 text-right border">{{ totalCost.toFixed(2) }}</th>
                  </tr>
                </tfoot> -->
              </table>
            </div>
          </div>
        </div>
      </form>
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
const prepareForm = ref({
  menu_id: 0,
  production_name: "",
  remarks: "",
  category_name: "",
  production_quantity: 0,
  yeild: 0,
  total: 0,
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  ingredient_id_marination: 0,
});
const itemBehavior = () => {
  fillForm();
  getMealIngredients();
};
const getMealIngredients = async () => {
  try {
    ingredients.value = [];
    loading.value = true;

    const formData = FormDx(search.value);
    const response = await axios.post(
      VUE_APP_API_URL + "ingredients/production-get-sub-ingredients",
      formData,
      BearToken(token)
    );

    ingredients.value = response.data.subIngredients;

    prepareForm.value.yeild = response.data.yeild ?? 0;
    prepareForm.value.unit_abbre = response.data.unitAbbre ?? "-";

    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};
const fillForm = () => {
  const data = props.data;

  prepareForm.value.ingredient_id_marination = data.ingredientIdProduction ?? 0;
  prepareForm.value.production_name = data.dishesName;
  (prepareForm.value.production_quantity = 0),
    (search.value.ingredient_id_marination = data.ingredientIdProduction ?? 0);
};

const prepareProduction = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we prepare the production.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(prepareForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/prepare-production`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isViewModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};
// const totalCost = computed(() => ingredients.value.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0));
// Call getMealIngredients when component is mounted if needed
onMounted(() => {
  // Optionally, you might call getMealIngredients() here
});
</script>
