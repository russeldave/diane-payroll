<template>
  <button
    @click.prevent="editBehavior()"
    type="button"
  >
    <!-- :class="[
      'bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded-l px-4 float-end text-nowrap ',
      className,
    ]" -->
    <i class="fas fa-eye"></i>test
    <!-- View -->
  </button>

  <!-- View Ingredient Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'4xl'"
    title="View Ingredient Details"
    @close="isAddModalOpen = false"
  >
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column: Image Viewer -->
        <div class="bg-gray-50 p-4 rounded-lg h-fit">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Ingredient Image</h3>
          <div class="max-h-[400px] overflow-y-auto">
            <IngImageViewer
              v-if="ingredientForm.ingredient_id"
              :key="ingredientForm.ingredient_id"
              :ingredient_id="ingredientForm.ingredient_id"
              :thumbnail="ingredientForm.thumb_nail"
              :canDeleteImage="true"
            />
          </div>
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-700">Additional Information</h3>
            </div>
            <div class="p-4">
              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Description</label
                >
                <textarea
                  v-model="ingredientForm.description"
                  disabled
                  rows="4"
                  class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Ingredient Details -->
        <div class="space-y-6 h-fit">
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-700">Basic Information</h3>
            </div>
            <div class="p-4 space-y-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  v-model="ingredientForm.ingredient_name"
                  disabled
                  class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                />
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Category</label
                >
                <input
                  type="text"
                  v-model="ingredientForm.category_name"
                  disabled
                  class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                />
              </div>

              <!-- Unit -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Unit</label>
                <input
                  type="text"
                  v-model="ingredientForm.unit_name"
                  disabled
                  class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-700">Inventory Details</h3>
            </div>
            <div class="p-4 space-y-4">
              <!-- Cost Price -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Cost Price</label
                >
                <input
                  type="number"
                  v-model="ingredientForm.cost_price"
                  disabled
                  class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                />
              </div>

              <!-- Stock Limit -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Stock Limit</label
                >
                <input
                  type="number"
                  v-model="ingredientForm.stock_limit"
                  disabled
                  class="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, UNITS } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

import IngImageViewer from "../Actions/IngImageViewer.vue";
const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
});
const isAddModalOpen = ref(false);
const units = ref([]);
const imageFiles = ref([]);
const categories = ref([]);
const ingredientForm = ref({
  ingredient_name: "",
  description: "",
  unit_id: 0,
  cost_price: 0,
  ingredient_id: 0,
  ingredient_category_id: 0,
  unit_id: 0,
  stock_limit: 0,
  ingredient_images: [],
});
const editBehavior = () => {
  resetForm();
  fillForm();
  unitsDropdown();
  // ingredientsCategoryDropdown();
  isAddModalOpen.value = true;
};
const fillForm = () => {
  const data = props.data;

  console.log(data);
  (ingredientForm.value.ingredient_id = data.id),
    (ingredientForm.value.ingredient_name = data.name);
  ingredientForm.value.description = data.description;
  ingredientForm.value.ingredient_category_id = data.categoryId;
  ingredientForm.value.unit_id = data.unitId;
  ingredientForm.value.unit_name = data.unitName;
  ingredientForm.value.category_name = data.ingredientCategoryName ?? "-";
  ingredientForm.value.cost_price = data.costPrice;
  ingredientForm.value.thumb_nail = data.thumbNail;
  ingredientForm.value.is_trimming = data.isTrimming;
  ingredientForm.value.stock_limit = data.stockLimit ?? 0;
  ingredientForm.value.sub_ingredient_id = data.subIngredientId ?? 0;
  ingredientForm.value.sub_ingredient_name = data.subIngredientName ?? "-";
  ingredientForm.value.ingredient_images = [];
};

const resetForm = () => {
  ingredientForm.value.ingredient_id = 0;
  ingredientForm.value.ingredient_name = "";
  ingredientForm.value.description = "";
  ingredientForm.value.ingredient_category_id = 0;
  ingredientForm.value.unit_id = 0;
  ingredientForm.value.cost_price = 0;
  ingredientForm.value.thumb_nail = [];
  ingredientForm.value.is_trimming = false;
  ingredientForm.value.stock_limit = 0;
  ingredientForm.value.sub_ingredient_name = "";
  ingredientForm.value.ingredient_images = [];
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
</script>
