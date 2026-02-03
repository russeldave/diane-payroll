<template>
  <button
    @click.prevent="overrideBehavior()"
    class="bg-red-700 hover:opacity-70 focus:bg-red-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-l mb-4 float-end text-nowrap"
  >
    <i class="fas fa-ban"></i>
    Override
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'xl'"
    title="Override Conversion Rate"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="overrideStocks()">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="mb-2 block text-sm font-medium text-gray-700"
              >Conversion Name</label
            >
            <div class="relative">
              <div class="flex w-full px-2 py-2 border border-2 border-gray-400 rounded-lg bg-gray-200">
                <input
                  type="text"
                  id="ProductName"
                  v-model="overrideForm.conversion_name"
                  @input="handleSearchInput"
                  @focus="showZohoDropdown = true"
                  @blur="handleInputBlur"
                  placeholder="Input Conversion Name"
                  required
                  class="mt-2 p-2 border rounded-md w-full pr-10"
                />
                <!-- Search Loader -->
                <div 
                  v-if="searchLoading" 
                  class="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                </div>

                <!-- <div class="flex items-end">
                  <span class="text-lg font-bold italic text-red-500">
                    {{ ingredientForm.unit_abbre }}
                  </span>
                </div> -->
              </div>
              
              <!-- Zoho Items Dropdown -->
              <div 
                v-if="showZohoDropdown && zohoItems.length > 0" 
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                <div 
                  v-for="item in zohoItems" 
                  :key="item.id"
                  @mousedown="selectZohoItem(item)"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                >
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-sm text-gray-500">ID: {{ item.item_id }}</div>
                </div>
              </div>
              
              <!-- No Results Message -->
              <div 
                v-if="showZohoDropdown && !searchLoading && zohoItems.length === 0 && overrideForm.conversion_name.length >= 2" 
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
              >
                <div class="text-center text-gray-500">
                  No items found for "{{ overrideForm.conversion_name }}"
                </div>
              </div>
              
              <!-- Searching Message -->
              <div 
                v-if="showZohoDropdown && searchLoading" 
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
              >
                <div class="text-center text-gray-500">
                  Searching for "{{ overrideForm.conversion_name }}"...
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <div 
              class="block text-sm font-medium text-gray-700"
              >
              Conversion Rate:
              <span class="text-red-500 italic font-bold text-lg">
                1{{overrideForm.to_unit_abbre}} = {{ overrideForm.conversion_rate }} {{ ingredientForm.unit_abbre }}
              </span>
            </div>
            <div class="flex">
              <input
                type="number"
                id="ProductName"
                v-model="overrideForm.conversion_rate"
                placeholder="Input Conversion Rate"
                required
                class="mt-1 p-2 border rounded-md w-full"
              />
              <span class="text-white font-bold px-4 py-2 bg-green-500 rounded-r-lg">
                {{ ingredientForm.unit_abbre }}
              </span>
            </div>
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
import {
  VUE_APP_API_URL,
  PERMISSION,
} from "@/views/Utility/Global";
import {handleApiError, FormDx, BearToken, Alert, replaceUnderScore, useDebounce } from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);

// Search related variables
const zohoItems = ref([]);
const showZohoDropdown = ref(false);
const searchLoading = ref(false);
const searchThrottle = ref(null);
const lastSearchTime = ref(0);
const minSearchInterval = 500;

const overrideForm = ref({
    id:0,
    conversion_rate: 0,
    item_id: 0,
    to_unit_abbre: '',
    to_unit_id: 0,
    conversion_name: '',
    conversion_zoho_item_id: '',
});

const ingredientForm = ref({
    ingredient_name: 0,
    unit_abbre: 0,
});

const resetForm = () => {
  overrideForm.value = {
    id:0,
    conversion_rate: 0,
    conversion_name: '',
    conversion_zoho_item_id: '',
    item_id: 0,
    to_unit_abbre: '',
    to_unit_id: 0,
  };
  ingredientForm.value = {
    ingredient_name:'',
    unit_abbre: '',
  };
  
  // Clear search related states
  zohoItems.value = [];
  showZohoDropdown.value = false;
  searchLoading.value = false;
  
  // Clear any pending throttle timeout
  if (searchThrottle.value) {
    clearTimeout(searchThrottle.value);
    searchThrottle.value = null;
  }
};

const props = defineProps({
  data: Object,
  ingredient: Object,
});

const overrideBehavior = () => {
  const data = props.data;
  const ingredient = props.ingredient;
  console.log('overrideBehaviour');
  // console.log(props.ingredient)

  resetForm();
  overrideForm.value = {
    id: data.id,
    ingredient_conversion_id: data.id,
    conversion_rate: data.conversionRate,
    conversion_name: data.name,
    conversion_zoho_item_id: data.zohoItemId || '',
    item_id: data.itemId,
    to_unit_abbre: data.toUnitAbbre,
    to_unit_id: data.toUnitId,
  };

  ingredientForm.value = {
    ingredient_name:ingredient.ingredient_name,
    unit_abbre: ingredient.unit_abbre,
  };

  isAddModalOpen.value = true;
};

const overrideStocks = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(overrideForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/edit-conversion-rate`,
      formData,
      BearToken(token)
    );

    Swal.close();
    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    console.log(error);
    Alert("error", "Error", error.response.data.message);
  }
};

// Search functionality
// const handleSearchInput = () => {
//   // Clear any existing throttle timeout
//   if (searchThrottle.value) {
//     clearTimeout(searchThrottle.value);
//     searchThrottle.value = null;
//   }

//   const now = Date.now();
//   const timeSinceLastSearch = now - lastSearchTime.value;

//   // If enough time has passed since the last search, search immediately
//   if (timeSinceLastSearch >= minSearchInterval) {
//     performSearch();
//   } else {
//     // Otherwise, throttle the search
//     const delay = minSearchInterval - timeSinceLastSearch;
//     searchThrottle.value = setTimeout(() => {
//       performSearch();
//     }, delay);
//   }
// };

const handleSearchInput = useDebounce(async () => {
    await performSearch();
  }, 500);

const performSearch = async () => {
  lastSearchTime.value = Date.now();

  if (overrideForm.value.conversion_name.length >= 2) {
    searchLoading.value = true;
    showZohoDropdown.value = true;
    await getZohoItems();
  } else {
    zohoItems.value = [];
    showZohoDropdown.value = false;
    searchLoading.value = false;
  }
};

const handleInputBlur = () => {
  // Use a slightly longer delay to allow for item selection
  setTimeout(() => {
    showZohoDropdown.value = false;
  }, 300);
};

const getZohoItems = async () => {
  try {
    const formData = FormDx({
      search: overrideForm.value.conversion_name
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}zoho-books/search-items`,
      formData,
      BearToken(token)
    );
    
    // Assuming the API returns an array of items
    zohoItems.value = response.data.items || response.data.zohoItems || [];
    
  } catch (error) {
    console.error("Error fetching Zoho items:", error);
    zohoItems.value = [];
    // Don't show error alert for search functionality to avoid being intrusive
  } finally {
    searchLoading.value = false;
  }
};

const selectZohoItem = (item) => {
  overrideForm.value.conversion_name = item.name;
  overrideForm.value.conversion_zoho_item_id = item.item_id;
  console.log('Selected Zoho item:', item);
  
  zohoItems.value = [];
  showZohoDropdown.value = false;
  searchLoading.value = false;
};

// Call listItems when component is mounted
onMounted(() => {});
</script>