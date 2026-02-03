<template>
  <button
    @click.prevent="editBehavior()"
    :disabled="!props.unpack"
    type="button"
    :class="[
      'font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap bg-gray-500 text-white hover:scale-110',
      className,
      {
        'hover:opacity-70 focus:bg-blue-300': props.unpack,
        'disabled:opacity-50 disabled:cursor-not-allowed': !props.unpack,
      },
    ]"
  >
    <i class="fas fa-copy"></i>
    Duplicate
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Duplicate Ingredient"
    @close="closeIngredient()"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="duplicateIngredient()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4 md:col-span-2">
            <label for="itemImages" class="block text-sm font-medium text-gray-700"
              >Upload Image</label
            >
            <input
              type="file"
              id="itemImages"
              @change="handleImageUpload"
              multiple
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4 md:col-span-2">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <div class="flex mt-1">
              <input
                type="text"
                id="ProductName"
                required
                v-model="ingredientForm.name"
                :disabled="!hasPermission('Override_Ingredient_Name')"
                placeholder="Input Ingredient Name"
                :class="
                  hasPermission('Override_Ingredient_Name')
                    ? 'bg-white rounded-l'
                    : ' bg-gray-200 rounded'
                "
                class="p-2 border rounded-l w-full bg-gray-200"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Category</label
            >
            <select
              class="mt-1 p-2 border rounded-md w-full"
              v-model="ingredientForm.ingredient_category_id"
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
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Unit</label
            >
            <select
              v-model="ingredientForm.unit_id"
              placeholder="Select Unit"
              class="mt-1 p-2 border rounded-md w-full"
            >
              <option value="0">--Select Unit--</option>
              <option v-for="unit in units" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </select>
          </div>
          <!-- <div class="mb-4 md:col-span-2">
            <label
              for="ProductName"
              class="block text-sm font-medium text-gray-700"
              >Cost Price</label
            >
            <input
              type="number"
              id="ProductName"
              required
              v-model="ingredientForm.cost_price"
              step="any"
              placeholder="Input Cost Price"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div> -->
          <div class="mb-4 md:col-span-2">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Cost Price</label
            >
            <div class="flex mt-1">
              <input
                type="number"
                id="ProductName"
                required
                step="any"
                v-model="ingredientForm.cost_price"
                :disabled="!hasPermission('Override_Cost_Price')"
                placeholder="Input Ingredient Name"
                :class="
                  hasPermission('Override_Cost_Price')
                    ? 'bg-white rounded-l'
                    : ' bg-gray-200 rounded'
                "
                class="p-2 border rounded-l w-full bg-gray-200"
              />
              <!-- <OverrideCostPrice v-if="hasPermission('Override_Cost_Price')" :key="ingredientForm.ingredient_id" :ingredient_id="ingredientForm.ingredient_id" :cost_price="ingredientForm.cost_price" /> -->
            </div>
          </div>
          <!-- <div class="mb-4 md:col-span-2">
            <label
              for="ProductName"
              class="block text-sm font-medium text-gray-700"
              >Retail Price</label
            >
            <input
              type="number"
              id="ProductName"
              required
              v-model="ingredientForm.ingredient_retail"
              step="any"
              placeholder="Input Retail Price"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div> -->
          <div class="mb-4 md:col-span-2">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Stock Limit</label
            >
            <input
              type="number"
              id="ProductName"
              required
              step="any"
              v-model="ingredientForm.stock_limit"
              placeholder="Input Stock Limit"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <!-- Toggle for Allow Receiving -->
          <div class="mb-4 md:col-span-2">
            <label class="inline-flex items-center text-sm font-medium text-gray-700">
              <div
                class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer"
                :class="
                  ingredientForm.is_allow_to_receiving ? 'bg-blue-500' : 'bg-gray-300'
                "
                @click="
                  ingredientForm.is_allow_to_receiving = !ingredientForm.is_allow_to_receiving
                "
              >
                <div
                  class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"
                  :class="
                    ingredientForm.is_allow_to_receiving ? 'transform translate-x-6' : ''
                  "
                ></div>
              </div>
              <span class="ml-3">Allow Receiving</span>
            </label>
          </div>

          <!-- Checkbox for Trimming -->
          <!-- <div class="mb-4 md:col-span-2">
            <label for="isTrimming" class="inline-flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                id="isTrimming"
                v-model="ingredientForm.is_trimming"
                class="mr-2"
              />
              Ingredient With Trimming?
            </label>
          </div> -->

          <!-- Trimming Destination - Hidden if not trimming -->
          <div class="mb-4 md:col-span-2">
            <label
              for="TrimmingDestination"
              class="block text-sm font-medium text-gray-700"
              >Type</label
            >
            <select
              v-model="ingredientForm.type"
              class="mt-1 p-2 border rounded-md w-full"
            >
              <option value="0">--Select Type--</option>
              <option value="1">Ingredient</option>
              <option value="2">Production</option>
              <option value="3">Butcher</option>
            </select>
          </div>

          <div class="mb-4 md:col-span-2">
            <label for="remarks" class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              v-model="ingredientForm.description"
              placeholder="Input Description"
              class="mt-1 p-2 border rounded-md w-full"
            ></textarea>
          </div>
        </div>
        <div class="flex items-center justify-center my-6 mt-0">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="mx-4 text-gray-400 text-sm font-semibold"
            >Warehouse Locations</span
          >
          <div class="flex-grow border-t border-gray-400"></div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <label
            v-for="(wh, index) in warehouses"
            :key="wh.warehouseId"
            class="flex items-center space-x-2 p-2 border rounded cursor-pointer"
            :class="{
              'bg-blue-100 border-blue-500': ingredientForm.warehouse_ids?.includes(
                wh.warehouseId
              ),
            }"
          >
            <input
              type="checkbox"
              :value="wh.warehouseId"
              v-model="ingredientForm.warehouse_ids"
              class="form-checkbox accent-blue-500"
            />
            <span class="text-sm">{{ wh.warehouseName }}</span>
          </label>
        </div>
        <div class="flex items-center justify-center my-6 mt-0">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="mx-4 text-gray-400 text-sm font-semibold">Unpack Details</span>
          <div class="flex-grow border-t border-gray-400"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Unpack Ingredient</label
            >
            <SearchDropdown
              apiEndpoint="ingredients/search-name-only"
              :searchModel="searchIngredient"
              :key="ingredientForm.unpack_ingredient_name"
              placeholder="Search Ingredient"
              itemLabel="name"
              itemId="id"
              :defaultValue="ingredientForm.unpack_ingredient_name"
              inputId="ingredientName"
              formatLabel="parenthesis"
              className="focus-visible:bg-yellow-100 p-2 w-full mb-2 mt-1 border"
              @item-selected="(data) => fillIngredientForm(data)"
              dataKey="ingredients"
              returnName="['name']"
            />
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Quantity Per Unit</label
            >
            <div class="flex items-center mb-2">
              <input
                type="number"
                step="any"
                id="ProductName"
                required
                v-model="ingredientForm.unpack_quantity"
                placeholder="Input Quantity Per Unit"
                class="mt-1 p-2 border rounded-l w-full"
              />
              <button
                type="button"
                v-if="ingredientForm.unpack_ingredient_id > 0"
                class="bg-red-500 p-2 text-white mt-1 rounded-r"
              >
                {{ ingredientForm.unpack_unit_abbre }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { VUE_APP_API_URL, UNITS } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

import OverrideCostPrice from "../Actions/OverrideCostPrice.vue";
import IngImageViewer from "../Actions/IngImageViewer.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
  unpack: {
    type: Boolean,
    default: false,
  },
});
const isAddModalOpen = ref(false);
const units = ref([]);
const imageFiles = ref([]);
const categories = ref([]);
const warehouses = ref([]);
const trimmingIngredients = ref([]);

const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});

const ingredientForm = ref({
  item_name: "",
  name:"",
  description: "",
  unit_id: 0,
  cost_price: 0,
  ingredient_id: 0,
  ingredient_retail: 0,
  ingredient_category_id: 0,
  unit_id: 0,
  is_trimming: false,
  stock_limit: 0,
  sub_ingredient_id: 0, // New field for trimming destination
  type: 0,
  ingredient_images: [],
  unpack_ingredient_id: 0, // New field for trimming destination
  unpack_ingredient_name: 0, // New field for trimming destination
  unpack_unit_abbre: "", // New field for unit abbreviation
  unpack_quantity: 0, // New field for unpack quantity
  unit_abbre: "", // New field for unit abbreviation
  is_allow_to_receiving: false,
  warehouse_ids: [],
  is_add_to_zoho_books: 0,
});
const editBehavior = () => {
  resetForm();
  fillForm();
  unitsDropdown();
  trimmingsDropdown();
  ingredientsCategoryDropdown();
  getWarehouses();
  isAddModalOpen.value = true;
};

const closeIngredient = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};
const fillForm = () => {
  const data = props.data;

  ingredientForm.value.ingredient_id = data.id;
  ingredientForm.value.ingredient_id_number = data.ingredientIdNumber ?? "";
  // ingredientForm.value.name = data.name + " (Copy)";
  ingredientForm.value.item_name = data.itemName;
  ingredientForm.value.name = data.itemName;
  ingredientForm.value.description = data.description;
  ingredientForm.value.ingredient_category_id = data.categoryId;
  ingredientForm.value.unit_id = data.unitId;
  ingredientForm.value.cost_price = data.costPrice;
  ingredientForm.value.ingredient_images = [];
  ingredientForm.value.unit_abbre = data.unitAbbre;
  ingredientForm.value.ingredient_retail = data.ingredientRetail ?? 0;
  ingredientForm.value.unpack_ingredient_id = data.unpackIngredientId ?? 0;
  ingredientForm.value.unpack_unit_abbre = data.unpackIngredientUnitAbbre ?? "";
  ingredientForm.value.unpack_ingredient_name = data.unpackIngredientName ?? "";
  ingredientForm.value.unpack_quantity = data.unpackQuantity ?? 0;
  ingredientForm.value.stock_limit = data.stockLimit ?? 0;
  ingredientForm.value.type = data.type ?? 0;
  ingredientForm.value.is_allow_to_receiving = data.isAllowToReceiving ?? false;
};

const resetForm = () => {
  ingredientForm.value = {
    name: "",
    description: "",
    name:"",
    unit_id: 0,
    cost_price: 0,
    ingredient_id: 0,
    ingredient_retail: 0,
    ingredient_category_id: 0,
    unit_id: 0,
    is_trimming: false,
    stock_limit: 0,
    sub_ingredient_id: 0,
    type: 0,
    ingredient_images: [],
    unpack_ingredient_id: 0,
    unpack_ingredient_name: "",
    unpack_unit_abbre: "",
    unpack_quantity: 0,
    unit_abbre: "",
    is_allow_to_receiving: false,
    warehouse_ids: [],
  };
  imageFiles.value = [];
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const unitsDropdown = async () => {
  units.value = await UNITS();
};

//fillIngredientForm
const fillIngredientForm = (item) => {
  ingredientForm.value.unpack_ingredient_id = item.id ?? 0;
  ingredientForm.value.unpack_ingredient_name = item.name;
  ingredientForm.value.unpack_unit_abbre = item.unitAbbre ?? ""; // New field for unit abbreviation

  // Clear the search field
  searchIngredient.value.search = "";
};

const trimmingsDropdown = async () => {
  try {
    const formData = FormDx({ id: "Buang" });
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/dropdown-trimmings`,
      formData,
      BearToken(token)
    );
    trimmingIngredients.value = response.data.ingredients;
  } catch (error) {
    console.log(error);
  }
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
const duplicateIngredient = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we duplicate the ingredient.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    ingredientForm.value.is_trimming = ingredientForm.value.is_trimming ? 1 : 0;
    ingredientForm.value.is_add_to_zoho_books = 0;
    ingredientForm.value.unpack_unit_id = 0;
    ingredientForm.value.unpack_ingredient_category_id = 0;
    ingredientForm.value.unpack_quantity = 0;
    ingredientForm.value.unpack_is_allow_to_receiving = 0;
    ingredientForm.value.unpack_stock_limit = 0;
    ingredientForm.value.is_allow_to_receiving = ingredientForm.value
      .is_allow_to_receiving
      ? 1
      : 0;
    const formData = FormDx(ingredientForm.value);

    // Append image files
    imageFiles.value.forEach((file) => {
      formData.append("ingredient_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/add`,
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

const getWarehouses = async () => {
  try {
    warehouses.value = [];
    const response = await axios.post(
      `${VUE_APP_API_URL}users/warehouses-dropdown`,
      { id: 0 }, // Assuming you want to fetch all warehouses
      BearToken(token)
    );
    warehouses.value = response.data.userWarehouses || [];
  } catch (error) {
    console.error("Error fetching warehouses:", error);
  }
};
</script>
