<template>
  <button
    @click.prevent="addBehavior()"
    type="button"
    :class="[
      'bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-plus"></i>
    Add Menu
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="New Menu"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-0">
      <form class="" @submit.prevent="addMenu()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-4">
          <div class="block bg-amber-600 p-4 md:min-h-screen">
            <h2 for="itemImages" class="block text-2xl font-medium text-white">
              Fill Menu Form.
            </h2>
            <div class="mb-4 mt-4 pt-3 border-t-2 border-black">
              <label for="itemImages" class="block text-sm font-medium text-white"
                >Upload Image</label
              >
              <input
                type="file"
                id="itemImages"
                @change="handleImageUpload"
                multiple
                class="mt-1 p-2 border rounded-md w-full bg-white"
              />
            </div>
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Name</label
              >
              <input
                type="text"
                id="ProductName"
                required
                min="0"
                v-model="menuForm.name"
                placeholder="Input Meal Name"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
              <!-- <div class="flex items-center me-4">
                  <input id="inline-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                  <label for="inline-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"></label>
              </div> -->

              <div class="mb-4">
                  <label for="ProductName" class="block text-sm font-medium text-white"
                >Main Menu</label
              >
                   <SearchDropdown
                    apiEndpoint="menus/search-name-only"
                    :searchModel="searchIngredient"
                    placeholder="Select Main Menu"
                    itemLabel="menuName"
                    itemId="id"
                    inputId="menuName"
                    formatLabel="parenthesis"
                    className="focus-visible:bg-yellow-100 p-2 w-full border rounded-md"
                    @item-selected="fillMainMenuForm" 
                    dataKey="menus"
                    returnName="['name']"
                  />
              </div>

            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Category</label
              >
              <select
                class="mt-1 p-2 border rounded-md w-full"
                v-model="menuForm.category_id"
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
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Warehouse</label
              >
              <select
                id="warehouseName"
                v-model="menuForm.warehouse_id"
                class="mt-1 p-2 border rounded-md w-full"
              >
                <option value="0">--Select Warehouse--</option>
                <option
                  v-for="wh in warehouses"
                  :key="wh.warehouseId"
                  :value="wh.warehouseId"
                >
                  {{ wh.warehouseName }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Cost Price</label
              >
              <div class="mt-1 p-2 border rounded-md w-full bg-gray-200">
                {{ totalCost.toFixed(2) ?? 0 }}
              </div>
            </div>
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Retail Price</label
              >
              <input
                type="number"
                id="ProductName"
                required
                min="0"
                v-model="menuForm.price"
                placeholder="Input Name"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div class="mb-4">
              <label for="remarks" class="block text-sm font-medium text-white"
                >Description</label
              >
              <textarea
                v-model="menuForm.description"
                placeholder="Input Description"
                class="mt-1 p-2 border rounded-md w-full"
              ></textarea>
            </div>
            <div class="md:flex items-center justify-end hidden">
              <button
                type="submit"
                class="bg-green-500 text-white hover:bg-green-600 font-bold py-2 px-4 rounded"
              >
                Save Meal
              </button>
            </div>
          </div>
          <div class="block md:col-span-3 p-4">
            <h2 for="itemImages" class="block text-2xl font-bold text-amber-600">
              <i class="fa fa-pepper-hot"></i> Add Ingredients.
            </h2>
            <div
              class="flex justify-between mb-1 mt-4 px-2 pt-3 border-t-2 border-amber-600 space-x-2"
            >
              <div class="flex justify-end space-x-2">
                <AddIngredient
                  className="bg-red-500 text-white hover:opacity-70 focus:bg-red-300 rounded font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap "
                  v-if="hasPermission('Ingredient_Add_Button')"
                  @transaction_id="handleTransaction()"
                />
                <SyncIngredients :key="menuForm.menu_id" @ingredients="handleSyncData" />
              </div>
              <button
                @click.prevent="addIngredient()"
                class="bg-blue-500 text-white hover:opacity-70 rounded font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
              >
                <i class="fas fa-plus"></i>
                Add Row
              </button>
            </div>
            <!-- <span class="px-2 text-sm text-red-400"><b class="text-gray-600">Note:</b> Ingredients with <b class="text-red-500 italic">Stock Card</b> category can only be added in menu ingredients.</span> -->
            <div class="mb-4 overflow-auto text-nowrap block p-2">
              <table class="w-full border-collapse bg-white text-md uppercase">
                <thead :class="DEFAULT_BG" class="text-white border-b-2 border-black">
                  <tr>
                    <th class="text-left border p-2">Ingredients</th>
                    <th class="text-left border p-2" width="20%">Cost Price</th>
                    <th class="text-left border p-2" width="20%">Quantity</th>
                    <th class="text-left border p-2" width="20%">Total Price</th>
                    <th class="text-center border p-2" width="20%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-if="menuForm.ingredients.length > 0"
                    v-for="(ingredient, index) in menuForm.ingredients"
                    :key="index"
                    class="border"
                  >
                    <td class="border p-2">
                      <SearchDropdown
                        apiEndpoint="ingredients/search-name-only"
                        :searchModel="searchIngredient"
                        :key="ingredient.name"
                        placeholder="Search Ingredient"
                        itemLabel="name"
                        itemId="id"
                        :defaultValue="ingredient.name"
                        inputId="ingredientName"
                        formatLabel="parenthesis"
                        className="focus-visible:bg-yellow-100 p-2 w-full border"
                        @item-selected="(data) => fillIngredientForm(data, index)"
                        dataKey="ingredients"
                        returnName="['name']"
                      />
                    </td>
                    <td class="right border p-2">
                      <div class="flex group">
                        <input
                          step="any"
                          v-model.number="ingredient.cost_price"
                          type="number"
                          disabled
                          class="bg-gray-200 border p-2 w-full text-left focus-visible:bg-yellow-100"
                        />
                      </div>
                    </td>
                    <td class="right border p-2">
                      <div class="flex group">
                        <input
                          step="any"
                          v-model.number="ingredient.quantity"
                          type="number"
                          class="border p-2 w-full text-left focus-visible:bg-yellow-100"
                        />
                        <button
                          class="text-xs bg-red-500 p-2 text-white rounded-r"
                          :title="ingredient.unit_name"
                          v-if="ingredient.unit"
                        >
                          {{ ingredient.unit }}
                        </button>
                      </div>
                    </td>
                    <td class="right border p-2">
                      <div class="flex group">
                        <p hidden>
                          {{
                            (ingredient.total = (
                              ingredient.cost_price * ingredient.quantity
                            ).toFixed(2))
                          }}
                        </p>
                        <input
                          step="any"
                          v-model.number="ingredient.total"
                          type="number"
                          disabled
                          class="bg-gray-200 border p-2 w-full text-left focus-visible:bg-yellow-100"
                        />
                      </div>
                    </td>
                    <td class="border p-2 text-center">
                      <button
                        @click.prevent="removeIngredient(index)"
                        class="bg-red-500 text-sm md:text-md text-white p-1 rounded-full"
                      >
                        <i class="fa fa-times"></i> Remove
                      </button>
                    </td>
                  </tr>
                  <tr v-else>
                    <td colspan="6" class="border p-2 text-center text-red-500 font-bold">
                      <small>No ingredients added!</small>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="border-b-2 border-black">
                  <tr>
                    <th class="text-right border p-2" colspan="3">Grand Total</th>
                    <th class="text-left border p-2" colspan="2">
                      {{ totalCost.toFixed(2) ?? 0 }}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="md:hidden items-center justify-end flex p-2">
              <button
                type="submit"
                class="bg-green-500 text-white hover:bg-green-600 font-bold py-2 px-4 rounded"
              >
                Save
              </button>
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
import { hasPermission } from "@/views/Utility/Permissions";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { VUE_APP_API_URL, UNITS, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

import AddIngredient from "@/views/Pages/Ingredients/Actions/Add.vue";
import SyncIngredients from "../Actions/SyncIngredients.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
});
const isAddModalOpen = ref(false);
const defaultWarehouse = ref(localStorage.getItem("warehouse_id") || 0);
const units = ref([]);
const imageFiles = ref([]);
const categories = ref([]);
const warehouses = ref([]);
const loading = ref(false);
const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const menuForm = ref({
  menu_id: 0,
  name: "",
  description: "",
  price: 0,
  cost_price: 0,
  category_id: 0,
  main_menu_id: 0,
  menu_images: [],
  ingredients: [
    {
      ingredient_id: 0,
      name: "",
      quantity: 1,
      cost_price: 0,
      total: 0,
    },
  ],
});

const totalCost = computed(() =>
  menuForm.value.ingredients?.reduce((sum, item) => sum + parseFloat(item.total ?? 0), 0)
);

const addBehavior = () => {
  resetForm();
  categoryDropdown();
  getWarehouses();
  isAddModalOpen.value = true;
};
const resetForm = () => {
  menuForm.value.menu_id = 0;
  menuForm.value.name = "";
  menuForm.value.description = "";
  menuForm.value.price = 0;
  menuForm.value.cost_price = 0;
  menuForm.value.category_id = 0;
  menuForm.value.menu_images = [];
  menuForm.value.warehouse_id = defaultWarehouse.value;
  menuForm.value.ingredients = [
    {
      ingredient_id: 0,
      name: "",
      quantity: 1,
      cost_price: 0,
      total: 0,
    },
  ];
};
const addIngredient = () => {
  menuForm.value.ingredients.push({
    name: "",
    ingredient_id: 0,
    quantity: 1,
    cost_price: 0,
    total: 0,
  });
};
const removeIngredient = (index) => {
  menuForm.value.ingredients.splice(index, 1); // Removes the ingredient at the given index
};
//fillIngredientForm
const fillIngredientForm = (item, index) => {
  console.log(index);
  // Ensure the index exists in the ingredients array
  if (menuForm.value.ingredients[index]) {
    menuForm.value.ingredients[index].ingredient_id = item.id ?? 0;
    menuForm.value.ingredients[index].name = item.name;
    menuForm.value.ingredients[index].unit = item.unitAbbre ?? "-";
    menuForm.value.ingredients[index].unit_name = item.unitName ?? "-";
    menuForm.value.ingredients[index].cost_price = item.costPrice ?? 0;
    menuForm.value.ingredients[index].total = item.costPrice * item.quantity ?? 0;
  } else {
    // Optionally handle the case where the index doesn't exist
    console.warn(`Index ${index} is out of range.`);
  }

  // Clear the search field
  searchIngredient.value.search = "";
};

const fillMainMenuForm = (item) => {
  menuForm.value.main_menu_id = item.id ?? 0;
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const handleSyncData = async (data) => {
  menuForm.value.sync_menu_id = 0;
  menuForm.value.sync_menu_name = "";

  if (data) {
    menuForm.value.ingredients = data?.ingredients;
    menuForm.value.sync_menu_id = data?.menu_id;
    menuForm.value.sync_menu_name = data?.menu_name;
  }

  isSync.value = true;
};

const addMenu = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the menu.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(menuForm.value);

    // Append image files
    imageFiles.value.forEach((file) => {
      formData.append("menu_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}menus/add`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
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

const getWarehouses = async () => {
  try {
    loading.value = true;
    warehouses.value = [];
    const response = await axios.post(
      `${VUE_APP_API_URL}users/warehouses-dropdown`,
      { id: 0 }, // Assuming you want to fetch all warehouses
      BearToken(token)
    );
    warehouses.value = response.data.userWarehouses || [];
    loading.value = false;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    loading.value = false;
  }
};
</script>
