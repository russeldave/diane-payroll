<template>
  <div
    class="cart-container p-4 border border-4 border-orange-300 rounded-lg shadow-lg min-h-screen relative w-screen lg:w-[500px] bg-orange-100"
  >
    <div class="flex justify-between min-w-screen py-2 border-b-2 border-gray-500 bg-orange-200 rounded-md">
      <h2 class="text-xl font-bold px-2">Suggest New Item</h2>
      <button
        class="flex float-end p-2 items-center justify-center bg-red-500 border-white border-2 animate-pulse rounded-full mr-4 md:mr-1 w-8 h-8"
        @click="$emit('close')"
      >
        <i class="fa fa-times fa-xl font-bold text-white"></i>
      </button>
    </div>
    <div class="cart-content overflow-auto">
      <form class="mt-4" autocomplete="off">
        <div class="grid grid-cols-2 gap-6 p-2">
          <!-- <div class=" flex col-span-2">
            <input
              type="checkbox"
               v-model="itemsForm.is_fixed"
               class="w-4 h-4 bg-red-500"
            />
            <label
              for="LeagueName"
              class="block text-md ml-2 font-medium text-red-500"
              >Is this item a fixed asset?</label
            >
          </div> -->
          <div class="mb-4 col-span-2">
            <label
              for="itemImages"
              class="block text-sm font-medium text-gray-700"
              >Item Images</label
            >
            <input
              type="file"
              id="itemImages"
              @change="handleImageUpload"
              multiple
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Item Name</label
            >
            <input
              type="text"
              id="ItemName"
              v-model="itemsForm.item_name"
              placeholder="Input Item Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Unit</label
            >
            <select
              v-model="itemsForm.unit_id"
              placeholder="Select Unit"
             class="mt-1 p-2 border rounded-md w-full"
            >
              <option value="0">--Select Unit--</option>
              <option
                v-for="unit in units"
                :key="unit.value"
                :value="unit.value"
              >
                {{ unit.label }}
              </option>
            </select>
          </div>
           <!-- <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Model</label
            >
            <input
              type="text"
              id="ItemModel"
              v-model="itemsForm.item_model"
              placeholder="Input Item Model"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div> -->
           <!-- <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Serial Number</label
            >
            <input
              type="text"
              id="ItemSerialNumber"
              v-model="itemsForm.item_serial_number"
              placeholder="Input Item Serial Number"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div> -->
          <!-- <div class="mb-4 relative col-span-2">
            <label
              for="brandName"
              class="block text-sm font-medium text-gray-700"
            >
              Brand
            </label>
            <div class="flex">
              <SearchDropdown
                  apiEndpoint="item-brands/list"
                  :searchModel="searchBrand"
                  placeholder="Search Brand"
                  itemLabel="name"
                  itemId="id"
                  inputId="brandName"
                  formatLabel="parenthesis"
                  @item-selected="(data) => fillBrandForm(data)"
                  dataKey="itemBrands"
                  returnName="['name','abbre']"
                />
            </div>
          </div> -->
          <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Category</label
            >
            <select
            v-model="itemsForm.category_id"
            placeholder="Select Category"
            class="mt-1 p-2 border rounded-md w-full"
            >
              <option value="0">--Select Category--</option>
              <option v-for="category in categories" :key="category.value" :value="category.value">{{ category.label }}</option>
            </select>
          </div>
          <!-- <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              v-model="itemsForm.description"
              placeholder="Input Item Description"
              class="mt-1 p-2 border rounded-md w-full"
            ></textarea>
          </div> -->
          <div class="mb-4 col-span-2">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Remarks</label
            >
            <textarea
              v-model="itemsForm.remarks"
              placeholder="Input Item Remarks"
              class="mt-1 p-2 border rounded-md w-full"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
    <div class="flex items-center justify-start border-t-2 pt-4 border-cyan-200">
      <button
        type="button"
        @click.prevent="addItem"
        class="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
      >
        <i class="fa fa-save"></i>
        Send
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import {
  truncateText,
  Alert,
  FormDx,
  BearToken,
  typeFormatter,
  handleApiError,
} from "@/views/Utility/Helper";
import { VUE_APP_API_URL, UNITS, CATEGORIES } from "@/views/Utility/Global";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const units = ref([]);
const categories  = ref([]);
const imageFiles = ref([]);
const sub_categories = ref([]);

// Define props
const props = defineProps({
  updateKey: {
    type: Number,
    default: 0,
  },
});
const searchBrand = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const itemsForm = ref({
  is_fixed: false,
  description: "",
  remarks: "",
  quantity: 0,
  unit_id: 0,
  brand_id: 0,
  brand_name: "",
  category_id: 0,
  item_serial_number: "",
  item_model: "",
});

const resetForm = () => {
  itemsForm.value.remarks = "";
  itemsForm.value.unit = 0;
  itemsForm.value.quantity = 0;
  itemsForm.value.item_serial_number = "";
  itemsForm.value.item_model = "";
};
const fillBrandForm = (item) => {
  console.log(item);
  itemsForm.value.brand_id = item.id;
  itemsForm.value.brand_name = item.name;
};

const addItem = async () => {
  try {
    // if (itemsForm.value.quantity <= 0) {
    //   Alert("warning", "Quantity Error!", 'Quantity must be greater than zero(0)');
    //   return false;
    // }

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    itemsForm.value.is_fixed = itemsForm.value.is_fixed ? 1 : 0;
    const formData = FormDx(itemsForm.value);
    // Append image files
    imageFiles.value.forEach((file) => {
      formData.append("item_images[]", file); // Using array notation for multiple files
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}user-requests/add`,
      formData,
      BearToken(token)
    );

    // Close the loading Swal once the request is completed
    Swal.close();

    Alert("success", "Success", response.data.message);
    resetForm();
    emits("transaction_id", Math.random());
    emits("close"); // Emit the close event to close the form
  } catch (error) {
    Swal.close();
    console.log(error);
    handleApiError(error);
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

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const unitsDropdown = async () => {
  units.value = await UNITS();
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
}
const ingredientsSubCategoryDropdown = async () => {
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredient-sub-categories/dropdown`,
      { id: 0 },
      BearToken(token)
    );
    sub_categories.value = response.data.subCategories;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
}
const addUnitBehavior = () => {
  resetForm();
  unitsDropdown();
  categoryDropdown();
};

onMounted(() => {
  addUnitBehavior();
  ingredientsCategoryDropdown();
});
</script>

<style scoped>
.cart-container {

}

.cart-content {
  max-height: calc(100vh - 240px); /* Adjust based on header/footer height */
}

.cart-items {
  padding-right: 16px; /* To handle scrollbar width */
}

.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.cart-item img {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.cart-item h3 {
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.quantity-display {
  min-width: 2rem;
  text-align: center;
}
</style>
