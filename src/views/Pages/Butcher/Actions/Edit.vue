<template>
  <!-- Button to trigger modal and fill form with data -->
  <button
    @click.prevent="editBehavior()"
    type="button"
    class="bg-yellow-500 text-white hover:opacity-70 focus:bg-red-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap"
  >
    <i class="fas fa-edit"></i>
    Edit
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'xl'"
    title="Edit Butcher"
    @close="closeModal()"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editButcher()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Image Upload -->
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

          <!-- Butcher Name -->
          <div class="mb-4 md:col-span-2">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Butcher Name
              <span class="text-red-500 italic">  {{props.data.ingredientIdNumber}}</span>
            </label>
            <div class="flex mt-1">
              <input
                type="text"
                id="ProductName"
                required
                min="0"
                v-model="butcherForm.ingredient_name"
                :disabled="!hasPermission('Override_Butcher_Name')"
                placeholder="Input BUtcher Name"
                :class="
                  hasPermission('Override_Butcher_Name')
                    ? 'bg-white rounded-l'
                    : ' bg-gray-200 rounded'
                "
                class="p-2 border w-full"
              />
              <OverrideButcherName
                v-if="hasPermission('Override_Butcher_Name')"
                :key="butcherForm.ingredient_id_butcher"
                :data="butcherForm"
              />
            </div>
            <!-- <input type="text" id="ProductName" required v-model="butcherForm.name" placeholder="Input Name" class="mt-1 p-2 border rounded-md w-full" /> -->
          </div>

          <!-- Category -->
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Category</label
            >
            <select
              class="mt-1 p-2 border rounded-md w-full"
              v-model="butcherForm.ingredient_category_id"
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

          <!-- Unit -->
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Unit</label
            >
            <select
              v-model="butcherForm.unit_id"
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
            <label for="ProductName" class="block text-sm font-medium text-white"
              >Warehouse</label
            >
            <select
              id="warehouseName"
              v-model="marinationForm.warehouse_id"
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
                v-model="butcherForm.cost_price"
                :disabled="!hasPermission('Override_Cost_Price')"
                placeholder="Input Ingredient Name"
                :class="
                  hasPermission('Override_Cost_Price')
                    ? 'bg-white rounded-l'
                    : ' bg-gray-200 rounded'
                "
                class="p-2 border rounded-l w-full bg-gray-200"
              />
              <OverrideCostPrice
                v-if="hasPermission('Override_Cost_Price')"
                :key="butcherForm.ingredient_id_butcher"
                :ingredient_id_butcher="butcherForm.ingredient_id_butcher"
                :cost_price="butcherForm.cost_price"
              />
            </div>
          </div>

          <!-- Stock Limit -->
          <div class="mb-4 md:col-span-2">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Stock Limit</label
            >
            <input
              type="number"
              id="ProductName"
              required
              step="any"
              v-model="butcherForm.stock_limit"
              placeholder="Input Stock Limit"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <!-- Trimming Destination - Hidden if not trimming -->
          <div class="mb-4 md:col-span-2">
            <label
              for="TrimmingDestination"
              class="block text-sm font-medium text-gray-700"
              >Trimming Destination</label
            >
            <SearchDropdown
              apiEndpoint="ingredients/search-name-only"
              :searchModel="searchTrimmingIngredient"
              :key="butcherForm.ingredient_id_trimming"
              placeholder="Search Trimming Ingredient"
              itemLabel="name"
              itemId="id"
              :defaultValue="butcherForm.ingredient_trimming_name"
              inputId="ingredientName"
              formatLabel="parenthesis"
              className="focus-visible:bg-yellow-100 p-2 w-full border"
              @item-selected="(data) => fillTrimmingIngredient(data)"
              dataKey="ingredients"
              returnName="['name']"
            />
          </div>

          <!-- Raw Ingredient -->
          <div class="mb-4 md:col-span-2">
            <label
              for="TrimmingDestination"
              class="block text-sm font-medium text-gray-700"
              >Raw Ingredient</label
            >
            <SearchDropdown
              apiEndpoint="ingredients/search-name-only"
              :searchModel="searchProductionIngredient"
              :key="butcherForm.ingredient_id_raw"
              placeholder="Search Raw Ingredient"
              itemLabel="name"
              itemId="id"
              :defaultValue="butcherForm.ingredient_raw_name"
              inputId="ingredientName"
              formatLabel="parenthesis"
              className="focus-visible:bg-yellow-100 p-2 w-full border"
              @item-selected="(data) => fillRawIngredient(data)"
              dataKey="ingredients"
              returnName="['name']"
            />
          </div>

          <!-- Description -->
          <div class="mb-4 md:col-span-2">
            <label for="remarks" class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              v-model="butcherForm.description"
              placeholder="Input Description"
              class="mt-1 p-2 border rounded-md w-full"
            ></textarea>
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
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { VUE_APP_API_URL, UNITS } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";

import OverrideButcherName from "../Actions/OverrideButcherName.vue";
import OverrideCostPrice from "../Actions/OverrideCostPrice.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  data: Object, // Accept the data prop to be used in edit mode
});

const isAddModalOpen = ref(false);
const units = ref([]);
const imageFiles = ref([]);
const categories = ref([]);
const warehouses = ref([]);
const trimmingIngredients = ref([]);
const butcherForm = ref({
  ingredient_id_butcher: 0,
  name: "",
  description: "",
  unit_id: 0,
  ingredient_category_id: 0,
  stock_limit: 0,
  ingredient_id_raw: 0,
  ingredient_raw_name: "",
  ingredient_id_number:''
});

const searchTrimmingIngredient = ref({ search: "", page_num: 1, itemsperpage: 10 });
const searchProductionIngredient = ref({ search: "", page_num: 1, itemsperpage: 10 });

const editBehavior = () => {
  resetForm();
  fillForm();
  unitsDropdown();
  ingredientsCategoryDropdown();
  getWarehouses();
  isAddModalOpen.value = true;
};
const closeModal = () => {
  isAddModalOpen.value = false;
  resetForm();
  emits("transaction_id", Math.random());
};
const fillForm = () => {
  const data = props.data;

  butcherForm.value.ingredient_id_butcher = data.id;
  butcherForm.value.ingredient_id_number = data.ingredientIdNumber ?? 0;
  butcherForm.value.ingredient_name = data.name;
  butcherForm.value.description = data.description;
  butcherForm.value.unit_id = data.unitId;
  butcherForm.value.warehouse_id = data.warehouseId;
  butcherForm.value.ingredient_category_id = data.categoryId;
  butcherForm.value.stock_limit = data.stockLimit ?? 0;
  butcherForm.value.cost_price = data.costPrice ?? 0;
  butcherForm.value.ingredient_id_raw = data.ingredientIdRaw ?? 0;
  butcherForm.value.ingredient_raw_name = data.rawName ?? "";
  butcherForm.value.ingredient_id_trimming = data.ingredientIdTrimming ?? 0;
  butcherForm.value.ingredient_trimming_name = data.trimmingName ?? "";
};

const resetForm = () => {
  butcherForm.value = {
    ingredient_id_butcher: 0,
    name: "",
    description: "",
    cost_price: 0,
    unit_id: 0,
    ingredient_category_id: 0,
    stock_limit: 0,
    ingredient_id_raw: 0,
    ingredient_raw_name: "",
  };
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const fillRawIngredient = (item) => {
  butcherForm.value.ingredient_id_raw = item.id ?? 0;
  butcherForm.value.ingredient_raw_name = item.name;
  searchProductionIngredient.value.search = "";
};

const fillTrimmingIngredient = (item) => {
  butcherForm.value.ingredient_id_trimming = item.id ?? 0;
  butcherForm.value.ingredient_trimming_name = item.name;
  searchTrimmingIngredient.value.search = "";
};

const unitsDropdown = async () => {
  units.value = await UNITS();
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

const editButcher = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update the butcher.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(butcherForm.value);
    imageFiles.value.forEach((file) => {
      formData.append("ingredient_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/edit-butcher`,
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
