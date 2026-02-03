<template>
  <button
    @click.prevent="editBehavior()"
    type="button"
    :class="[
      'bg-slate-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-copy"></i>
    Duplicate
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="Duplicate Production Ingredient"
    @close="closeMarination()"
  >
    <div class="grid grid-cols-1 gap-6 p-0">
      <form class="" @submit.prevent="duplicateProduction()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-4">
          <div class="block bg-gray-400 p-4 md:min-h-screen">
            <h2 for="itemImages" class="block text-2xl font-medium text-white">
              Fill Production Form.
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
            <div class="mb-4 md:col-span-2">
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
            </div>
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
                Update Production
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
                <!-- <DeleteAllIngredient :key="marinationForm.menu_id" :menu_id="marinationForm.menu_id" @transaction_id="handleTransaction()" /> -->
              </div>
              <button
                @click.prevent="addIngredient()"
                class="bg-blue-500 text-white hover:opacity-70 rounded font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
              >
                <i class="fas fa-plus"></i>
                Add
              </button>
            </div>
            <div class="mb-4 overflow-auto text-nowrap block p-2">
              <table class="w-full border-collapse bg-white text-md uppercase">
                <thead :class="DEFAULT_BG" class="text-white border-b-2 border-black">
                  <tr>
                    <th class="text-left border p-2">Ingredients</th>
                    <th class="text-left border p-2" width="20%">Cost Price</th>
                    <th class="text-left border p-2" width="20%">Quantity</th>
                    <th class="text-left border p-2" width="20%">Total Price</th>
                    <th class="text-center border p-2" width="20%">Actions</th>
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
                        <input
                          step="any"
                          v-model.number="ingredient.total"
                          type="number"
                          disabled
                          class="bg-gray-200 border p-2 w-full text-left focus-visible:bg-yellow-100"
                        />
                        <p hidden>
                          {{
                            (ingredient.total = (
                              parseFloat(ingredient.cost_price) *
                              parseFloat(ingredient.quantity)
                            ).toFixed(2))
                          }}
                        </p>
                      </div>
                    </td>
                    <td class="border p-2 text-center">
                      <!-- <button v-if="ingredient.exist" @click.prevent="deleteIngredient(ingredient.marination_ingredient_id)" class="bg-rose-500 text-white p-1 rounded-full"><i class="fa fa-times"></i> Remove</button> -->
                      <button
                        @click.prevent="removeIngredient(index)"
                        class="bg-red-500 text-white p-1 rounded-full text-sm md:text-md"
                      >
                        <i class="fa fa-times"></i> Remove
                      </button>
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
                    <th class="text-right border p-2" colspan="3">
                      Total Production Cost
                    </th>
                    <th class="text-left border p-2" colspan="2">
                      {{ totalCost?.toFixed(2) ?? 0 }}
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
import DeleteIngredient from "@/views/Pages/Meals/Actions/DeleteIngredient.vue";
import DeleteAllIngredient from "@/views/Pages/Meals/Actions/DeleteAllMenuIngredient.vue";
import IngImageViewer from "@/views/Pages/Ingredients/Actions/IngImageViewer.vue";
import MealImageViewer from "../Actions/MealImageViewer.vue";

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
const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const marinationForm = ref({
  ingredient_id_marination: 0,
  name: "",
  description: "",
  price: 0,
  cost_price: 0,
  category_id: 0,
  stock_limit: 0,
  thumb_nail: "",
  menu_images: [],
  ingredients: [
    {
      ingredient_id: 0,
      name: "",
      quantity: 1,
    },
  ],
});

const totalCostPrice = computed(() =>
  marinationForm.value.ingredients?.reduce(
    (sum, item) => sum + parseFloat(item.cost_price * item.quantity),
    0
  )
);

const totalCost = computed(() =>
  marinationForm.value.ingredients?.reduce(
    (sum, item) => sum + parseFloat(item.total ?? 0),
    0
  )
);

const editBehavior = () => {
  resetForm();
  fillForm();
  categoryDropdown();
  unitsDropdown();
  getMealIngredients();
  getWarehouses();
  isAddModalOpen.value = true;
};

const closeMarination = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};
const resetForm = () => {
  marinationForm.value.name = "";
  marinationForm.value.description = "";
  marinationForm.value.price = 0;
  marinationForm.value.cost_price = 0;
  marinationForm.value.category_id = 0;
  marinationForm.value.menu_images = [];
  marinationForm.value.ingredients = [
    {
      ingredient_id: 0,
      name: "",
      quantity: 1,
      exist: false,
    },
  ];
};
const fillForm = () => {
  const data = props.data;

  console.log(data);
  marinationForm.value.ingredient_id_marination = data.id;
  marinationForm.value.name = data.name + " (Copy)";
  marinationForm.value.description = data.description;
  marinationForm.value.price = data.retailPrice ?? 0;
  marinationForm.value.cost_price = data.menuCostPrice ?? 0;
  marinationForm.value.ingredient_category_id = data.categoryId ?? 0;
  marinationForm.value.warehouse_id = data.warehouseId ?? 0;
  marinationForm.value.thumb_nail = data.thumbNail;
  marinationForm.value.unit_id = data.unitId;
  marinationForm.value.yeild = data.yeild;
  marinationForm.value.stock_limit = data.stockLimit ?? 0;
  marinationForm.value.menu_images = [];
  marinationForm.value.ingredients = [
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
  marinationForm.value.ingredients.push({
    menu_ingredient_id: 0,
    ingredient_id: 0,
    name: "",
    quantity: 1,
  });
};
const removeIngredient = (index) => {
  marinationForm.value.ingredients.splice(index, 1); // Removes the ingredient at the given index
};
//fillIngredientForm
const fillIngredientForm = (item, index) => {
  console.log(index);
  // Ensure the index exists in the ingredients array
  if (marinationForm.value.ingredients[index]) {
    marinationForm.value.ingredients[index].ingredient_id = item.id ?? 0;
    marinationForm.value.ingredients[index].name = item.name;
    marinationForm.value.ingredients[index].unit = item.unitAbbre ?? "-";
    marinationForm.value.ingredients[index].unit_name = item.unitName ?? "-";
    marinationForm.value.ingredients[index].cost_price = item.costPrice ?? 0;
    marinationForm.value.ingredients[index].total = item.costPrice * 0 ?? 0;
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
        ingredient_id: ingredient.subIngredientId || 0, // Assuming 'id' exists in the response
        marination_ingredient_id: ingredient.id || 0, // Assuming 'id' exists in the response
        name: ingredient.subIngredientNamee || "", // Assuming 'name' exists in the response
        unit: ingredient.subIngredientUnitAbbre || "", // Assuming 'name' exists in the response
        unit_name: ingredient.subIngredientUnitName || "", // Assuming 'name' exists in the response
        quantity: ingredient.quantity || 1, // Default to 1 if no quantity is provided
        cost_price: ingredient.costPrice || 0,
        exist: true, // Assuming all ingredients exist by default
      })
    );
  } catch (error) {
    handleApiError(error);
  }
};

const duplicateProduction = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we duplicate the production.",
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

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/duplicate-marination`,
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
        "You are about to delete this marination/sauce ingredient. This action cannot be undone.",
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

const unitsDropdown = async () => {
  units.value = await UNITS();
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
