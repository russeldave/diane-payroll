<template>
  <div v-if="hasPermission('Navigation_Variance') & hasPermission('Navigation_Reports')">
      <!-- <div class="flex flex-col lg:flex-row justify-end mb-4">
        <div class="flex items-center mt-2 lg:mt-0 space-x-2">
          <label class="font-semibold text-gray-700">Date</label>
          <input 
            @change.prevent="setDatePhysicalCount"
            v-model="date_of_physical_count"
            type="date"
            class="border p-2 shadow shadow-gray-700 font-bold rounded"
          />
        </div>
      </div> -->
    <div class="px-2 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <BreadCrumbs :page="'Inventory'" />
      <div class="flex flex-col lg:flex-row justify-between items-center gap-4 mb-2">
        <div class="flex flex-row items-center gap-3">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Item..."
            class="shadow shadow-gray-700 focus-visible:bg-yellow-100 font-bold text-lg py-2 px-2 rounded-lg"
          />
          <select
            @change.prevent="searchInput()"
            class="shadow shadow-gray-700 focus-visible:bg-yellow-100 font-bold text-lg py-2 px-2 rounded-lg"
            v-model="search.type_id"
            >
             <option :value="0">All Types</option>
              <option
                v-for="type in types"
                :key="type.id"
                :value="type.id"
                >
                {{ type.name }}
              </option>
            <option
              :key=1
              :value=1
            >
              Ingredients
            </option>
            <option
              :key=2
              :value=2
            >
              Production
            </option>
            <option
              :key=3
              :value=3  
            >
            Butchery
            </option>
          </select>
          <select
            v-model="search.warehouse_id"
            @change="searchInput"
            class="shadow shadow-gray-700 focus-visible:bg-yellow-100 font-bold text-lg py-2 px-2 rounded-lg"
            >
            <option v-for="(w, ww) in warehouses" :key="w.value" :value="w.value">
              {{ w.label }}
            </option>
            <option value="0">All</option>
          </select>
          <div
            class="rounded-md p-2 flex items-center gap-2 cursor-pointer border-2 transition"
            :class="search.has_physical_count == 1
              ? 'border-red-500 bg-red-200'
              : 'border-gray-300'"
              @click.prevent="toggleHasPhysicalCount"
            >
            <span class="font-medium">
              Has Physical Count
            </span>
          </div>
        </div>
        <div class="w-full lg:w-auto flex justify-end"> 
          <button 
            @click.prevent="showConfirmApprove = true" 
            class="mx-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded shadow"
          >
          <i class="fa fa-thumbs-up mr-1"></i>
          Approve All
          </button>
          <button
            class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded shadow whitespace-nowrap"
            @click.prevent="downloadVariance"
            >
            <i class="fa fa-download mr-2"></i>
            Download
          </button>
        </div>

      <!-- Confirmation Modal -->
      <transition name="fade">
        <div 
          v-if="showConfirmApprove" 
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 text-center transform transition-all duration-300 scale-100">
            
            <!-- Case: No warehouse selected -->
            <div v-if="warehouseName.length == 0">
              <h2 class="text-xl font-semibold mb-4 text-red-600">⚠ Warehouse Required</h2>
              <p class="text-gray-600 mb-6">Please select a warehouse before approving.</p>
              <button
                @click="showConfirmApprove = false"
                class="w-full bg-gray-200 hover:bg-violet-6g00 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
              >
                OK
              </button>
            </div>
            
            <!-- Case: Warehouse selected -->
            <div v-else>
              <h2 class="text-2xl font-bold mb-4 text-gray-800">Confirm Approval</h2>
              <p class="mb-6 text-gray-600">
                Are you sure you want to approve all items in warehouse:
                <span class="block font-extrabold text-violet-600 text-2xl mt-2">{{ warehouseName }}</span>
              </p>
              
              <div class="flex justify-center gap-4">
                <button
                  @click="showConfirmApprove = false"
                  class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  @click="confirmAndShowSuccess"
                  class="flex-1 bg-violet-600 hover:bg-violet-300 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                >
                  Approve
                </button>
              </div>
            </div>

          </div>
        </div>
      </transition>

      </div>


      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-wrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              ></th>
              <th
                scope="col"
                width="15%"
                class="px-2 py-2 text-left text-xs font-medium uppercase border tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium uppercase border tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Beginning
              </th>
              <!-- <th
                scope="col"
                width="10%"
                class="px-2 py-2 text-center text-nowrap text-xs font-medium uppercase border tracking-wider"
              >
                Override Beginning
              </th> -->
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Added
              </th>
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Deduct
              </th>
              <!-- <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                Deduct (Utak POS)
              </th> -->
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Current
              </th>
              <!-- <th
                scope="col"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Total Cost
              </th> -->
              <th
                scope="col"
                width="15%"
                class="px-2 py-2 text-center text-nowrap text-xs font-medium uppercase border tracking-wider"
              >
                Input (Physical Count)
              </th>
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-center text-wrap text-xs font-medium uppercase border tracking-wider"
              >
                Physical Count
              </th>
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-right text-xs font-medium uppercase border-y border-4 tracking-wider"
              >
                O/S
              </th>
              <!-- <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                Status
              </th> -->
              <th
                scope="col"
                width="5%"
                class="px-2 py-2 text-right text-xs font-medium uppercase border tracking-wider"
              >
                Adj
              </th>
              <th
                scope="col"
                width="10%"
                class="px-2 py-2 text-center text-xs font-medium uppercase border tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-xs">
            <!-- Loop through products and display them -->
            <tr
              v-for="(ing, index) in data.warehouseItems"
              class="hover:bg-gray-200"
              v-if="data.warehouseItems?.length > 0"
              :key="ing.id"
            >
              <td class="px-2 py-2 border text-center">
                <div class="flex justify-center">
                  <!-- <TempCount :key="ing.id" :data="ing" /> -->
                  <ItemImage :key="ing.id" :data="ing" />
                </div>
              </td>
              <td class="px-2 py-2 border uppercase">
                <p class="text-wrap">
                  <span class="italic">
                    {{ ing.ingredientIdNumber ?? "-" }} 
                  </span>

                  - {{ing.ingredientCategoryName}} - 
                  <span class="font-bold">
                    {{ ing.itemName }}
                  </span>
                  <i class="text-red-500">[{{ ing.unitAbbre }}]</i>
                </p>
              </td>
              <td class="px-2 py-2 border text-left">{{ ing.warehouseName ?? "" }}</td>
              <td class="px-2 py-2 border text-right">
                {{ ing.beginning ?? 0 }} <sub>{{ ing.unitAbbre }}</sub>
              </td>
              <td class="px-2 py-2 border text-right">
                <Added :key="ing.id" :data="ing" />
              </td>
              <td class="px-2 py-2 border text-right">
                <Deducted :key="ing.id" :data="ing" />
              </td>
              <!-- <td class="px-2 py-2 border text-right">{{ ing.deductUtak ?? 0 }}</td> -->
              <td class="px-2 py-2 text-right">
                {{ ing.stocks ?? 0 }} <sub>{{ ing.unitAbbre }}</sub>
              </td>
              <!-- <td class="px-2 py-2 border text-right">{{ moneyFormatter((ing.stocks ?? 0) * (ing.costPrice ?? 0)) }}</td> -->
              <td class="px-2 py-2 border text-right">
                <div class="flex justify-center">
                  <TempCount :key="ing.id" :data="ing" />
                  <input
                    v-model="ing.physical_count"
                    type="number"
                    step="any"
                    class="border p-2 w-full flex text-left rounded-l focus-visible:bg-yellow-100"
                  />
                  <button
                    @click.prevent="addPhysicalCount(ing, index)"
                    title="Add Physical Count"
                    class="text-xs bg-red-500 p-2 text-white rounded-r"
                  >
                    <i class="fa fa-box"></i>
                  </button>
                </div>
              </td>
              <td class="px-2 py-2 border text-center">
                <p>
                  {{ ing.physicalCount ?? 0 }} <sub>{{ ing.unitAbbre }}</sub>
                </p>
                <small class="text-gray-600">{{ ing.dateOfAdjusted }}</small>
              </td>
              <td
                class="px-2 py-2 border-y border-4 text-right"
                :class="ing.OS >= 0 ? 'text-black-500' : 'text-red-500'"
              >
                {{ ing.OS ?? 0 }} <sub>{{ ing.unitAbbre }}</sub>
              </td>
              <!-- <td class="px-2 py-2 border text-center">
                <span class="rounded-full px-2 py-1 bg-red-500 text-white">Shortage</span>
              </td> -->
              <td
                class="px-2 py-2 border text-right"
                :class="ing.adjusted >= 0 ? 'text-black-500' : 'text-red-500'"
              >
                {{ ing.adjusted ?? 0 }} <sub>{{ ing.unitAbbre }}</sub>
              </td>
              <td class="px-2 py-2 border text-center">
                <div class="flex justify-center text-nowrap">
                  <button
                    @click.prevent="approveDisapprove(ing, 1)"
                    class="text-xs bg-green-500 p-2 text-white rounded-l"
                  >
                    <i class="fa fa-thumbs-up"></i>
                    Approve
                  </button>
                  <button
                    @click.prevent="approveDisapprove(ing, 0)"
                    class="text-xs bg-red-500 p-2 text-white rounded-r"
                  >
                    <i class="fa fa-thumbs-down"></i>
                    Reject
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="loading == true">
              <td
                class="px-2 py-2 border text-center text-red-500 font-bold"
                colspan="15"
              >
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td
                class="px-2 py-2 border text-center text-red-500 font-bold"
                colspan="15"
              >
                ***No Variance found***
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex w-full overflow-auto">
        <Paginator
          v-if="data.totalrows"
          :page_number="search.page_num"
          :total_rows="data.totalrows"
          :itemsperpage="search.itemsperpage"
          @page_num="handlePagination"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import ImageViewer from "@/views/Component/ImageViewer.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  barcodeConverter,
  useDebounce,
  handleApiError,
  moneyFormatter,
  Toast,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

import Added from "./Actions/Added.vue";
import Deducted from "./Actions/Deducted.vue";
import TempCount from "./Actions/TempCount.vue";
import ItemImage from "./Actions/ItemImage.vue";

const showConfirmApprove = ref(false);
const showSuccessModal = ref(false);
const token = localStorage.getItem("token");
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const warehouses = ref([]);
const warehouseName = ref('');
const loading = ref(false);
const data = ref({});
const date_of_physical_count = ref('');
const categories = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  warehouse_id: 0,
  category_id: 0,
  has_physical_count: 0
});
const searchInput = useDebounce(async () => {
  getWarehouseName(search.value.warehouse_id);
  search.value.page_num = 1;
  await listItemVariances();
  handlePagination(1);
}, 500);
const listItemVariances = async () => {
  try {
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}variances/list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;

    data.value.warehouseItems?.forEach((item) => {
      item.override_beginning = 0;
      item.physical_count = item.count;
    });

    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listItemVariances();
};
const handleTransaction = (transaction_id) => {
  listItemVariances();
};

const toggleHasPhysicalCount = () => {
  // console.log('toggleHasPhysicalCount');
  // console.log(search.value.has_physical_count)
  search.value.has_physical_count = search.value.has_physical_count == 1 ? 0:1
  listItemVariances()
}

const warehouseDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}warehouses/dropdown`,
      BearToken(token)
    );
    warehouses.value = response.data.warehouses;
  } catch (error) {
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

const overrideBeginning = async (item, index) => {
  try {
    const formData = FormDx({
      warehouse_item_id: item.id,
      stocks: item.override_beginning,
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}variances/override-beginning`,
      formData,
      BearToken(token)
    );

    Toast("success", "Success", response.data.message);
    listItemVariances();
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};
const addPhysicalCount = async (item,index) => {
  try {
    const formData = FormDx({ 
      warehouse_item_id: item.id, 
      physical_count: item.physical_count, 
      physical_count_id: item.physicalCountId, 
      date_of_physical_count: date_of_physical_count.value,
    });
    const response = await axios.post(`${VUE_APP_API_URL}variances/add-physical-count`,formData, BearToken(token));

    Toast("success", "Success", response.data.message);
    listItemVariances();
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};
const approveDisapprove = async (item, is_approve) => {
  try {
    const formData = FormDx({ warehouse_item_id: item.id, is_approve: is_approve });
    const response = await axios.post(
      `${VUE_APP_API_URL}variances/approve-adjusted`,
      formData,
      BearToken(token)
    );

    Toast("success", "Success", response.data.message);
    listItemVariances();
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};

const getDatePhysicalCount = async (item,index) => {
  try {
    const response = await axios.get(`${VUE_APP_API_URL}settings/get-date-of-physical-count`, BearToken(token));
    Toast("success", "Success", response.data.message);
    date_of_physical_count.value = response.data.dateOfPhysicalCount;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
}

const downloadVariance = () => {
  const url = `${VUE_APP_API_URL}variance-download-excel/physical-counts/${search.value.warehouse_id}`;
  window.open(url, '_blank');
};

//-- find warehouseName in warehouses object
const getWarehouseName = (warehouse_id) => {
  const warehouseName1 = warehouses.value.find(w => w.value === warehouse_id);
  warehouseName.value = warehouseName1 ? warehouseName1.label : '';
}

const confirmAndShowSuccess = async () => {
  Swal.fire({
    title: 'Processing...',
    text: 'Checking credentials...',
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false,
  });

  try {
    const formData = FormDx({ warehouse_id: search.value.warehouse_id });
    const response = await axios.post(
      `${VUE_APP_API_URL}variances/approve-all-in-warehouse`,
      formData,
      BearToken(token)
    );

    if (!response.data.error) {// if error from server is false
     // ✅ Success case
  setTimeout(() => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: response.data.message,
      showConfirmButton: false,
      timer: 1500
    });
  }, 3000);

  showConfirmApprove.value = false;
    } else {
      // ❌ Failure case
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: response.data.message || 'Something went wrong',
        confirmButtonText: 'Retry',
      });
    }
  } catch (error) {
    Swal.close();
    console.error(error);
    handleApiError(error);
  }
};


// Call listItemVariances when component is mounted
onMounted(() => {
  ingredientsCategoryDropdown();
  listItemVariances();
  getDatePhysicalCount();
  warehouseDropdown();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

