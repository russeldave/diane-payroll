<template>
  <button
  
    @click.prevent="assignButtonBehavior()"
    type="button"
    :class="[
      'inline bg-lime-500 text-white hover:opacity-70 hover:border-4 hover:border-lime-700 focus:bg-lime-300 font-bold text-sm md:text-md py-2 px-1 rounded-lg hover:scale-110',
      className,
    ]"
  >
    <!-- <i class="fas fa-warehouse"></i> -->
    Conversions
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'6xl'"
    title="Assign Conversion"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-1 mb-2" @submit.prevent="assignConversions()" autocomplete="off">
        <div class="grid grid-cols-1">
          <div class="mb-2">
            <div class="flex text-xl font-bold">
              <span>
                {{ ingredientForm.ingredient_name }}
              </span>
              <span class="italic text-red-500">
                &nbsp;[{{ ingredientForm.unit_abbre }}]
              </span>
            </div>
          </div>
          <div class="mb-2 border border-4 border-green-600 p-2 rounded-md">
            <label for="LeagueName" class="block text-lg font-medium text-gray-700"
              >Assign Units:</label
            >
            <div class="relative">
              <div class="relative">
                <input 
                  class="w-full border rounded-lg border-2 p-2 mb-2 pr-10"
                  type="text"
                  @input="handleSearchInput"
                  @focus="showZohoDropdown = true"
                  @blur="handleInputBlur"
                  v-model="ingredientForm.conversion_name"
                  placeholder="Input Conversion Name..."
                  name="conversionName"
                />
                <!-- Search Loader -->
                <div 
                  v-if="searchLoading" 
                  class="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-lime-500"></div>
                </div>
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
                v-if="showZohoDropdown && !searchLoading && zohoItems.length === 0 && ingredientForm.conversion_name.length >= 2" 
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
              >
                <div class="text-center text-gray-500">
                  No items found for "{{ ingredientForm.conversion_name }}"
                </div>
              </div>
              <!-- Searching Message -->
              <div 
                v-if="showZohoDropdown && searchLoading" 
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
              >
                <div class="text-center text-gray-500">
                  Searching for "{{ ingredientForm.conversion_name }}"...
                </div>
              </div>
            </div>
            <div class="flex space-x-2">
              <select
                class="mt-1 p-2 border rounded-md w-full"
                v-model="ingredientForm.to_unit_id"
                @change="onUnitChange"
                >
                <option value="0">--Select Units--</option>
                <option
                  v-for="unit in units"
                  :key="unit.id"
                  :value="unit.value"
                  >
                  {{ unit.label }}
                </option>
              </select>
              <input 
                class="w-[20rem] border rounded-lg border-4 p-2"
                type="number" 
                v-model="ingredientForm.conversion_rate"
                placeholder="Input Conversion Rate..."
                name="conversionRate"
              >
              <span class="flex w-[25rem] text-center items-center text-red-600">1{{ ingredientForm.to_unit_abbre }} = {{ ingredientForm.conversion_rate }} {{ingredientForm.unit_abbre}}</span>
              <button
                class="bg-lime-500 rounded px-4 text-white font-bold hover:bg-lime-600"
                @click.prevent="assignConversions"
                >
                Assign
              </button>
            </div>
          </div>
        </div>
      </form>
      <div class="block mt-4 border-t-2 border-dashed">
        <label for="LeagueName" class="block text-md font-medium mb-3 text-gray-700"
          >Conversions:</label
        >
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
              >
                Conversion name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-md font-medium uppercase tracking-wider"
              >
                Convert To Unit
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-md font-medium uppercase tracking-wider"
              >
                Conversion Rate
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-md font-medium uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loop through products and display them -->
            <tr
              v-for="(i, ii) in assignedUnitConversions?.conversions"
              v-if="assignedUnitConversions?.conversions?.length > 0"
              :key="ii"
              :class="i.warehouseItemStatus === 7 ? 'bg-slate-400' : ''"
            >
              <td class="px-2 py-2 border">
                <div class="w-[300px] flex flex-col">
                    <span class="font-bold">
                      {{ i.name }}
                    </span>
                    <span class="text-sm italic text-zinc-500">
                      zoho: {{ i.zohoItemId }}
                    </span>
                </div>
              </td>
              <td class="px-2 py-2 border">
               1{{ i.toUnitAbbre }}
              </td>
              <td class="px-2 py-2 border text-right">
                <span>
                  {{ i.conversionRate }}
                </span>
                <span class="text-red-500 italic">
                  {{ ingredientForm.unit_abbre }}
                </span>
              </td>
              <td class="px-2 py-2 border ">
                <div class="flex justify-center">
                  <OverrideConversionRate
                    v-if="hasPermission('General_Inventory_Override_Stocks_Button')"
                    :data="i"
                    :ingredient="ingredientForm"
                    @transaction_id="handleTransaction"
                  />
                  <button
                    @click.prevent="unAssignUnits(i)"
                    type="button"
                    class="ms-2 bg-red-500 hover:bg-red-600 text-white rounded font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
                  >
                    Unassign
                  </button>
                </div>
              </td>
            </tr>
            <tr v-else>
              <td class="px-2 py-2 border" colspan="6">
                <p class="text-red-500 font-bold text-center">
                  **No Warehouse Assigned**
                </p>
              </td>
            </tr>
          </tbody>
        </table>
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
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  WAREHOUSE,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
  useDebounce,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { hasPermission } from "@/views/Utility/Permissions";
//modules
import OverrideConversionRate from "@/views/Pages/Ingredients/Actions/OverrideConversionRate.vue";

const units = ref([]);
const zohoItems = ref([]);
const showZohoDropdown = ref(false);
const searchLoading = ref(false);
const searchThrottle = ref(null); // Throttle timeout reference
const lastSearchTime = ref(0); // Track last search time
const minSearchInterval = 500; // Minimum time between searches in ms

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const store = ref([]);
const assignedUnitConversions = ref([]);
const ingredientForm = ref({
  item_id: 0,
  to_unit_id: 0,
  to_unit_abbre: '',
  to_unit_name: "",
  conversion_rate: 0,
  conversion_name:'',
  conversion_zoho_item_id:'',
});
const searchUnits = ref({
  item_id: props.data.item_id,
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const assignButtonBehavior = () => {
  console.log("assignButtonBehavior");
  console.log(props.data);
  isAddModalOpen.value = true;
  getUnitsDropdown();

  resetForm();
  fillForm();
  listAssignedConversions();
};

const resetForm = () => {
  ingredientForm.value.ingredient_id = 0;
  ingredientForm.value.ingredient_name = "";
  ingredientForm.value.warehouse_id = "";
  ingredientForm.value.conversion_name = '';
  ingredientForm.value.conversion_zoho_item_id = "";
  zohoItems.value = [];
  showZohoDropdown.value = false;
  searchLoading.value = false;
  // Clear any pending throttle timeout
  if (searchThrottle.value) {
    clearTimeout(searchThrottle.value);
    searchThrottle.value = null;
  }
};

const fillForm = () => {
  const data = props.data;
  // console.log('fillForm in line: 301')
  // console.log(data);

  ingredientForm.value.item_id = data.item_id;
  ingredientForm.value.ingredient_name = data.item_name ?? data.itemName;
  ingredientForm.value.unit_abbre = data.unit_abbre ?? data.unitAbbre;
  ingredientForm.value.unit_id = data.unit_id;

  searchUnits.value.ingredient_id_number = data.ingredientIdNumber ?? '';
};

const listAssignedConversions = async () => {
  try {
    assignedUnitConversions.value = [];
    const formData = FormDx(searchUnits.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/get-ingredient-conversions`,
      formData,
      BearToken(token)
    );
    assignedUnitConversions.value = response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const assignConversions = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx({
      item_id: ingredientForm.value.item_id,
      to_unit_id: ingredientForm.value.to_unit_id,
      conversion_rate: ingredientForm.value.conversion_rate,
      conversion_name: ingredientForm.value.conversion_name,
      conversion_zoho_item_id: ingredientForm.value.conversion_zoho_item_id
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}ingredients/assign-conversion`,
      formData,
      BearToken(token)
    );

    Swal.close();
    Alert("success", "Success", response.data.message);
    listAssignedConversions();
    resetForm();
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};

const unAssignUnits = async (data) => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to unassign this conversion. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, unassign it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show the processing alert
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({
        ingredient_id_number: ingredientForm.value.ingredient_id_number,
        ingredient_warehouse_id: data.id,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}ingredients/unassign-to-warehouse`,
        formData,
        BearToken(token)
      );

      Swal.close();
      Alert("warning", "Unassigned!", response.data.message);
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    listAssignedConversions();
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};

const getUnitsDropdown = async () => {
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}units/dropdown`,
      {},
      BearToken(token)
    );
    units.value = response.data.units;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};

const handleSearchInput = useDebounce(async () => {
    // search.value.page_num = 1;
    // search.value.is_show_deleted = search.value.is_show_deleted ? 1 : 0;
    await performSearch();
  }, 500);

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

const performSearch = async () => {
  lastSearchTime.value = Date.now();

  if (ingredientForm.value.conversion_name.length >= 2) {
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
      search: ingredientForm.value.conversion_name
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}zoho-books/search-items`,
      formData,
      BearToken(token)
    );
    console.log(response.data.zohoItems);
    
    // Assuming the API returns an array of items
    zohoItems.value = response.data.items || response.data.zohoItems|| [];
    
  } catch (error) {
    console.error("Error fetching Zoho items:", error);
    zohoItems.value = [];
    // Don't show error alert for search functionality to avoid being intrusive
  } finally {
    searchLoading.value = false;
  }
};

const selectZohoItem = (item) => {
  ingredientForm.value.conversion_name = item.name;
  ingredientForm.value.conversion_zoho_item_id = item.item_id;
  console.log(item);
  
  zohoItems.value = [];
  showZohoDropdown.value = false;
  searchLoading.value = false;
};

const onUnitChange = (e) => {
  const unitId = Number(e.target.value)

  const unit = units.value.find(u => u.value === unitId)
  // console.log('onUnitChange');
  // console.log(unit)

  if (!unit) {
    ingredientForm.value.to_unit_abbre = ''
    return
  }

  ingredientForm.value.to_unit_abbre = unit.label
}

const handleTransaction = (transactionId) => {
  listAssignedConversions();
  emits("transaction_id", transactionId);
};
</script>