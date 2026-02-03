<template>
  <button
    @click.prevent="getmrfReceived()"
    class="bg-orange-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 rounded px-3 mb-4 float-end text-nowrap"
  >
    <i class="fa fa-check"></i> Received
  </button>

  <Modal
    :show="isViewModalOpen"
    :maxWidth="'8xl'"
    title="Received"
    @close="closeModal()"
  >
    
    <div  class="flex flex-col md:flex-row md:justify-between mb-4 mt-4">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 mt-4"
      >
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
          <!-- <option value="1">Hourly</option> -->
          <option value="2">Daily</option>
          <option value="3">Weekly</option>
          <option value="4">Monthly</option>
        </select>

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
        <div
          class="w-full shadow shadow-gray-700 font-semibold text-base px-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
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
         <a
          target="_blank"
          v-if="hasPermission('Sales_Report_Button')"
          :href="`${VUE_APP_API_URL}ingredient-reports-download-excel/recieved/${search.type}/${search.date}/${search.user_id}`"
          @click="
            console.log(
              `${VUE_APP_API_URL}ingredient-reports-download-excel/recieved/${search.type}/${search.date}/${search.user_id}`
            )
          "
          class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 items-center flex w-full justify-center font-bold text-sm md:text-md py-3 rounded px-4 float-end text-nowrap"
        >
          <i class="fa fa-file-excel"></i>
          <span>&nbsp;Generate Excel Report</span>
        </a>
        <a
          target="_blank"
          v-if="hasPermission('Sales_Report_Button')"
          :href="`${VUE_APP_API_URL}ingredient-reports-download-excel/recieved-no-total/${search.type}/${search.date}/${search.user_id}`"
          @click="
            console.log(
              `${VUE_APP_API_URL}ingredient-reports-download-excel/recieved-no-total/${search.type}/${search.date}/${search.user_id}`
            )
          "
          class="bg-purple-500 text-white hover:opacity-70 focus:bg-purple-300 items-center flex w-full justify-center font-bold text-sm md:text-md py-3 rounded px-4 float-end text-nowrap"
        >
          <i class="fa fa-file-excel"></i>
          <span>&nbsp;Download Table</span>
        </a>
      </div>
    </div>
    <div class="flex w-full overflow-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
          <tr class="border-b-2 border-solid border-yellow-500">
            <th class="px-7 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Date Received</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Ingredient Name</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Stored in Warehouse</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Supplier</th>

            <th class="px-6 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Quantity</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Unit</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Price</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Amount</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Received By</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray uppercase tracking-wider border">Remarks</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-amber-100">
          <template v-if="!loading && data.recivedIngreints?.length > 0">
            <tr
              v-for="mrf in data.recivedIngreints"
              :key="mrf.id"
              class="hover:bg-gray-300"
            >
              <td class="px-3 py-3 border text-center">
                {{ mrf.dateOfReceived }}
              </td>

              <td class="px-4 py-4 border text-center">
              <span class="font-bold"> {{ mrf.ingredientIdNumber }}</span> - {{ mrf.itemName }} <span class=" italic text-xs font-semibold text-red-600">[{{ mrf.unitAbbre}}]</span>
              </td>

              <td class="px-3 py-3 border text-center">
                {{ mrf.storeInWarehouseName }}
              </td>

              <td class="px-3 py-3 border text-center">
                {{ mrf.supplierName }}
              </td>

            <td 
              class="px-3 py-3 border text-center text-white text-xl text-nowrap bg-green-600 font-bold">
                {{ Number (mrf.receivedQuantity).toLocaleString() }} <span class="text-sm font-semibold text-amber-400">{{ mrf.unitAbbre}}</span>
              </td>

              <td 
              class="px-3 py-3 border text-center">
              {{ mrf.unitAbbre}}
              </td>

              <td class="px-3 py-3 border text-center">
                {{ Number(mrf.price).toLocaleString() }}
              </td>

              <td class="px-3 py-3 border text-center">
                ₱ {{ mrf.total }}
              </td>

              <td class="px-3 py-3 border text-center">
                {{ mrf.receivedByUserName}}
              </td>

              <td class="px-3 py-3 border text-center">
                {{ mrf.remarks}}
              </td>
            </tr>
          </template>
          <tr v-else-if="loading">
            <td class="px-2 py-2 border text-center" colspan="10">
              <Loader />
            </td>
          </tr>
          <tr v-else>
            <td class="px-20 py-20 border text-center text-red-500 font-bold" colspan="10">
              *** No Data Received ***
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex w-full overflow-auto">
      <Paginator
        v-if="data.totalrows > 0 && !loading"
        :page_number="search.page_num"
        :total_rows="data.totalrows"
        :itemsperpage="search.itemsperpage"
        @page_num="handlePagination"
      />
    </div>
  </Modal>
</template>
<script setup>
import { onMounted, ref, watch, computed } from "vue";
import axios from "axios";
import { hasPermission } from "@/views/Utility/Permissions";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import MRFItemSummary from "./MRFSlipForReleasing/Actions/MRFItemSummary.vue";
const emits = defineEmits(["transaction_id"]);

const token = localStorage.getItem("token");
const isViewModalOpen = ref(false);
const loading = ref(false);
const props = defineProps({
  mrfs: Object,
});
const data = ref({
  mrfReceived: [],
  totalrows: 0,
});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
  user_id: 0, // Default to current user
});

const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getmrfReceived();
  handlePagination(1);
}, 500);

const getmrfReceived = async () => {
  try { 
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}direct-receiveds/list-direct-and-pr`,
      formData,
      BearToken(token)
    );
       isViewModalOpen.value = true;

       console.log("dsa",response.data);
       
    if (response.data) {
      data.value = response.data;
    } else {
      data.value = { mrfReceived: [], totalrows: 0 };
    }
 
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getmrfReceived();
};

const handleDateChange = () => {
  search.value.page_num = 1;
  getmrfReceived();
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
getmrfReceived()
};
// onMounted(() => {
//   getmrfReceived();
// });
const fillUserForm = (data) => {
  search.value.user_id = data.id;
  getmrfReceived();
};
const handleTransaction = () => {
  getmrfReceived();
  emits("transaction_id", Math.random() + "transactions-done");
};

const closeModal = () => {
  search.value.search = "";
  isViewModalOpen.value = false;
};
</script>
