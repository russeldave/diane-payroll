<template>
  <button
    @click.prevent="editBehavior()"
    type="button"
    :disabled="props.data.unpackIngredientId == 0 || !props.unpack"
    :title="
      props.data.unpackIngredientId == 0 || !props.unpack
        ? `Can't unpack! Please assign unpack ingredient!`
        : `Unpack Ingredient`
    "
    :class="[
      'bg-red-700 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap',
      className,
      {
        'disabled:opacity-50 disabled:cursor-not-allowed':
          props.data.unpackIngredientId == 0 || !props.unpack,
      },
    ]"
  >
    <i class="fas fa-sync"></i>
    Transfer
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Transfer Ingredient"
    @close="closeIngredient()"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="unpackIngredient()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="mb-4 md:col-span-2">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Ingredient Name</label
            >
            <div class="flex mt-1">
              <input
                type="text"
                id="ProductName"
                required
                v-model="ingredientForm.ingredient_name"
                disabled
                placeholder="Input Ingredient Name"
                class="p-2 border rounded-l w-full bg-gray-200 bg-gray-200"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Cost Price</label
            >
            <div class="flex items-center mt-1 mb-2">
              <input
                type="number"
                step="any"
                id="ProductName"
                required
                v-model="ingredientForm.cost_price"
                disabled
                placeholder="Input Ingredient Unpack Quantity"
                class="p-2 border rounded-l w-full bg-gray-200"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Remaining Stocks</label
            >
            <div class="flex mt-1">
              <input
                type="text"
                id="ProductName"
                required
                v-model="ingredientForm.stocks"
                disabled
                placeholder="Input Ingredient Stocks"
                class="p-2 border rounded-l w-full bg-gray-200 bg-gray-200"
              />
              <button type="" class="bg-red-500 p-2 text-white rounded-r">
                {{ ingredientForm.unit_abbre }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center my-6 mt-0">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="mx-4 text-gray-400 text-sm font-semibold">Unpack Details</span>
          <div class="flex-grow border-t border-gray-400"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="mb-4 md:col-span-2">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Unpack Ingredient</label
            >
            <div class="flex mt-1 mb-2">
              <input
                type="text"
                id="ProductName"
                required
                v-model="ingredientForm.unpack_ingredient_name"
                disabled
                placeholder="Input Unpacked Ingredient Name"
                class="p-2 border rounded-l w-full bg-gray-200"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Unpack Cost Price</label
            >
            <div class="flex items-center mt-1 mb-2">
              <small hidden>{{
                (ingredientForm.unpack_cost_price = (
                  ingredientForm.cost_price / ingredientForm.unpack_quantity
                ).toFixed(2))
              }}</small>
              <input
                type="number"
                step="any"
                id="ProductName"
                required
                v-model="ingredientForm.unpack_cost_price"
                disabled
                placeholder="Input Ingredient Unpack Quantity"
                class="p-2 border rounded-l w-full bg-gray-200"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Quantity Per Unit</label
            >
            <div class="flex items-center mt-1 mb-2">
              <input
                type="number"
                step="any"
                id="ProductName"
                required
                v-model="ingredientForm.unpack_quantity"
                disabled
                placeholder="Input Ingredient Unpack Quantity"
                class="p-2 border rounded-l w-full bg-gray-200"
              />
              <button type="button" class="bg-red-500 p-2 text-white rounded-r">
                {{ ingredientForm.unpack_unit_abbre }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center my-6 mt-0">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="mx-4 text-gray-400 text-sm font-semibold">Quantity To Unpack</span>
          <div class="flex-grow border-t border-gray-400"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Unpack Quantity</label
            >
            <div class="flex items-center mb-2">
              <input
                type="number"
                step="any"
                id="ProductName"
                required
                v-model="ingredientForm.to_unpack_quantity"
                placeholder="Input Ingredient Unpack Quantity"
                class="p-2 border rounded-l w-full"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Unpack Total</label
            >
            <div class="flex items-center mb-2">
              <small hidden>{{
                (ingredientForm.to_unpack_total =
                  ingredientForm.to_unpack_quantity * ingredientForm.unpack_quantity)
              }}</small>
              <input
                type="number"
                step="any"
                id="ProductName"
                required
                disabled
                v-model="ingredientForm.to_unpack_total"
                placeholder="Ingredient Unpack Quantity Total"
                class="p-2 border rounded-l w-full bg-gray-200"
              />
              <button type="button" class="bg-red-500 p-2 text-white rounded-r">
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
            Unpack Ingredient
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

import OverrideIngredientName from "../Actions/OverrideIngredientName.vue";
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
const trimmingIngredients = ref([]);
const ingredientForm = ref({
  ingredient_name: "",
  unpack_ingredient_id: 0, // New field for trimming destination
  unpack_ingredient_name: 0, // New field for trimming destination
  unpack_quantity: 0, // New field for unpack quantity
  unit_abbre: "", // New field for unit abbreviation
  to_unpack_quantity: 0, // New field for unpack quantity
});
const editBehavior = () => {
  resetForm();
  fillForm();
  unitsDropdown();
  trimmingsDropdown();
  ingredientsCategoryDropdown();
  isAddModalOpen.value = true;
};

const closeIngredient = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};
const fillForm = () => {
  const data = props.data;

  console.log(data);
  ingredientForm.value.ingredient_id = data.id;
  ingredientForm.value.ingredient_id_number = data.ingredientIdNumber ?? "";
  ingredientForm.value.ingredient_name = data.name;
  ingredientForm.value.unit_abbre = data.unitAbbre;
  ingredientForm.value.cost_price = data.costPrice ?? 0; // New field for trimming destination
  ingredientForm.value.unpack_ingredient_id = data.unpackIngredientId ?? 0; // New field for trimming destination
  ingredientForm.value.unpack_ingredient_name = data.unpackIngredientName ?? ""; // New field for trimming destination
  ingredientForm.value.unpack_unit_abbre = data.unpackIngredientUnitAbbre ?? ""; // New field for trimming destination
  ingredientForm.value.unpack_cost_price = data.unpackIngredientCostPrice ?? 0; // New field for trimming destination
  ingredientForm.value.unpack_quantity = data.unpackQuantity ?? 0; // New field for unpack quantity
  ingredientForm.value.type = data.type ?? 0;
  ingredientForm.value.stocks = data.type ?? 0;
  ingredientForm.value.to_unpack_quantity = 0;
};

const resetForm = () => {
  ingredientForm.value = {
    ingredient_name: "",
    unpack_unit_abbre: "", // New field for trimming destination
    unpack_ingredient_id: 0, // New field for trimming destination
    unpack_ingredient_name: 0, // New field for trimming destination
    unpack_quantity: 0, // New field for unpack quantity
    to_unpack_quantity: 0, // New field for unpack quantity
    unit_abbre: "", // New field for unit abbreviation
  };
  imageFiles.value = []; // Reset the image files array
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
const unpackIngredient = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we unpack the ingredient.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(ingredientForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/unpack`,
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
</script>
