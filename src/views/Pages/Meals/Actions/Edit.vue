<template>
  <button
    @click.prevent="editBehavior()"
    type="button"
    :class="[
      'bg-yellow-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-edit"></i>
    Edit
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Edit Menu"
    @close="closeModal()"
  >
    <div class="grid grid-cols-1 gap-6 p-0 w-full">
      <form class="" @submit.prevent="editMenu()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-4">
          <div class="block bg-amber-600 p-4 md:min-h-screen">
            <h2 for="itemImages" class="block text-2xl font-medium text-white">
              Fill Menu Form.
            </h2>
            <div class="mb-4 mt-4 pt-3 border-t-2 border-black">
              <div class="h-32 w-32">
                <MealImageViewer
                  v-if="menuForm.menu_id"
                  :key="menuForm.menu_id"
                  :menu_id="menuForm.menu_id"
                  :thumbnail="menuForm.thumb_nail"
                  :canDeleteImage="true"
                />
              </div>
            </div>
            <div class="mb-4 mt-4 pt-3">
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
              <div class="flex mt-1">
                <input
                  type="text"
                  id="ProductName"
                  required
                  min="0"
                  v-model="menuForm.name"
                  :disabled="!hasPermission('Override_Menu_Name')"
                  placeholder="Input Meal Name"
                  :class="
                    hasPermission('Override_Menu_Name')
                      ? 'bg-white rounded-l'
                      : ' bg-gray-200 rounded'
                  "
                  class="p-2 border w-full"
                />
                <OverrideMenuName
                  v-if="hasPermission('Override_Menu_Name')"
                  :key="menuForm.name"
                  :data="menuForm"
                />
              </div>
            </div>

              <div class="mb-4">
                  <label for="ProductName" class="block text-sm font-medium text-white"
                >Main Menu</label
              >
              <div class="flex">
                   <SearchDropdown
                    apiEndpoint="menus/search-name-only"
                    :searchModel="searchIngredient"
                    placeholder="Select Main Menu"
                    itemLabel="menuName"
                    itemId="id"
                    inputId="menuName"
                    formatLabel="parenthesis"
                    :key="menuForm.main_menu_id" 
                    :defaultValue="menuForm.mainMenu"
                    className="focus-visible:bg-yellow-100 p-2 w-full border rounded-md rounded-r-none"
                    @item-selected="fillMainMenuForm" 
                    dataKey="menus"
                    returnName="['name']"
                  />
                       <button
                        v-if="menuForm.main_menu_id > 0"
                        @click="clearMainMenu"
                        type="button"
                        class="bg-red-500 text-white p-2 rounded-md rounded-l-none hover:bg-red-600"
                        title="Clear Main Menu"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                  </div>
 
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
              <div class="flex mt-1">
                <input
                  type="number"
                  id="ProductName"
                  required
                  min="0"
                  v-model="menuForm.price"
                  :disabled="!hasPermission('Override_Retail_Price')"
                  placeholder="Input Retail Price"
                  :class="
                    hasPermission('Override_Retail_Price')
                      ? 'bg-white rounded-l'
                      : ' bg-gray-200 rounded'
                  "
                  step="any"
                  class="p-2 border w-full"
                />
                <OverrideRetailPrice
                  v-if="hasPermission('Override_Retail_Price')"
                  :key="menuForm.price"
                  :data="menuForm"
                />
              </div>
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
                Save Menu
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
                <DeleteAllIngredient
                  :key="menuForm.menu_id"
                  :menu_id="menuForm.menu_id"
                  @transaction_id="handleTransaction()"
                />
              </div>
              <button
                @click.prevent="addIngredient()"
                class="bg-blue-500 text-white hover:opacity-70 focus:bg-red-300 rounded font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
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
                    <th class="text-left border p-2">#</th>
                    <th class="text-left border p-2">
                      <div class="w-[12rem]">
                        Warehouse
                      </div>
                    </th>
                    <th class="text-left border p-2">Ingredients</th>
                    <th class="text-left border p-2" width="20%">Cost Price</th>
                    <th class="text-left border p-2" width="20%">
                      <div class="w-[8rem]">
                        Quantity
                      </div>
                    </th>
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
                    <td class="border p-2 text-center font-bold">
                      {{ index + 1 }}
                    </td> <td class="border p-2">
                      <!-- @change="updateIngredientWarehouse(index, ingredient.ingredient_warehouse)" -->
                      <select
                        v-model="ingredient.ingredient_warehouse_id"
                        class="mt-1 p-2 border rounded-md w-full focus-visible:bg-yellow-100"
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
                    </td>
                    <td class="border p-2">
                      <div class="w-[25rem]">
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
                      </div>
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
                        v-if="ingredient.exist"
                        @click.prevent="editIngredient(ingredient)"
                        class="bg-yellow-500 text-white px-2 py-2 rounded-s-md text-sm md:text-md font-bold hover:scale-110"
                      >
                        <!-- <i class="fa fa-save"></i>  -->
                        Update
                      </button>
                      <button
                        v-if="ingredient.exist"
                        @click.prevent="deleteIngredient(ingredient.menu_ingredient_id)"
                        class="bg-red-500 text-white py-2 px-2 rounded-e-md text-sm md:text-md font-bold hover:scale-110"
                        >
                        <!-- <i class="fa fa-times"></i> -->
                         Remove
                      </button>
                      <button
                        v-else
                        @click.prevent="removeIngredient(index)"
                        class="bg-red-600 text-white py-2 px-2 rounded-e-md text-sm md:text-md font-bold hover:scale-110"
                      >
                        <!-- <i class="fa fa-times"></i>  -->
                        Remove
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
                    <th class="text-left border p-2" colspan="2">
                      <span
                        class="text-xs capitalize text-gray-500"
                        v-if="menuForm.sync_menu_id > 0"
                        ><i class="fa fa-sync fa-xs"></i> Synced Menu from
                        <i class="text-blue-500">[{{ menuForm.sync_menu_name }}]</i></span
                      >
                      <a
                        v-if="menuForm.sync_menu_id > 0"
                        href="#"
                        @click.prevent="unsyncMenu()"
                        class="underline text-red-500 text-xs capitalize ml-2"
                        title="Remove Sync Menu"
                      >
                        Remove
                      </a>
                    </th>
                    <th class="text-right border p-3" colspan="2">Grand Total</th>
                    <th class="text-left border p-2" colspan="1">
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
// import DeleteIngredient from "@/views/Pages/Meals/Actions/DeleteIngredient.vue";
import DeleteAllIngredient from "@/views/Pages/Meals/Actions/DeleteAllMenuIngredient.vue";
import OverrideMenuName from "../Actions/OverrideMenuName.vue";
import SyncIngredients from "../Actions/SyncIngredients.vue";

import IngImageViewer from "@/views/Pages/Ingredients/Actions/IngImageViewer.vue";
import MealImageViewer from "../Actions/MealImageViewer.vue";
import OverrideRetailPrice from "./OverrideRetailPrice.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
});
const isAddModalOpen = ref(false);
const defaultWarehouse = ref(localStorage.getItem("warehouse_id") || 0);
const isSync = ref(false);
const units = ref([]);
const imageFiles = ref([]);
const categories = ref([]);
const ingredients = ref([]);
const warehouses = ref([]);
const loading = ref(false);
const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
  menu_id: props.data.id
});
const menuForm = ref({
  menu_id: 0,
  name: "",
  description: "",
  price: 0,
  cost_price: 0,
  category_id: 0,
  thumb_nail: "",
  menu_images: [],
  main_menu_id: 0,
  mainMenu: "",
  sync_menu_id: 0,
  warehouse_id: 0,
  menu_has_menu_sync_id: 0,
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

const editBehavior = () => {
  resetForm();
  fillForm();
  categoryDropdown();
  getMealIngredients();
  getWarehouses();
  isAddModalOpen.value = true;
};

const closeModal = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = true;
};
const resetForm = () => {
  menuForm.value.name = "";
  menuForm.value.description = "";
  menuForm.value.price = 0;
  menuForm.value.cost_price = 0;
  menuForm.value.category_id = 0;
  menuForm.value.menu_images = [];
  menuForm.value.mainMenu = "";
  menuForm.value.main_menu_id = 0;
  menuForm.value.sync_menu_id = 0;
  menuForm.value.sync_menu_name = "";
  menuForm.value.menu_has_menu_sync_id = 0;
  menuForm.value.ingredients = [
    {
      ingredient_id: 0,
      name: "",
      quantity: 1,
      exist: false,
      cost_price: 0,
      total: 0,
    },
  ];
};
const fillForm = () => {
  const data = props.data;
console.log(data);

  menuForm.value.menu_id = data.id;
  menuForm.value.name = data.title;
  menuForm.value.description = data.description;
  menuForm.value.price = data.retailPrice ?? 0;
  menuForm.value.cost_price = data.menuCostPrice ?? 0;
  menuForm.value.category_id = data.menuCategoryId ?? 0;
  menuForm.value.thumb_nail = data.thumbNail;
   
  menuForm.value.warehouse_id = data.warehouseId ?? defaultWarehouse.value;

  if (data.mainMenu && data.mainMenu.length > 0) {
    menuForm.value.mainMenu = data.mainMenu[0].title ?? "";
    menuForm.value.main_menu_id = data.mainMenu[0].id ?? 0;
  } else {
    // Set to empty/default values when no main menu
    menuForm.value.mainMenu = "";
    menuForm.value.main_menu_id = 0;
  }

  menuForm.value.menu_images = [];
  menuForm.value.ingredients = [
    {
      menu_ingredient_id: 0,
      ingredient_id: 0,
      name: "",
      quantity: 1,
      exist: false,
    },
  ];
};
const addIngredient = () => {
  menuForm.value.ingredients.push({
    menu_ingredient_id: 0,
    ingredient_id: 0,
    name: "",
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
  // Ensure the index exists in the ingredients array
  if (menuForm.value.ingredients[index]) {
    menuForm.value.ingredients[index].ingredient_id = item.id ?? 0;
    menuForm.value.ingredients[index].name = item.name;
    menuForm.value.ingredients[index].unit = item.unitAbbre ?? "-";
    menuForm.value.ingredients[index].unit_name = item.unitName ?? "-";
    menuForm.value.ingredients[index].cost_price = item.costPrice ?? 0;
  } else {
    // Optionally handle the case where the index doesn't exist
    console.warn(`Index ${index} is out of range.`);
  }

  // Clear the search field
  searchIngredient.value.search = "";
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const handleTransaction = () => {
  getMealIngredients();
};

const getMealIngredients = async () => {
  try {
    const formData = FormDx(menuForm.value);
    const response = await axios.post(
      VUE_APP_API_URL + "menus/menu-get-ingredients",
      formData,
      BearToken(token)
    );

    let sync_menu = response.data.syncMenu;
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
      ingredient_warehouse_id: ingredient.warehouseId || 0,// Assuming all ingredients exist by default
    }));

    // Set the sync menu ID and name
    if (sync_menu) {
      menuForm.value.menu_has_menu_sync_id = sync_menu.id ?? 0;
      menuForm.value.sync_menu_id = sync_menu.syncMenuId ?? 0;
      menuForm.value.sync_menu_name = sync_menu.syncMenuName ?? "";
    }
  } catch (error) {
    handleApiError(error);
  }
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

const removeAllMenuIngredient = async () => {
  try {
    // Proceed with deletion using Axios
    const formData = FormDx({ menu_id: menuForm.value.menu_id });
    const response = await axios.post(
      `${VUE_APP_API_URL}menus/delete-all-ingredients`,
      formData,
      BearToken(token)
    );
  } catch (error) {
    console.log(error);
    // Handle Axios or other errors
    handleApiError(error);
  }
};

const editMenu = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update the menu.",
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

    if (isSync.value) {
      await removeAllMenuIngredient();
    }

    const response = await axios.post(
      `${VUE_APP_API_URL}menus/edit`,
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

  const clearMainMenu = () => {
    menuForm.value.main_menu_id = 0;
    menuForm.value.mainMenu = "";
    // Force re-render of SearchDropdown by changing the key
    searchIngredient.value.search = ""; // Clear search term
  };
const fillMainMenuForm = (item) => {
  console.log('Main menu selected:', item); // Debug log
  
  if (!item || item === null || item === undefined || !item.id) {
    // Handle empty selection
    menuForm.value.main_menu_id = 0;
    menuForm.value.mainMenu = "";
  } else {
    // Handle valid selection
    menuForm.value.main_menu_id = item.id ?? 0;
    menuForm.value.mainMenu = item.menuName || item.name || "";
  }
  
  console.log('Current main_menu_id:', menuForm.value.main_menu_id); // Debug log
};

const deleteIngredient = async (menu_ingredient_id) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this menu ingredient. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Proceed with deletion using Axios
      const formData = FormDx({ menu_ingredient_id: menu_ingredient_id });
      const response = await axios.post(
        `${VUE_APP_API_URL}menus/delete-ingredient-in-menu`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("warning", "Deleted!", response.data.message);
      getMealIngredients();
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
  } catch (error) {
    // Handle Axios or other errors
    handleApiError(error);
  }
};

const editIngredient = async (ingredient_data) => {
  // console.log('editIngredient in line: 771');
  // console.log(ingredient_data);
  // return;
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to update this Menu ingredient. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Proceed with deletion using Axios
      const formData = FormDx({
        menu_has_ingredient_id: ingredient_data.menu_ingredient_id,
        ingredient_id: ingredient_data.ingredient_id,
        new_quantity: ingredient_data.quantity,
        ingredient_warehouse_id: ingredient_data.ingredient_warehouse_id
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}menus/edit-ingredient-in-menu`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("success", "Updated!", response.data.message);
      getMealIngredients();
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
  } catch (error) {
    // Handle Axios or other errors
    handleApiError(error);
  }
};

const unsyncMenu = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to remove this sync menu. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Proceed with deletion using Axios
      const formData = FormDx({
        menu_has_menu_sync_id: menuForm.value.menu_has_menu_sync_id,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}menus/delete-sync-menu`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("warning", "Removed!", response.data.message);
      getMealIngredients();
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
  } catch (error) {
    // Handle Axios or other errors
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
</script>
