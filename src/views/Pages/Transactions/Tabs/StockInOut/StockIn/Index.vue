<template>
  <div>
    <div
      class="dark:border-gray-700 overflow-x-auto overflow-y-hidden p-2"
    >
    <div class="flex flex-col md:flex-row md:justify-between mb-4 mt-4">
     <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 mt-4">
          <!-- Search Text -->
          <input
            type="search"
            placeholder="Search Requested Item..."
            v-model="search.search"
            @input.prevent="searchInput()"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          />

          <!-- Type Select -->
          <select
            v-model="search.type"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleTypeChange"
          >
            <option value="0">--All Dates--</option>
            <option value="2">Daily</option>
            <option value="3">Weekly</option>
            <option value="4">Monthly</option>
          </select>

          <!-- Conditional Date Inputs -->
          <input
            v-if="search.type === '1'"
            type="datetime-local"
            v-model="search.date"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '2'"
            type="date"
            v-model="search.date"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '3'"
            type="week"
            v-model="search.date"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '4'"
            type="month"
            v-model="search.date"
            class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
            @change="handleDateChange"
          />

          <!-- User Search Dropdown -->
          <div class= "w-full shadow shadow-gray-700 font-semibold text-base  px-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" >
            <SearchDropdown
              apiEndpoint="users/search-name-only"
              :searchModel="searchUser"
              placeholder="Search User"
              itemLabel="name"
              itemId="id"
              inputId="userName"
              @item-selected="(data) => fillUserForm(data)"
              dataKey="users"
              returnName="['name']"
            
              />
          </div>
      </div>
        <!-- <AddAccount @transaction_id="handleTransaction"/> -->
      </div>

      <div class="flex w-full overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="text-white shadow" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500 text-nowrap">
              <th
                scope="col"
                class="px-4 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Date of Out
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Warehouse
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Ingredient Name
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Employee Name
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
            <!-- Loop through products and display them -->
            <tr
              v-for="item in data.stockins"
              v-if="data.stockins?.length > 0 && loading == false"
              :key="item.id"
              :title="'Created By: ' + item.userName"
              >
              <td class="px-2 py-2 border">
                {{ item.dateStockOut }} test
              </td>
              <td class="px-2 py-2 border">
                <div class="">{{ item.warehouseName }}</div>
              </td>
              <td class="px-2 py-2 border">
                <span class="italic ">
                  {{ item.itemNumber }}&nbsp;
                </span>
                <span class="font-bold text-lg">
                  {{ item.itemName }}
                </span>
                <span class="text-red-500 italic font-bold">
                  [{{ item.unitAbbre }}]
                </span>
              </td>

              <td class="px-2 py-2 border">
                {{ item.quantity }}
              <span class="text-red-500 italic">{{ item.unitAbbre }}</span>
            </td>
              <td class="px-2 py-2 border">
                {{ item.userName ?? "-" }}
              </td>
              <td class="px-2 py-2 border text-center">
                <div class="flex justify-center">
                </div>
              </td>
            </tr>
            <tr v-if="loading == true">
              <td
                class="px-2 py-2 border text-center text-red-500 font-bold"
                colspan="10"
              >
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td
                class="px-2 py-2 border text-center text-red-500 font-bold"
                colspan="10"
              >
                ***No Items Found***
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        v-if="data.totalrows"
        :page_number="search.page_num"
        :total_rows="data.totalrows ?? 0"
        :itemsperpage="search.itemsperpage"
        @page_num="handlePagination"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { hasPermission } from "@/views/Utility/Permissions";
import {
  FormDx,
  BearToken,
  useDebounce,
  barcodeConverter,
  handleApiError,
} from "@/views/Utility/Helper";
import Pagination from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";


import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import ItemImageViewer from "@/views/Pages/Items/Actions/ItemImageViewer.vue";

const token = localStorage.getItem("token");
const loading = ref(false);
const user_request_id = ref(0);
const data = ref([]);
const images = ref([]); // Stores the selected image for the modal

const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

// Other existing code...
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
  user_id: 0, // Default to current user
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listStockIns();
  handlePagination(1);
}, 500);

const listStockIns = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      VUE_APP_API_URL + "stock-in-and-out/get-stock-in",
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listStockIns();
};

const handleTransaction = (id) => {
  listStockIns(); // Refresh the employee list
  console.log("Transaction handled:", id);
};

const handleDateChange = () => {
  search.value.page_num = 1;
  listStockIns();
};

const handleTypeChange = () => {
  // Reset date format based on type
  if (search.value.type === "2") {
    // For daily, use YYYY-MM-DD format
    search.value.date = new Date().toISOString().split("T")[0];
  } else {
    // For monthly, use YYYY-MM format
    search.value.date = new Date().toISOString().slice(0, 7);
  }
  listStockIns();
};

const fillUserForm = (data) => {
  search.value.user_id = data.id;
  listStockIns();
};
onMounted(() => {
  listStockIns();
});
</script>
