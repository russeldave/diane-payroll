<template>
  <button
    @click.prevent="addBehavior()"
    type="button"
    :class="[
      'bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 w-full font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-plus"></i>
    Add Butcher
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'xl'"
    title="New Butcher"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addButcher()" autocomplete="off">
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
              >Butcher Cut Name</label
            >
            <input
              type="text"
              id="ProductName"
              required
              v-model="butcherForm.name"
              placeholder="Input Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
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
          <div class="mb-4 md:col-span-2">
            <label for="ProductName" class="block text-sm font-medium"
              >Warehouse</label
            >
            <select
              id="warehouseName"
              v-model="butcherForm.warehouse_id"
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
import Paginator from "@/views/Component/Pagination.vue";
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

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
});

const isAddModalOpen = ref(false);
const units = ref([]);
const imageFiles = ref([]);
const categories = ref([]);
const warehouses = ref([]);
const trimmingIngredients = ref([]);
const butcherForm = ref({
  name: "",
  description: "",
  unit_id: 0,
  cost_price: 0,
  ingredient_category_id: 0,
  unit_id: 0,
  ingredient_images: [],
  is_trimming: false, // New field for trimming checkbox
  stock_limit: 0,
  warehouese_id: 0,
  ingredient_id_raw: 0,
  ingredient_id_trimming: 0,
  warehouse_id: 0
});
const searchTrimmingIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const searchProductionIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const addBehavior = () => {
  resetForm();
  unitsDropdown();
  ingredientsCategoryDropdown();
  getWarehouses();
  trimmingsDropdown();
  isAddModalOpen.value = true;
};

const resetForm = () => {
  butcherForm.value.name = "";
  butcherForm.value.description = "";
  butcherForm.value.ingredient_category_id = 0;
  butcherForm.value.unit_id = 0;
  butcherForm.value.cost_price = 0;
  butcherForm.value.ingredient_images = [];
  (butcherForm.value.stock_limit = 0), (butcherForm.value.is_trimming = false); // Reset the trimming checkbox
  butcherForm.value.ingredient_id_trimming = 0; // Reset trimming destination
  butcherForm.value.ingredient_id_raw = 0; // Reset trimming destination
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const fillRawIngredient = (item) => {
  butcherForm.value.ingredient_id_raw = item.id ?? 0;
  butcherForm.value.ingredient_raw_name = item.name;
  butcherForm.value.unit = item.unitAbbre ?? "-";
  butcherForm.value.unit_name = item.unitName ?? "-";

  // Clear the search field
  searchProductionIngredient.value.search = "";
};
const fillTrimmingIngredient = (item) => {
  butcherForm.value.ingredient_id_trimming = item.id ?? 0;
  butcherForm.value.ingredient_trimming_name = item.name;
  butcherForm.value.unit = item.unitAbbre ?? "-";
  butcherForm.value.unit_name = item.unitName ?? "-";

  // Clear the search field
  searchTrimmingIngredient.value.search = "";
};
const unitsDropdown = async () => {
  units.value = await UNITS();
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

const addButcher = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the butcher.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    butcherForm.value.is_trimming = butcherForm.value.is_trimming ? 1 : 0;
    const formData = FormDx(butcherForm.value);

    // Append image files
    imageFiles.value.forEach((file) => {
      formData.append("ingredient_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/add-butcher`,
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
      `api/users/warehouses-dropdown`,
      { id: 0 }
    );
    warehouses.value = response.data.userWarehouses || [];
  } catch (error) {
    console.error("Error fetching warehouses:", error);
  }
};
</script>
