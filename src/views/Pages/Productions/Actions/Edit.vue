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
    title="Edit Productions Ingredient"
    @close="closeMarination()"
  >
    <div class="grid grid-cols-1 gap-6 p-0">
      <form class="" @submit.prevent="editProductionIngredient()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-4">
          <div class="block bg-blue-400 p-4 md:min-h-screen">
            <!-- <h2 for="itemImages" class="block text-2xl font-medium text-white">
              Fill Productions Form.
            </h2> -->
            <div class="mb-4 border-black">
              <label for="itemImages" class="block text-sm font-medium text-white"
                >Upload Image
              </label>
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
                  v-model="marinationForm.name"
                  :disabled="!hasPermission('Override_Production_Name')"
                  placeholder="Input Meal Name"
                  :class="
                    hasPermission('Override_Production_Name')
                      ? 'bg-white rounded-l'
                      : ' bg-gray-200 rounded'
                  "
                  class="p-2 border w-full"
                />
                <OverrideProductionName
                  v-if="hasPermission('Override_Production_Name')"
                  :key="marinationForm.ingredient_id_number"
                  :data="marinationForm"
                />
              </div>
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
            <div class="mb-4 flex gap-2">
              <div class="w-1/2">
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
              <div class="w-1/2">
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
            </div>
            <!-- <div class="mb-4 md:col-span-2">
              <label for="ProductName" class="block text-sm font-medium text-gray-700"
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
                >Retail Price</label
              >
              <div class="flex mt-1">
                <input
                  type="number"
                  id="ProductName"
                  required
                  step="any"
                  v-model="marinationForm.retail_price"
                  :disabled="!hasPermission('Override_Retail_Price')"
                  placeholder="Input Ingredient Name"
                  :class="
                    hasPermission('Override_Retail_Price')
                      ? 'bg-white rounded-l'
                      : ' bg-gray-200 rounded'
                  "
                  class="p-2 border rounded-l w-full bg-gray-200"
                />
                <OverrideRetailPrice
                  v-if="hasPermission('Override_Retail_Price')"
                  :key="marinationForm.ingredient_id_marination"
                  :ingredient_id_marination="marinationForm.ingredient_id_number"
                  :retail_price="marinationForm.retail_price"
                />
              </div>
            </div>
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
                  v-model="marinationForm.cost_price"
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
                  :key="marinationForm.ingredient_id_marination"
                  :ingredient_id_marination="marinationForm.ingredient_id_marination"
                  :cost_price="marinationForm.cost_price"
                />
              </div>
            </div>
            <div class="mb-4 flex gap-2">
              <div class="w-1/2">
                <label for="ProductName" class="block text-sm font-medium text-white"
                  >Cost Price Per Item</label
                >
                <p hidden>
                  {{
                    (marinationForm.cost_price_per_item = (
                      (totalCostPrice ?? 0) / (marinationForm.yeild ?? 0)
                    )?.toFixed(2))
                  }}
                </p>
                <input
                  type="number"
                  id="ProductName"
                  step="any"
                  v-model="marinationForm.cost_price_per_item"
                  placeholder="Input Cost Price"
                  disable
                  class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                />
              </div>
              <div class="w-1/2">
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
            </div>
            <div class="flex gap-4">
              <label for="ProductName" class="block text-lg font-bold text-orange-200"
                  >Food Costing:</label
              >
              <span class="text-red-500 text-sm italic bg-gray-100 py-1 px-2 rounded-md">
                ({{totalCostPrice.toFixed(2) }} / {{ marinationForm.food_cost_percent }} * 1.22)/ {{  marinationForm.pax }} = {{ totalFoodCost.toFixed(2) }}
              </span>
            </div>
            <div class="mb-4 grid grid-cols-3 gap-2">
             
              <div class="col-span-1">
                <label for="ProductName" class="block text-sm font-medium text-white"
                  >Percentage</label
                >
                <input
                  type="number"
                  id="ProductName"
                  step="any"
                  v-model="marinationForm.food_cost_percent"
                  placeholder="Input Percentage food cost"
                  disable
                  class="mt-1 p-2 border rounded-md w-full"
                />
              </div>
              <div class="col-span-1">
                 <label for="ProductName" class="block text-sm font-medium text-white"
                  >Pax</label
                >
                <input
                  type="number"
                  id="ProductName"
                  required
                  min="0"
                  v-model="marinationForm.pax"
                  placeholder="Input Pax"
                  class="mt-1 p-2 border rounded-md w-full"
                />
              </div>
              <div class="col-span-1 flex items-end">
                <span class="flex-1 p-2 rounded-md bg-gray-300">
                  {{ totalFoodCost.toFixed(2) ?? 0 }}
                </span>
              </div>
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
                Update Productions
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
                <DeleteAllIngredient
                  :key="marinationForm.menu_id"
                  :menu_id="marinationForm.menu_id"
                  @transaction_id="handleTransaction()"
                />
              </div>
              <button
                @click.prevent="addIngredient()"
                class="bg-blue-500 text-white hover:opacity-70 rounded font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
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
                    <th class="text-left border text-wrap p-2" width="10%">Cost Price</th>
                    <th class="text-left border p-2" width="10%">Quantity</th>
                    <th class="text-left border p-2" width="10%">Total Price</th>
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
                        v-model="ingredient.ingredient_warehouse"
                        @change="updateIngredientWarehouse(index, ingredient.ingredient_warehouse)"
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
                              parseFloat(ingredient.cost_price) *
                              parseFloat(ingredient.quantity)
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
                        class="bg-yellow-500 text-white p-1 px-2 rounded-full text-sm md:text-md"
                      >
                        <i class="fa fa-save"></i>
                      </button>
                      <button
                        v-if="ingredient.exist"
                        @click.prevent="
                          deleteIngredient(ingredient.marination_ingredient_id)
                        "
                        class="bg-rose-500 text-white p-1 px-2 rounded-full text-sm md:text-md"
                      >
                        <i class="fa fa-times"></i>
                      </button>
                      <button
                        v-else
                        @click.prevent="removeIngredient(index)"
                        class="bg-red-500 text-white p-1 px-2 rounded-full text-sm md:text-md"
                      >
                        <i class="fa fa-times"></i>
                         {{ console.log(marinationForm) }}
                      </button>
                     
                       <SaveIngredientButton
                          v-if="ingredient.exist"
                          :productionId="marinationForm.ingredient_id_marination"
                          :ingredientId="ingredient.ingredient_id"
                          :subId="ingredient.sub_id"
                          :itemId="marinationForm.item_id"
                          :quantity="ingredient.quantity"
                          :warehouseId="ingredient.ingredient_warehouse"
                          :ingredientName="ingredient.name"
                          :productionName="marinationForm.name"
                          :warehouseName="getWarehouseName(ingredient.ingredient_warehouse)"
                          @saved="handleIngredientSaved"
                          @error="handleIngredientError"
                          className="bg-green-500 hover:bg-green-600"
                        />
                    </td>
                  </tr>
                  <tr v-if="marinationForm.ingredients.length == 0">
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
                      {{ parseFloat(totalCost ?? 0).toFixed(2) }}
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
import DeleteIngredient from "@/views/Pages/Meals/Actions/DeleteIngredient.vue";
import DeleteAllIngredient from "@/views/Pages/Meals/Actions/DeleteAllMenuIngredient.vue";
import OverrideProductionName from "../Actions/OverrideProductionName.vue";
import OverrideCostPrice from "../Actions/OverrideCostPrice.vue";
import OverrideRetailPrice from "../Actions/OverrideRetailPrice.vue";
import IngImageViewer from "@/views/Pages/Ingredients/Actions/IngImageViewer.vue";
import MealImageViewer from "../Actions/MealImageViewer.vue";
import SaveIngredientButton from "./SaveIngredientButton.vue";

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
const ingredients = ref([]);
const warehouses = ref([]);
const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
  ingredient_category_id: 0,
});

const searchWarehouse = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});

const marinationForm = ref({
  ingredient_id_marination: 0,
  ingredient_id_number: '',
  warehouse_id: 0,
  name: "",
  item_id: 0,
  description: "",
  price: 0,
  cost_price: 0,
  retail_price: 0,
  category_id: 0,
  stock_limit: 0,
  thumb_nail: "",
  food_cost_percent: 0,
  pax: 0,
  thumb_nail: "",
  menu_images: [],
  ingredients: [
    {
      ingredient_id: 0,
      sub_id: 0,
      ingredient_warehouse: 0, // Warehouse per ingredient
      name: "",
      quantity: 1,
      cost_price: 0,
      total: 0,
      unit: "",
      unit_name: "",
      exist: false
    },
  ],
});

const totalCostPrice = computed(() =>
  marinationForm.value.ingredients?.reduce(
    (sum, item) => sum + parseFloat((item.cost_price ?? 0) * (item.quantity ?? 0)),
    0
  )
);

const totalFoodCost = computed(() => {
  const foodCostPercent = marinationForm.value.food_cost_percent
  const pax = marinationForm.value.pax
  const costPrice = totalCostPrice.value

  if (!foodCostPercent || !pax) return 0

  const foodCostRatio = foodCostPercent / 100
  const vat = 1.22

  return (costPrice / foodCostRatio * vat) / pax
})

const totalCost = computed(() =>
  marinationForm.value.ingredients?.reduce(
    (sum, item) => sum + parseFloat(item.total ?? 0),
    0
  )
);

const editBehavior = () => {
  resetForm();
  fillForm();
  ingredientsCategoryDropdown();
  unitsDropdown();
  getMealIngredients();
  getWarehouses();
  isAddModalOpen.value = true;
};

const closeMarination = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};

const updateIngredientSearch = (id) => {
  searchIngredient.value.ingredient_category_id = id;
};

const getWarehouseName = (warehouseId) => {
  const warehouse = warehouses.value.find(wh => wh.warehouseId == warehouseId);
  return warehouse ? warehouse.warehouseName : '';
};

const resetForm = () => {
  marinationForm.value.name = "";
  marinationForm.value.ingredient_id_number = "";
  marinationForm.value.item_id = 0;
  marinationForm.value.description = "";
  marinationForm.value.price = 0;
  marinationForm.value.cost_price = 0;
  marinationForm.value.category_id = 0;
  marinationForm.value.menu_images = [];
  marinationForm.value.ingredients = [
    {
      ingredient_id: 0,
      ingredient_warehouse: 0,
      name: "",
      sub_id: 0,
      quantity: 1,
      cost_price: 0,
      total: 0,
      unit: "",
      unit_name: "",
      exist: false,
    },
  ];
};

const fillForm = () => {
  const data = props.data;

  marinationForm.value.ingredient_id_marination = data.id;
  marinationForm.value.ingredient_id_number = data.ingredientIdNumber ?? "";
  marinationForm.value.name = data.name;
  marinationForm.value.item_id= data.itemId;
  marinationForm.value.description = data.description;
  marinationForm.value.price = data.retailPrice ?? 0;
  marinationForm.value.cost_price = data.costPrice ?? 0;
  marinationForm.value.retail_price = data.retailPrice ?? 0;
  marinationForm.value.ingredient_category_id = data.categoryId ?? 0;
  marinationForm.value.thumb_nail = data.thumbNail;
  marinationForm.value.unit_id = data.unitId;
  marinationForm.value.yeild = data.yeild;
  marinationForm.value.warehouse_id = data.warehouseId ?? 0;
  marinationForm.value.stock_limit = data.stockLimit ?? 0;
  marinationForm.value.food_cost_percent = data.foodCostPercent ?? 0,
  marinationForm.value.pax = data.pax ?? 0,
  marinationForm.value.menu_images = [];
  marinationForm.value.ingredients = [
    {
      ingredient_id: 0,
      ingredient_warehouse: 0,
      sub_id: 0,
      name: "",
      quantity: 1,
      cost_price: 0,
      total: 0,
      unit: "",
      unit_name: "",
      exist: false,
    },
  ];
};

const addIngredient = () => {
  marinationForm.value.ingredients.push({
    ingredient_id: 0,
    ingredient_warehouse: 0, // Initialize with no warehouse selected
    name: "",
    quantity: 1,
    cost_price: 0,
    total: 0,
    unit: "",
    unit_name: "",
    exist: false
  });
};

const removeIngredient = (index) => {
  marinationForm.value.ingredients.splice(index, 1);
};

// Update warehouse for specific ingredient
const updateIngredientWarehouse = (index, warehouseId) => {
  if (marinationForm.value.ingredients[index]) {
    marinationForm.value.ingredients[index].ingredient_warehouse = warehouseId;
    console.log(`Warehouse ${warehouseId} set for ingredient at index ${index}`);
  }
};

//fillIngredientForm
const fillIngredientForm = (item, index) => {
  
  if (marinationForm.value.ingredients[index]) {
    marinationForm.value.ingredients[index].ingredient_id = item.id ?? 0;
    marinationForm.value.ingredients[index].name = item.name;
    marinationForm.value.ingredients[index].unit = item.unitAbbre ?? "-";
    marinationForm.value.ingredients[index].unit_name = item.unitName ?? "-";
    marinationForm.value.ingredients[index].cost_price = item.costPrice ?? 0;
    marinationForm.value.ingredients[index].total = (item.costPrice ?? 0) * (marinationForm.value.ingredients[index].quantity ?? 1);
    
    // Set default warehouse if not already set and main warehouse is selected
    if (!marinationForm.value.ingredients[index].ingredient_warehouse && marinationForm.value.warehouse_id && marinationForm.value.warehouse_id !== 0) {
      marinationForm.value.ingredients[index].ingredient_warehouse = marinationForm.value.warehouse_id;
    }
  } else {
    console.warn(`Index ${index} is out of range.`);
  }

  searchIngredient.value.search = "";
};

const fillWarehouseForm = (item) => {
  // This can be used if you need to fill the main production warehouse
  marinationForm.value.warehouse_id = item.id;
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const handleTransaction = () => {
  getMealIngredients();
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

const getMealIngredients = async () => {
  try {
    const formData = FormDx(marinationForm.value);
    const response = await axios.post(
      VUE_APP_API_URL + "ingredients/production-get-sub-ingredients",
      formData,
      BearToken(token)
    );

    // Reformat and push the response ingredients
    marinationForm.value.ingredients = response.data.subIngredients?.map(
      (ingredient) => ({
        ingredient_category_id: ingredient.ingredientCategoryId ?? 0,
        category_id: ingredient.categoryId || 0,
        category_name: ingredient.categoryName || 0,
        ingredient_id: ingredient.subIngredientId || 0,
        sub_id: ingredient.id||0,
        marination_ingredient_id: ingredient.id || 0,
        name: ingredient.subIngredientNamee || "",
        unit: ingredient.subIngredientUnitAbbre || "",
        unit_name: ingredient.subIngredientUnitName || "",
        quantity: ingredient.quantity || 1,
        cost_price: ingredient.costPrice || 0,
        total: (ingredient.costPrice || 0) * (ingredient.quantity || 1),
        ingredient_warehouse: ingredient.warehouseId || 0, // Add warehouse from response
        exist: true,
      })
    );
      console.log(response );
  } catch (error) {
    handleApiError(error);
  }
};

const editProductionIngredient = async () => {
  try {
    // Validate that all ingredients have warehouses selected
    const ingredientsWithoutWarehouse = marinationForm.value.ingredients.filter(
      ingredient => !ingredient.ingredient_warehouse || ingredient.ingredient_warehouse === 0
    );

    // if (ingredientsWithoutWarehouse.length > 0) {
    //   Alert("error", "Validation Error", "Please select a warehouse for all ingredients.");
    //   return;
    // }

    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update the production.",
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
    console.log("Edit Production Form Data:", marinationForm.value);
    console.log("Ingredients with warehouses:", marinationForm.value.ingredients.map(ing => ({
      name: ing.name,
      ingredient_warehouse: ing.ingredient_warehouse
    })));

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/edit-marination`,
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

const deleteIngredient = async (marination_id) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text:
        "You are about to delete this Productions ingredient. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Proceed with deletion using Axios
      const formData = FormDx({ sub_ingredient_id: marination_id });
      const response = await axios.post(
        `${VUE_APP_API_URL}ingredients/delete-sub-ingredient-in-marination`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("warning", "Deleted!", response.data.message);
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

const editIngredient = async (ingredient_data) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text:
        "You are about to update this Productions ingredient. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Proceed with deletion using Axios
      const formData = FormDx({
        product_has_ingredient_id: ingredient_data.marination_ingredient_id,
        sub_ingredient_id: ingredient_data.ingredient_id,
        new_quantity: ingredient_data.quantity,
        ingredient_warehouse: ingredient_data.ingredient_warehouse // Include warehouse in update
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}ingredients/edit-sub-ingredient-in-production`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("success", "Updated!", response.data.message);
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

const unitsDropdown = async () => {
  units.value = await UNITS();
};

const getWarehouses = async () => {
  try {
    warehouses.value = [];
    const response = await axios.post(
      `${VUE_APP_API_URL}users/warehouses-dropdown`,
      { id: 0 },
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
      if (!ingredient.ingredient_warehouse || ingredient.ingredient_warehouse === 0) {
        marinationForm.value.ingredients[index].ingredient_warehouse = newWarehouseId;
      }
    });
  }
});
</script>
