<template>
  <div
    v-if="hasPermission('Return_Item_Tab') && hasPermission('Navigation_Transactions')"
  >
    <div class="p-4 min-h-screen rounded-lg dark:border-gray-700">
      <div class="flex flex-col md:flex-row md:justify-between mb-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 mt-4">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="searchInput()"
          placeholder="Search Items..."
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
        />
        <select
          v-model="search.type"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleTypeChange"
        >
          <option value="0">All</option>
          <option value="1">Hourly</option>
          <option value="2">Daily</option>
          <option value="3">Weekly</option>
          <option value="4">Monthly</option>
        </select>

        <input
          v-if="search.type === '1'"
          type="datetime-local"
          v-model="search.date"
          class="shadow shadow-gray-700 flex w-full font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
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
        
        <select
          @change.prevent="searchInput()"
          v-model="search.return_type_id"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          >
          <option value="4">All</option>
          <option value="0">Brand New</option>
          <option value="1">Repaired</option>
          <option value="2">Scrap/Damage</option>
        </select>
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
        <!-- Centered label, bigger checkbox, full width on mobile -->
        <label
          class="flex text-nowrap text-red-500 items-center gap-2 text-sm font-semibold w-full md:w-auto"
        >
          <input
            type="checkbox"
            v-model="search.is_repaired"
            @change="searchInput()"
            class="w-5 h-5 accent-red-500"
          />
          <span>Show Repaired</span>
        </label>
      </div>
      </div>

      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <!-- <th
                  scope="col"
                  class="px-2 py-3 border text-center text-xs md:text-sm font-medium  uppercase tracking-wider"
                >
                  SKU/Barcode
                </th> -->
              <th
                scope="col"
                width="10%"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Return ID
              </th>
              <th
                scope="col"
                width="10%"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Date Returned
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider text-nowrap"
              >
                Item Name
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                width="15%"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                From Location
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Warehouse
              </th>
              <th
                scope="col"
                width="10%"
                class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                width="15%"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Returned By
              </th>
              <th
                scope="col"
                width="5%"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Inputted By
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm text-nowrap">
            <!-- Loop through products and display them -->
            <tr
              v-if="data.items?.length > 0 && loading == false"
              v-for="item in data.items"
              :title="'Remarks: ' + item.remarks"
              :key="item.id"
            >
              <!-- <td class="px-2 py-2 border">
                  <svg :id="'barcode' + item.id" class="w-full h-30"></svg>
                </td> -->
              <!-- <td>
                  <ItemImageViewer v-if="item.id" :item_id="item.id" :thumbnail="item.thumbnail" :canDeleteImage="false"/>
                </td> -->
              <td
                class="px-2 py-2 border text-left font-bold first-letter:capitalize text-wrap"
              >
                {{ item.returnItemNumber ?? "-" }}
              </td>
              <td
                class="px-2 py-2 border text-left font-bold first-letter:capitalize text-wrap"
              >
                {{ item.dateOfReturned }}
              </td>
              <td
                class="px-2 py-2 border text-left font-bold bg-yellow-50 first-letter:capitalize text-wrap"
              >
                <ItemTitle
                  :key="item.itemId"
                  :item_id="item.itemId"
                  :item_name="item.itemName"
                />
              </td>
              <td class="px-2 py-2 border text-left">{{ item.returnTypeName ?? "-" }}</td>
              <td class="px-2 py-2 border text-left text-wrap">
                {{ item.fromLocationName ?? "-" }}
              </td>
              <td class="px-2 py-2 border text-left text-wrap">
                {{ item.warehouseName ?? "-" }}
              </td>
              <!-- <td class="px-2 py-2 border text-right">
                  <p>{{ item.quantityPerUnit ?? 0 }}/{{ item.unitAbbre }}</p>
                </td> -->
              <td class="px-2 py-2 border text-right font-bold bg-yellow-50">
                <p>{{ item.quantity ?? 0 }} {{ item.unitAbbre }}</p>
              </td>
              <td class="px-2 py-2 border text-left">{{ item.employeeName }}</td>
              <td class="px-2 py-2 border text-left">{{ item.userName }}</td>
              <td class="px-2 py-2 border">
                <div class="flex justify-center">
                  <ProofViewer :key="item.id" :data="item" "/>
                </div>
              </td>
            </tr>
            <tr v-if="loading == true">
              <td
                class="px-2 py-2 border text-center text-red-500 font-bold"
                colspan="11"
              >
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td
                class="px-2 py-2 border text-center text-red-500 font-bold"
                colspan="11"
              >
                ***No Items found***
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
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";
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
  typeFormatter,
  handleApiError,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

//actions
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import ProofViewer from "./Actions/ProofViewer.vue";

const props = defineProps({
  warehouse_id: Number,
});
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const token = localStorage.getItem("token");
const data = ref({});
const loading = ref(false);
const categories = ref([]);

const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  is_repaired: false, // <-- add this line
  warehouse_id: props.warehouse_id || 0,
  return_type_id: 4, // 0 = Brand New, 1 = Repaired, 2 = Scrap/Damage, 4 = All
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
  user_id: 0, // Default to current user
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listItems();
  handlePagination(1);
}, 500);

const listItems = async () => {
  try {
    loading.value = true;
    // Do NOT mutate search.value.is_repaired directly, send a copy to API
    const searchPayload = {
      ...search.value,
      is_repaired: search.value.is_repaired ? 1 : 0,
    };
    const formData = FormDx(searchPayload);
    const response = await axios.post(
      `${VUE_APP_API_URL}return-items/list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listItems();
};

const handleTransaction = (transaction_id) => {
  listItems();
};

const handleDateChange = () => {
  search.value.page_num = 1;
  listItems();
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
  listItems();
};

const fillUserForm = (data) => {
  search.value.user_id = data.id;
  listItems();
};

const generateBarcodesForItems = async (items) => {
  for (let item of items) {
    const barcodeId = `#barcode${item.id}`;
    const textToEncode = item.sku; // Adjust this based on your item data structure

    try {
      // Generate barcode for each item
      await barcodeConverter(barcodeId, textToEncode);
    } catch (error) {
      handleApiError(error);
    }
  }
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
};
// Call listItems when component is mounted
onMounted(() => {
  categoryDropdown();
  listItems();
});
</script>
