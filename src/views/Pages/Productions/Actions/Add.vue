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
    Add Productions
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="New Productions Ingredient"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-0">
      <form class="" @submit.prevent="addProductionIngredient()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-4">
          <div class="block bg-blue-400 p-4 md:min-h-screen">
            <h2 for="itemImages" class="block text-2xl font-medium text-white">
              Fill Productions Form.
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
                v-model="marinationForm.name"
                placeholder="Input Meal Name"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Category</label
              >
              <select
                class="mt-1 p-2 border rounded-md w-full"
                v-model="marinationForm.ingredient_category_id"
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
              <label for="LeagueName" class="block text-sm font-medium text-white"
                >Unit</label
              >
              <select
                v-model="marinationForm.unit_id"
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
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Stock Limit</label
              >
              <input
                type="number"
                id="ProductName"
                required
                min="0"
                v-model="marinationForm.stock_limit"
                placeholder="Input Stock Limit"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Yeild</label
              >
              <input
                type="number"
                id="ProductName"
                required
                min="0"
                v-model="marinationForm.yeild"
                placeholder="Input Yeild"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Cost Price Per Item</label
              >
              <p hidden>
                {{
                  (marinationForm.cost_price = (
                    (totalCostPrice ?? 0) / (marinationForm.yeild ?? 0)
                  )?.toFixed(2))
                }}
              </p>
              <input
                type="number"
                id="ProductName"
                required
                step="any"
                v-model="marinationForm.cost_price"
                placeholder="Input Cost Price"
                disable
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
            </div>
            <div class="mb-4">
              <label for="remarks" class="block text-sm font-medium text-white"
                >Description</label
              >
              <textarea
                v-model="marinationForm.description"
                placeholder="Input Description"
                class="mt-1 p-2 border rounded-md w-full"
              ></textarea>
            </div>
            <div class="md:flex items-center justify-end hidden">
              <button
                type="submit"
                class="bg-green-500 text-white hover:bg-green-600 font-bold py-2 px-4 rounded"
              >
                Create Production
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
              <AddIngredient
                className="bg-red-500 text-white hover:opacity-70 focus:bg-red-300 rounded font-bold text-sm md:text-lg py-2 px-4 mb-4 float-end text-nowrap "
                v-if="hasPermission('Ingredient_Add_Button')"
                @transaction_id="handleTransaction()"
              />
              <button
                @click.prevent="addIngredient()"
                class="bg-blue-500 text-white hover:opacity-70 rounded font-bold text-sm md:text-lg py-2 px-4 mb-4 float-end text-nowrap"
              >
                <i class="fas fa-plus"></i>
                Add
              </button>
            </div>
            <!-- <span class="px-2 text-sm text-red-400"
              ><b class="text-gray-600">Note:</b> Ingredients with
              <b class="text-red-500 italic">Stock Card</b> category can only be added in
              production ingredients.</span
            > -->
            <div class="mb-4 overflow-auto text-nowrap block p-2">
              <table class="w-full border-collapse bg-white text-md uppercase">
                <thead :class="DEFAULT_BG" class="text-white border-b-2 border-black">
                  <tr>
                    <th class="text-left border p-2" width="30%">Ingredients</th>
                    <th class="text-left border p-2" width="20%">Warehouse</th>
                    <th class="text-left border p-2" width="10%">Cost Price</th>
                    <th class="text-left border p-2" width="10%">Quantity</th>
                    <th class="text-left border p-2" width="10%">Total</th>
                    <th class="text-center border p-2" width="10%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-if="marinationForm.ingredients.length > 0"
                    v-for="(ingredient, index) in marinationForm.ingredients"
                    :key="index"
                    class="border"
                  >
                    <td class="border p-2">
                      <SearchDropdown
                        apiEndpoint="ingredients/search-name-only"
                        :searchModel="searchIngredient"
                        :key="'ingredient-' + index + ingredient.name"
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
                    <td class="border p-2">
                      <select
                        v-model="ingredient.warehouse_id"
                        @change="updateIngredientWarehouse(index, ingredient.warehouse_id)"
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
                        class="bg-red-500 text-white p-1 rounded-full"
                      >
                        <i class="fa fa-times"></i>
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
                    <th class="text-right border p-2" colspan="4">
                      Total Production Cost
                    </th>
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
                Create Productions
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
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
const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
  ingredient_category_id: 0,
});
const marinationForm = ref({
  name: "",
  description: "",
  price: 0,
  yeild: 0,
  ingredient_category_id: 0,
  unit_id: 0,
  cost_price: 0,
  stock_limit: 0,
  warehouse_id: 0,
  menu_images: [],
  ingredients: [
    {
      ingredient_id: 0,
      warehouse_id: 0, // Warehouse per ingredient
      name: "",
      quantity: 1,
      cost_price: 0,
      total: 0,
      unit: "",
      unit_name: ""
    },
  ],
});
const searchWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});

const addBehavior = () => {
  resetForm();
  ingredientsCategoryDropdown();
  unitsDropdown();
  getWarehouses();
  isAddModalOpen.value = true;
};

const updateIngredientSearch = (id) => {
  searchIngredient.value.ingredient_category_id = id;
};

const resetForm = () => {
  marinationForm.value.name = "";
  marinationForm.value.description = "";
  marinationForm.value.price = 0;
  marinationForm.value.yeild = 0;
  marinationForm.value.unit_id = 0;
  marinationForm.value.ingredient_category_id = 0;
  marinationForm.value.cost_price = 0;
  marinationForm.value.stock_limit = 0;
  marinationForm.value.warehouse_id = 0;
  marinationForm.value.menu_images = [];
  marinationForm.value.ingredients = [
    {
      ingredient_id: 0,
      warehouse_id: 0, // Reset warehouse per ingredient
      name: "",
      quantity: 1,
      cost_price: 0,
      total: 0,
      unit: "",
      unit_name: ""
    },
  ];
};

const totalCostPrice = computed(() =>
  marinationForm.value.ingredients?.reduce(
    (sum, item) => sum + parseFloat(item.cost_price * item.quantity),
    0
  )
);

const totalCost = computed(() =>
  marinationForm.value.ingredients?.reduce((sum, item) => sum + parseFloat(item.total), 0)
);

const addIngredient = () => {
  marinationForm.value.ingredients.push({
    ingredient_id: 0,
    warehouse_id: 0, // Initialize with no warehouse selected
    name: "",
    quantity: 1,
    cost_price: 0,
    total: 0,
    unit: "",
    unit_name: ""
  });
};

const removeIngredient = (index) => {
  marinationForm.value.ingredients.splice(index, 1);
};

// Update warehouse for specific ingredient
const updateIngredientWarehouse = (index, warehouseId) => {
  if (marinationForm.value.ingredients[index]) {
    marinationForm.value.ingredients[index].warehouse_id = warehouseId;
    console.log(`Warehouse ${warehouseId} set for ingredient at index ${index}`);
  }
};

//fillIngredientForm
const fillIngredientForm = (item, index) => {
  if (marinationForm.value.ingredients[index]) {
    marinationForm.value.ingredients[index].ingredient_id = item.id ?? 0;
    marinationForm.value.ingredients[index].name = item.name;
    marinationForm.value.ingredients[index].cost_price = item.costPrice ?? 0;
    marinationForm.value.ingredients[index].unit = item.unitAbbre ?? "-";
    marinationForm.value.ingredients[index].unit_name = item.unitName ?? "-";
    
    // Set default warehouse if not already set and main warehouse is selected
    if (!marinationForm.value.ingredients[index].warehouse_id && marinationForm.value.warehouse_id && marinationForm.value.warehouse_id !== 0) {
      marinationForm.value.ingredients[index].warehouse_id = marinationForm.value.warehouse_id;
    }
  } else {
    console.warn(`Index ${index} is out of range.`);
  }

  searchIngredient.value.search = "";
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const fillWarehouseForm = (item) => {
  // This can be used if you need to fill the main production warehouse
  marinationForm.value.warehouse_id = item.id;
};

const addProductionIngredient = async () => {
  try {
    // Validate that all ingredients have warehouses selected
    const ingredientsWithoutWarehouse = marinationForm.value.ingredients.filter(
      ingredient => !ingredient.warehouse_id || ingredient.warehouse_id === 0
    );

    if (ingredientsWithoutWarehouse.length > 0) {
      Alert("error", "Validation Error", "Please select a warehouse for all ingredients.");
      return;
    }

    // Validate that all ingredients are selected
    const ingredientsWithoutSelection = marinationForm.value.ingredients.filter(
      ingredient => !ingredient.ingredient_id || ingredient.ingredient_id === 0
    );

    if (ingredientsWithoutSelection.length > 0) {
      Alert("error", "Validation Error", "Please select all ingredients.");
      return;
    }

    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the production ingredient.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(marinationForm.value);

    // Append image files
    imageFiles.value.forEach((file) => {
      formData.append("menu_images[]", file);
    });

    // Log the payload for debugging
    console.log("Production Form Data:", marinationForm.value);
    console.log("Ingredients with warehouses:", marinationForm.value.ingredients.map(ing => ({
      name: ing.name,
      warehouse_id: ing.warehouse_id
    })));

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/add-production`,
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

// Watch for changes in the main warehouse and update ingredients if needed
watch(() => marinationForm.value.warehouse_id, (newWarehouseId) => {
  if (newWarehouseId && newWarehouseId !== 0) {
    // Update all ingredients that don't have a warehouse selected
    marinationForm.value.ingredients.forEach((ingredient, index) => {
      if (!ingredient.warehouse_id || ingredient.warehouse_id === 0) {
        marinationForm.value.ingredients[index].warehouse_id = newWarehouseId;
      }
    });
  }
});
</script>
