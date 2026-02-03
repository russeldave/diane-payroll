<template>
  <button
    @click.prevent="itemBehavior()"
    title="Sync ingredients from other menu"
    class="bg-lime-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-sync"></i>
    Sync
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
    :show="isSyncModalOpen"
    :maxWidth="'4xl'"
    title="Sync Ingredients"
    @close="isSyncModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form autocomplete="off">
        <div class="mb-4">
          <label for="ProductName" class="block text-sm font-medium text-gray-500 mb-4"
            >Search Menu to Sync</label
          >
          <div class="flex mt-1">
            <SearchDropdown
              apiEndpoint="menus/list"
              :searchModel="searchMenu"
              :key="menuForm.menu_name"
              placeholder="Search Menu"
              itemLabel="name"
              itemId="id"
              :defaultValue="menuForm.menu_name"
              inputId="menuName"
              formatLabel="dashed"
              className="focus-visible:bg-yellow-100 p-2 w-full border"
              @item-selected="(data) => fillmenuForm(data)"
              dataKey="menus"
              returnName="['menuCategoryName','title']"
            />
          </div>
          <small v-if="loading" class="text-red-500">Fetching Ingredients...</small>
        </div>
        <div class="mb-4">
          <label for="ProductName" class="block text-sm font-medium text-gray-500 mb-4"
            >Ingredients</label
          >
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
                  <th
                    class="px-6 py-3 text-right uppercase text-xs font-medium text-white"
                  >
                    Cost Price
                  </th>
                  <th
                    class="px-6 py-3 text-left uppercase text-xs font-medium text-white"
                  >
                    Quantity / Unit
                  </th>
                  <!-- <th class="px-6 py-3 text-left uppercase text-xs font-medium text-white">
                            Unit
                            </th> -->
                  <!-- <th class="px-6 py-3 text-right uppercase text-xs font-medium text-white">
                            Total Cost
                            </th> -->
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-if="menuForm.ingredients?.length == 0 && !loading"
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
                  v-for="ingredient in menuForm.ingredients"
                  v-if="menuForm.ingredients?.length > 0 && !loading"
                  :key="ingredient.id"
                  class="hover:bg-gray-200"
                >
                  <!-- <td class="px-6 py-4">
                                <div class="h-32 w-32">
                                    <IngImageViewer v-if="ingredient.id" :key="ingredient.id" :ingredient_id="ingredient.id" :thumbnail="ingredient.thumbNail" :canDeleteImage="false"/>
                                </div>
                                </td> -->
                  <td class="px-6 py-4 text-left border">{{ ingredient.name }}</td>
                  <td class="px-6 py-4 text-right border">
                    {{ ingredient.cost_price ?? 0 }}
                  </td>
                  <td class="px-6 py-4 text-left border border-r-0">
                    {{ ingredient.quantity }} {{ ingredient.unit }}
                  </td>
                  <!-- <td class="px-6 py-4 text-right border">{{ parseFloat(ingredient.quantity * ingredient.costPrice).toFixed(2) }}</td> -->
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
        <div class="mb-4 float-end">
          <button
            type="submit"
            :disabled="menuForm.ingredients?.length == 0"
            :class="menuForm.ingredients?.length == 0 ? 'opacity-50' : ''"
            @click.prevent="syncIngredients"
            class="bg-green-500 text-white hover:bg-green-600 font-bold py-2 px-4 rounded"
          >
            Sync
          </button>
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
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
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
const emits = defineEmits(["ingredients"]);
// const props = defineProps({
//   data: Object
// });
const loading = ref(false);
const ingredients = ref([]);
const isSyncModalOpen = ref(false);

const searchMenu = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  category_id: 0,
});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  menu_id: 0,
});
const menuForm = ref({
  menu_id: 0,
  menu_name: "",
  remarks: "",
  category_name: "",
  ingredients: [],
});
const itemBehavior = () => {
  isSyncModalOpen.value = true;
};

const syncIngredients = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we sync the ingredients.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Emit ingredients for syncing
    emits("ingredients", menuForm.value);

    // Close processing alert
    Swal.close();

    isSyncModalOpen.value = false;
    Alert("success", "Success", "Ingredients synced successfully");
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const getMealIngredients = async () => {
  try {
    loading.value = true;
    menuForm.value.ingredients = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      VUE_APP_API_URL + "menus/get-ingredients",
      formData,
      BearToken(token)
    );

    // Reformat and push the response ingredients
    menuForm.value.ingredients = response.data.ingredients.map((ingredient) => ({
      menu_ingredient_id: ingredient.id || 0, // Assuming 'id' exists in the response
      ingredient_id: ingredient.ingredientId || 0, // Assuming 'id' exists in the response
      name: ingredient.ingredientName || "", // Assuming 'name' exists in the response
      unit: ingredient.unitAbbre || "", // Assuming 'name' exists in the response
      unit_name: ingredient.unitName || "", // Assuming 'name' exists in the response
      quantity: ingredient.quantity || 1, // Default to 1 if no quantity is provided
      cost_price: ingredient.costPrice || 1, // Default to 1 if no quantity is provided
      exist: true, // Assuming all ingredients exist by default
    }));

    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};
const fillmenuForm = async (data) => {
  search.value.menu_id = data.id;
  search.value.menu_name = data.title;

  menuForm.value.menu_id = data.id;
  menuForm.value.menu_name = data.title;
  await getMealIngredients();
};
onMounted(() => {});
</script>
