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
    Add Buffet
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'fullscreen'"
    title="New Buffet"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-0">
      <form class="" @submit.prevent="addBuffet()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-4">
          <div class="block bg-red-600 p-4 md:min-h-screen">
            <h2 for="itemImages" class="block text-2xl font-medium text-white">
              Fill Buffet Form.
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
                v-model="buffetForm.name"
                placeholder="Input Buffet Name"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Category</label
              >
              <select
                class="mt-1 p-2 border rounded-md w-full"
                v-model="buffetForm.buffet_category_id"
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
            <!-- <div class="mb-4">
              <label
                for="LeagueName"
                class="block text-sm font-medium text-white"
                >Unit</label
              >
              <select
              v-model="buffetForm.unit_id"
              placeholder="Select Unit"
              class="mt-1 p-2 border rounded-md w-full"
              >
                <option value="0">--Select Unit--</option>
                <option v-for="unit in units" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
              </select>
            </div> -->
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Date From</label
              >
              <input
                type="datetime-local"
                id="ProductName"
                required
                min="0"
                v-model="buffetForm.date_from"
                placeholder="Input Date"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Date To</label
              >
              <input
                type="datetime-local"
                id="ProductName"
                required
                min="0"
                v-model="buffetForm.date_to"
                placeholder="Input Date"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Retail Price</label
              >
              <input
                type="number"
                id="ProductName"
                required
                min="0"
                v-model="buffetForm.buffet_retail_price"
                placeholder="Input Retail Price"
                class="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <!-- <div class="mb-4">
              <label
                for="ProductName"
                class="block text-sm font-medium text-white"
                >Cost Price Per Item</label
              >
              <p hidden>{{ buffetForm.cost_price = ((totalCostPrice ?? 0) / (buffetForm.yeild ?? 0))?.toFixed(2) }}</p>
              <input
                type="number"
                id="ProductName"
                required
                step="any"
                v-model="buffetForm.cost_price"
                placeholder="Input Cost Price"
                disable
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
            </div> -->
            <div class="mb-4">
              <label for="remarks" class="block text-sm font-medium text-white"
                >Description</label
              >
              <textarea
                v-model="buffetForm.description"
                placeholder="Input Description"
                class="mt-1 p-2 border rounded-md w-full"
              ></textarea>
            </div>
            <div class="md:flex items-center justify-end hidden">
              <button
                type="submit"
                class="bg-green-500 text-white hover:bg-green-600 font-bold py-2 px-4 rounded"
              >
                Create Buffet
              </button>
            </div>
          </div>
          <div class="block md:col-span-3 p-4">
            <h2 for="itemImages" class="block text-2xl font-bold text-amber-600">
              <i class="fa fa-concierge-bell"></i> Add Menus.
            </h2>
            <div
              class="flex justify-between mb-1 mt-4 px-2 pt-3 border-t-2 border-amber-600 space-x-2"
            >
              <!-- <AddIngredient  className="bg-red-500 text-white hover:opacity-70 focus:bg-red-300 rounded font-bold text-sm md:text-lg py-2 px-4 mb-4 float-end text-nowrap " v-if="hasPermission('Ingredient_Add_Button')" @transaction_id="handleTransaction()"  /> -->
              <div></div>
              <button
                @click.prevent="addIngredient()"
                class="bg-blue-500 text-white hover:opacity-70 rounded font-bold text-sm md:text-lg py-2 px-4 mb-4 float-end text-nowrap"
              >
                <i class="fas fa-plus"></i>
                Add Row
              </button>
            </div>
            <div class="mb-4 overflow-auto text-nowrap block p-2">
              <table class="w-full border-collapse bg-white text-md uppercase">
                <thead :class="DEFAULT_BG" class="text-white border-b-2 border-black">
                  <tr>
                    <th class="text-left border p-2">Menu/Production/Ingredient</th>
                    <th class="text-left border p-2" width="20%">Cost Price Per Item</th>
                    <th class="text-left border p-2" width="20%">Yeild</th>
                    <!-- <th class="text-left border p-2" width="20%">Quantity</th> -->
                    <th class="text-left border p-2" width="20%">Total Cost</th>
                    <th class="text-center border p-2" width="20%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-if="buffetForm.dishes.length > 0"
                    v-for="(dish, index) in buffetForm.dishes"
                    :key="index"
                    class="border"
                  >
                    <td class="border p-2">
                      <SearchDropdown
                        apiEndpoint="buffets/dishes-list"
                        :searchModel="searchDish"
                        :key="dish.dishes_name"
                        placeholder="Search Dish"
                        itemLabel="name"
                        itemId="id"
                        :defaultValue="dish.dishes_name"
                        inputId="menuName"
                        formatLabel="dashed"
                        className="focus-visible:bg-yellow-100 p-2 w-full border"
                        @item-selected="(data) => fillDishName(data, index)"
                        dataKey="menus"
                        returnName="['id','dishesName']"
                      />
                    </td>
                    <td class="right border p-2">
                      <div class="flex group">
                        <input
                          step="any"
                          v-model.number="dish.cost_price"
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
                          v-model.number="dish.yeild"
                          type="number"
                          disabled
                          class="bg-gray-200 border p-2 w-full text-left focus-visible:bg-yellow-100"
                        />
                      </div>
                    </td>
                    <!-- <td class="right border p-2">
                      <div class="flex group">
                        <input
                          step="any"
                          v-model.number="dish.quantity"
                          disabled
                          type="number"
                          class="bg-gray-200 border p-2 w-full text-left focus-visible:bg-yellow-100"
                        />
                      </div>
                    </td> -->
                    <td class="right border p-2">
                      <div class="flex group">
                        <input
                          step="any"
                          v-model.number="dish.total"
                          type="number"
                          disabled
                          class="bg-gray-200 border p-2 w-full text-left focus-visible:bg-yellow-100"
                        />
                        <p hidden>
                          {{
                            (dish.total = (dish.cost_price * dish.quantity).toFixed(2))
                          }}
                        </p>
                      </div>
                    </td>
                    <td class="border p-2 text-center">
                      <button
                        @click.prevent="removeDish(index)"
                        class="bg-red-500 text-white p-1 rounded-full"
                      >
                        <i class="fa fa-times"></i> Remove
                      </button>
                    </td>
                  </tr>
                  <tr v-else>
                    <td colspan="6" class="border p-2 text-center text-red-500 font-bold">
                      <small>No dishes added!</small>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="border-b-2 border-black">
                  <tr>
                    <th class="text-right border p-2" colspan="3">Grand Total</th>
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
                Create Buffet
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
  showProcessing,
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
const searchDish = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  category_id: 0,
});
const buffetForm = ref({
  name: "",
  description: "",
  buffet_retail_price: 0,
  cost_price: 0,
  date_from: "",
  date_to: "",
  buffet_category_id: 0,
  buffet_images: [],
  dishes: [
    {
      menu_id: 0,
      menu_name: "",
      quantity: 1,
      cost_price: 0,
      total: 0,
    },
  ],
});
const addBehavior = () => {
  resetForm();
  categoryDropdown();
  // unitsDropdown();
  isAddModalOpen.value = true;
};
const resetForm = () => {
  buffetForm.value.name = "";
  buffetForm.value.description = "";
  buffetForm.value.date_from = "";
  buffetForm.value.date_to = "";
  buffetForm.value.buffet_images = [];
  buffetForm.value.buffet_retail_price = 0;
  buffetForm.value.buffet_category_id = 0;
  buffetForm.value.dishes = [
    {
      dishes_id: 0,
      dishes_name: "",
      quantity: 1,
      cost_price: 0,
      total: 0,
    },
  ];
};
const totalCostPrice = computed(() =>
  buffetForm.value.dishes?.reduce(
    (sum, item) => sum + parseFloat(item.cost_price * item.quantity),
    0
  )
);
const totalCost = computed(() =>
  buffetForm.value.dishes?.reduce((sum, item) => sum + parseFloat(item.total), 0)
);
const addIngredient = () => {
  buffetForm.value.dishes.push({
    dishes_id: 0,
    dishes_name: "",
    quantity: 1,
    cost_price: 0,
    total: 0,
  });
};
const removeDish = (index) => {
  buffetForm.value.dishes.splice(index, 1); // Removes the ingredient at the given index
};

//fillDishName
const fillDishName = (item, index) => {
  // Ensure the index exists in the ingredients array
  if (buffetForm.value.dishes[index]) {
    buffetForm.value.dishes[index].dishes_id = item.id ?? 0;
    buffetForm.value.dishes[index].dishes_name = item.dishesName;
    buffetForm.value.dishes[index].cost_price = item.costPrice ?? 0;
  } else {
    // Optionally handle the case where the index doesn't exist
    console.warn(`Index ${index} is out of range.`);
  }

  // Clear the search field
  searchDish.value.search = "";
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};
const categoryDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}buffet-categories/dropdown`,
      BearToken(token)
    );
    categories.value = response.data.categories;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};
const unitsDropdown = async () => {
  units.value = await UNITS();
};
const addBuffet = async () => {
  try {
    // Show processing alert
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we create the buffet.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(buffetForm.value);
    // Append image files
    imageFiles.value.forEach((file) => {
      formData.append("buffet_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}buffets/add`,
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
    console.log(error);
    handleApiError(error);
  }
};
</script>
