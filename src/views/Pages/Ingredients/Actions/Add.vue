<template>
  <button
    @click.prevent="addBehavior()"
    type="button"
    :class="[
      'bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm  md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-plus"></i>
    &nbsp;Add Ingredient
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'xl'"
    title="New Ingredient"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addIngredient()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-1 md:col-span-2">
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
          <div class="mb-1 md:col-span-2">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              type="text"
              id="ProductName"
              required
              v-model="ingredientForm.name"
              placeholder="Input Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="grid grid-cols-3 md:col-span-2 gap-2">
            <div class="mb-1">
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
            <div class="mb-1">
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
            <div class="mb-1">
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
          </div>
          <!-- Toggle for Allow Receiving -->
          <div class="mb-1 md:col-span-1">
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

           <!-- Toggle for Allow Receiving -->
           <div class="mb-1 md:col-span-1">
            <label class="inline-flex items-center text-sm font-medium text-gray-700">
              <div
                class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer"
                :class="
                  ingredientForm.is_add_to_zoho_books ? 'bg-blue-500' : 'bg-gray-300'
                "
                @click="
                  ingredientForm.is_add_to_zoho_books = !ingredientForm.is_add_to_zoho_books
                "
              >
                <div
                  class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"
                  :class="
                    ingredientForm.is_add_to_zoho_books ? 'transform translate-x-6' : ''
                  "
                ></div>
              </div>
              <span class="ml-3">Add to ZOHO Books?</span>
            </label>
          </div>

          <div class="mb-1 md:col-span-2">
            <label
              for="TrimmingDestination"
              class="block text-sm font-medium text-gray-700"
              >Type
                <span class="italic text-red-600">(Ingredient, Butchery, Production)</span>
              </label
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

          <div class="mb-1 md:col-span-2">
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
        <div class="mb-4">
          <label for="ProductName" class="block text-sm font-medium text-gray-700"
            >Unpack Ingredient</label
          >
          <SearchDropdown
            apiEndpoint="ingredients/search-name-only-stock-card"
            :searchModel="searchIngredient"
            :key="ingredientForm.unpack_ingredient_name"
            placeholder="Search Ingredient"
            itemLabel="name"
            itemId="id"
            :defaultValue="ingredientForm.unpack_ingredient_name"
            inputId="ingredientName"
            formatLabel="parenthesis"
            className="focus-visible:bg-yellow-100 p-2 mt-1 mb-2 w-full border"
            @item-selected="(data) => fillIngredientForm(data)"
            dataKey="ingredients"
            returnName="['itemCompleteName']"
          />
        </div>
        <div class="grid grid-cols-3 md:col-span-2 gap-2 mb-4">
          <div class="mb-1">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Category</label
            >
            <select
              class="mt-1 p-2 border rounded-md w-full"
              v-model="ingredientForm.unpack_ingredient_category_id"
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
          <div class="mb-1">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Unit</label
            >
            <select
              v-model="ingredientForm.unpack_unit_id"
              placeholder="Select Unit"
              class="mt-1 p-2 border rounded-md w-full"
            >
              <option value="0">--Select Unit--</option>
              <option v-for="unit in units" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </select>
          </div>
          <div class="mb-1">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >Stock Limit</label
            >
            <input
              type="number"
              id="ProductName"
              required
              step="any"
              v-model="ingredientForm.unpack_stock_limit"
              placeholder="Input Stock Limit"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
        <!-- Toggle for Allow Receiving -->
        <div class="mb-4 md:col-span-2">
          <label class="inline-flex items-center text-sm font-medium text-gray-700">
            <div
              class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer"
              :class="
                ingredientForm.unpack_is_allow_to_receiving
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              "
              @click="
                ingredientForm.unpack_is_allow_to_receiving = !ingredientForm.unpack_is_allow_to_receiving
              "
            >
              <div
                class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"
                :class="
                  ingredientForm.unpack_is_allow_to_receiving
                    ? 'transform translate-x-6'
                    : ''
                "
              ></div>
            </div>
            <span class="ml-3">Allow Receiving</span>
          </label>
        </div>

        <div class="mb-4 md:col-span-2">
          <label for="remarks" class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            v-model="ingredientForm.unpack_description"
            placeholder="Input Description"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
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
              {{ ingredientForm.unit_abbre }}
            </button>
          </div>
        </div>
        <div class="mx4 text-center">
        <span class="mx-4 text-gray-400 text-sm font-semibold"
          >Warehouse Locations for Unpack Ingredient</span
        >
        </div>
        <div class="flex-grow border-t border-gray-400">
        </div>
         <div class="grid grid-cols-3 gap-2">
          <label
            v-for="(wh, index) in unpackWarehouses"
            :key="wh.warehouseId"
            class="flex items-center space-x-2 p-2 border rounded cursor-pointer"
            :class="{
              'bg-blue-100 border-blue-500': ingredientForm.unpack_warehouse_ids?.includes(
                wh.warehouseId
              ),
            }"
          >
            <input
              type="checkbox"
              :value="wh.warehouseId"
              v-model="ingredientForm.unpack_warehouse_ids"
              class="form-checkbox accent-blue-500"
            />
            <span class="text-sm">{{ wh.warehouseName }}</span>
          </label>
        </div>

        <div class="flex items-center justify-end bg-gray100 py-4 rounded-b">
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
const unpackWarehouses = ref([]);
const trimmingIngredients = ref([]);

const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});

const ingredientForm = ref({
  name: "",
  description: "",
  unit_id: 0,
  cost_price: 0,
  ingredient_category_id: 0,
  unit_id: 0,
  ingredient_images: [],
  is_trimming: false,
  stock_limit: 0,
  type: 0,
  unit_abbre: "",
  is_allow_to_receiving: false,
  is_add_to_zoho_books:false,
  warehouse_ids: [],
  unpack_warehouse_ids: [],

  unpack_ingredient_id: 0,
  unpack_ingredient_name: "",
  unpack_description: "",
  unpack_unit_id: 0,
  unpack_ingredient_category_id: 0,
  unpack_quantity: 0,
  unpack_is_allow_to_receiving: true,
  unpack_stock_limit: 0,
});

const addBehavior = () => {
  resetForm();
  unitsDropdown();
  ingredientsCategoryDropdown();
  trimmingsDropdown();
  getWarehouses();
  isAddModalOpen.value = true;
};

const resetForm = () => {
  ingredientForm.value = {
    name: "",
    description: "",
    unit_id: 0,
    cost_price: 0,
    ingredient_category_id: 0,
    unit_id: 0,
    ingredient_images: [],
    is_trimming: false,
    stock_limit: 0,
    type: 0,
    unit_abbre: "",
    is_allow_to_receiving: false,
    is_add_to_zoho_books:false,
    warehouse_ids: [],
    unpack_warehouse_ids: [],

    //unpack
    unpack_ingredient_id: 0,
    unpack_ingredient_name: "",
    unpack_description: "",
    unpack_unit_id: 0,
    unpack_ingredient_category_id: 0,
    unpack_quantity: 0,
    unpack_is_allow_to_receiving: true,
    unpack_stock_limit: 0,
  };
  imageFiles.value = [];
};

// Toggle Warehouse
const toggleWarehouse = (warehouse) => {
  if (ingredientForm.value.warehouse_ids.includes(warehouse)) {
    ingredientForm.value.warehouse_ids = ingredientForm.value.warehouse_ids.filter(
      (a) => a !== warehouse
    );
  } else {
    ingredientForm.value.warehouse_ids.push(warehouse);
  }
};
const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const unitsDropdown = async () => {
  units.value = await UNITS();
};

//fillIngredientForm
const fillIngredientForm = (item) => {
  console.log(item);
  //get ingredient id
  ingredientForm.value.unpack_ingredient_id = item.id;

  // 1. get ingredient name from
  ingredientForm.value.unpack_ingredient_name = item.itemCompleteName;

  // 2. get unit abbreviation, fallback to empty string if missing
  ingredientForm.value.unit_abbre = item.unitAbbre ?? "";

  // 3. get description
  ingredientForm.value.unpack_description = item.description;

  // 4. get unit ID
  ingredientForm.value.unpack_unit_id = item.unitId;

  // 5. get ingredient category ID
  ingredientForm.value.unpack_ingredient_category_id = item.categoryId;

  // 6. get allow-to-receiving flag
  ingredientForm.value.unpack_is_allow_to_receiving = item.isAllowToReceiving ?? 0;

  // 7. get stock limit
  ingredientForm.value.unpack_stock_limit = 0;

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

const formatPayload = () => {
  ingredientForm.value.is_trimming = ingredientForm.value.is_trimming ? 1 : 0;
  ingredientForm.value.is_allow_to_receiving = ingredientForm.value.is_allow_to_receiving
    ? 1
    : 0;
  ingredientForm.value.is_add_to_zoho_books = ingredientForm.value.is_add_to_zoho_books
    ? 1
    :0;
  ingredientForm.value.unpack_is_allow_to_receiving = ingredientForm.value
    .unpack_is_allow_to_receiving
    ? 1
    : 0;
  ingredientForm.value.unpack_ingredient_name =
    ingredientForm.value.unpack_ingredient_id > 0
      ? ingredientForm.value.unpack_ingredient_name
      : searchIngredient.value.search;
  console.log(ingredientForm);
};

const addIngredient = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the ingredient.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    formatPayload();
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
    console.log(error);
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
    unpackWarehouses.value = response.data.userWarehouses || [];
  } catch (error) {
    console.error("Error fetching warehouses:", error);
  }
};
</script>
