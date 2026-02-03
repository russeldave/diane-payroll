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
    :show="isEditModalOpen"
    :maxWidth="'fullscreen'"
    title="Edit Buffet"
    @close="closeModal()"
  >
    <div class="grid grid-cols-1 gap-6 p-0">
      <form class="" @submit.prevent="editBuffet()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-4">
          <div class="block bg-red-600 p-4 md:min-h-screen">
            <h2 for="itemImages" class="block text-2xl font-medium text-white">
              Fill Package Form.
            </h2>

            <div class="mb-4">
              <label for="ProductName" class="block text-sm font-medium text-white"
                >Name</label
              >
              <div class="flex mt-1">
                <input
                  type="text"
                  id="ProductName"
                  required
                  v-model="buffetForm.name"
                  :disabled="!hasPermission('Override_Buffet_Name')"
                  placeholder="Buffet Name"
                  class="p-2 border w-full"
                />
              </div>
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
                >Price / pack</label
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
                Update package
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
              <button
                @click.prevent="addIngredient()"
                class="bg-blue-500 text-white hover:opacity-70 rounded font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
              >
                <i class="fas fa-plus"></i>
                Add Row
              </button>
            </div>
            <div class="mb-4 overflow-auto text-nowrap block p-2">
              <table class="w-full border-collapse bg-white text-md uppercase">
                <thead :class="DEFAULT_BG" class="text-white border-b-2 border-black">
                  <tr>
                    <th class="text-left border p-2">Production/Ingredient</th>
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
                      <div v-if="dish.exist" class="flex group">
                        <span class="italic text-gray-700">{{ dish.ingredient_id_number }} -&nbsp;</span>
                        <span class="font-semibold">{{ dish.dishes_name }}</span>
                        <span class="text-red-500 italic text-sm">[{{ dish.unit_abbre }}]</span>
                        <!-- <input
                          v-model.number="dish.dishes_name"
                          :title="dish.dishes_name"
                          type="text"
                          disabled
                          class="bg-gray-200 border p-2 w-full text-left focus-visible:bg-yellow-100"
                        /> -->
                      </div>
                      <SearchDropdown
                        v-else
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
                    <td class="border p-2 text-center">
                      <button
                        v-if="dish.exist"
                        @click.prevent="deleteDish(dish.id)"
                        class="bg-red-700 text-white p-1 rounded-full"
                      >
                        <i class="fa fa-times"></i> Remove
                      </button>
                      <button
                        v-else
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

              </table>
            </div>
            <div class="md:hidden items-center justify-end flex p-2">
              <button
                type="submit"
                class="bg-green-500 text-white hover:bg-green-600 font-bold py-2 px-4 rounded"
              >
                Save Buffet
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
  convertWordToDate,
} from "@/views/Utility/Helper";

import OverrideBuffetName from "../Actions/OverrideBuffetName.vue";
import AddIngredient from "@/views/Pages/Ingredients/Actions/Add.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
});
const isEditModalOpen = ref(false);
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
  buffet_category_id: 0,
  cost_price: 0,
  date_from: "",
  date_to: "",
  buffet_images: [],
  dishes: [
    {
      id: 0,
      dishes_name: "",
      buffet_package_id: 0,
      dish_id: 0,
      ingredient_id_number: "",
      unit_abbre: "",
      exist: false,
    },
  ],
});
const editBehavior = async () => {
  await resetForm();
  await fillForm();
  isEditModalOpen.value = true;

  await getBuffetDishes();
  // await categoryDropdown();
  // unitsDropdown();
};
const closeModal = () => {
  isEditModalOpen.value = false;
  emits("transaction_id", Math.random());
};
const fillForm = () => {
  const data = props.data;

  buffetForm.value.buffet_id = data.id;
  buffetForm.value.name = data.name;
  buffetForm.value.description = data.description;
  buffetForm.value.date_from = convertWordToDate(data.dateFrom);
  buffetForm.value.date_to = convertWordToDate(data.dateTo);
  buffetForm.value.buffet_retail_price = parseFloat(data.price);
  buffetForm.value.cost_price = parseFloat(data.costPrice);
  buffetForm.value.buffet_category_id = data.buffetCategoryId ?? 0;
  buffetForm.value.dishes = [
    {
      id: 0,
      dishes_name: "",
      buffet_package_id: 0,
      dish_id: 0,
      ingredient_id_number: "",
      unit_abbre: "",
      exist: false,
    },
  ];
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
      id: 0,
      dishes_name: "",
      buffet_package_id: 0,
      dish_id: 0,
      ingredient_id_number: "",
      unit_abbre: "",
      exist: false,
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
    id: 0,
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
    buffetForm.value.dishes[index].id = item.id ?? 0;
    buffetForm.value.dishes[index].dish_id = item.dishId ?? 0;
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

const handleTransaction = () => {
  getBuffetDishes();
};

const getBuffetDishes = async () => {
  try {
    const formData = FormDx(buffetForm.value);
    const response = await axios.post(
      VUE_APP_API_URL + "buffets/get-dishes-package",
      formData,
      BearToken(token)
    );

    // console.log("getBuffetDishes in line: 405");
    // console.log(response.data.menus)

    // Reformat and push the response ingredients
    buffetForm.value.dishes = response.data.menus.map((dish) => ({
      id: dish.bphdId ?? 0, // Assuming 'id' exists in the response
      dish_id: dish.ingId ?? 0, // Assuming 'id' exists in the response
      buffet_package_id: dish.buffetPackageId?? 0, // Assuming 'buffet_id' exists in the response
      dishes_name: dish.name ?? "", // Assuming 'name' exists in the response
      ingredient_id_number: dish.ingredientIdNumber ?? "",
      unit_abbre: dish.unitAbbre,

      exist: true, // Assuming all ingredients exist by default
    }));
  } catch (error) {
    handleApiError(error);
  }
};

// const handleSyncData = async (data) => {

//   //replace new data
//   buffetForm.value.dishes = data;
//   isSync.value = true;
// }
const editBuffet = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update the buffet.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(buffetForm.value);
    imageFiles.value.forEach((file) => {
      formData.append("buffet_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}buffets/edit-package`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();
    Alert("success", "Success", response.data.message);
    getBuffetDishes();
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const deleteDish = async (dish_id) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this buffet dish. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show processing state
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we remove the dish.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({ package_has_dishes_id: dish_id });
      const response = await axios.post(
        `${VUE_APP_API_URL}buffets/delete-dish-in-package`,
        formData,
        BearToken(token)
      );

      // Close processing alert
      Swal.close();
      Alert("warning", "Deleted!", response.data.message);
      getBuffetDishes();
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const editDishes = async (dishes_data) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to update this Buffet dishes. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show processing state
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we update the dishes.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({
        menu_has_ingredient_id: ingredient_data.menu_ingredient_id,
        ingredient_id: ingredient_data.ingredient_id,
        new_quantity: ingredient_data.quantity,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}menus/edit-ingredient-in-menu`,
        formData,
        BearToken(token)
      );

      // Close processing alert
      Swal.close();
      Alert("success", "Updated!", response.data.message);
      getBuffetDishes();
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};
</script>
