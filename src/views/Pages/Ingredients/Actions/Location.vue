<template>
  <button
    @click.prevent="editBehavior()"
    type="button"
    :class="[
      'bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-pin"></i>
    Location
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Edit Ingredient"
    @close="closeIngredient()"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="editIngredient()" autocomplete="off">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-2">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <div class="flex mt-1">
              <input
                type="text"
                id="ProductName"
                required
                v-model="ingredientForm.ingredient_name"
                disabled
                placeholder="Input Ingredient Name"
                class="p-2 border rounded-l w-full bg-gray-200"
              />
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

const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});

const ingredientForm = ref({
  ingredient_id: 0,
  ingredient_name: "",
});
const editBehavior = () => {
  resetForm();
  getWarehouses();

  isAddModalOpen.value = true;
};

const closeIngredient = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};
const fillForm = () => {
  const data = props.data;

  console.log(data);
  (ingredientForm.value.ingredient_id = data.id),
    (ingredientForm.value.ingredient_name = data.name);
  ingredientForm.value.warehouse_ids = data.warehouseIds || [];
};

const resetForm = () => {
  ingredientForm.value = {
    ingredient_id: 0,
    warehouse_ids: [],
    ingredient_name: "",
  };
  imageFiles.value = [];
};

const editIngredient = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update the ingredient location.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    ingredientForm.value.is_trimming = ingredientForm.value.is_trimming ? 1 : 0;
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
      `${VUE_APP_API_URL}ingredients/edit`,
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
