<template>
  <div class="mt-3 min-h-screen rounded-lg dark:border-gray-700">
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
            <option value="0">All Dates</option>
            <!-- <option value="1">Hourly</option> -->
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
      <div class="flex gap-2 justify-end">
        <!-- <Request  v-if="hasPermission('MRF_Request_Items_Button')" :warehouse_id="props.warehouse_id" @transaction_id="handleTransaction()"/>
       <Transfer v-if="hasPermission('MRF_Transfer_Items_Button')" :warehouse_id="props.warehouse_id" @transaction_id="handleTransaction()"/> -->
      </div>
    </div>
    <div class="flex w-full overflow-auto">
      <!-- Table to display products -->
      <table class="min-w-full divide-y divide-gray-200 text-nowrap">
        <!-- Table headers -->
        <thead class="text-white shadow" :class="DEFAULT_BG">
          <tr class="border-b-2 border-solid border-yellow-500">
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Date Requested
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              MRF No.
            </th>
            <!-- <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              MRF Manual No.
            </th> -->
            <!-- <th
              scope="col"
              width="15%"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Proof
            </th> -->
            <th
              scope="col"
              title="Quantity per Unit"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Created By
            </th>
            <th
              scope="col"
              width="15%"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Remark
            </th>
            <th
              scope="col"
              width="50%"
              class="px-6 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Items List
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
          <!-- Loop through products and display them -->
          <tr
            v-for="mrf in data.mrfs"
            v-if="data.mrfs?.length > 0 && loading == false"
            :key="mrf.id"
            :title="'Requested By:' + mrf.requestedByEmployeeName"
            class="text-nowrap hover:bg-gray-200"
          >
            <td class="px-2 py-2 border text-center">
              <p class="text-md font-bold">{{ mrf.dateOfmrf }}</p>
                  <!-- <span
                :class="mrfStatusClassFormatter(mrf.status)"
                class="rounded-lg px-2 py-1 text-xs font-bold mt-1"
              >
                {{ mrfStatusFormatter(mrf.status) }}
              </span> -->
            </td>
            <td class="px-2 py-2 border">
              <p>
                MRF Mnl: <span class="italic">{{ mrf.mrfManualNumber }}</span>
              </p>
              <p v-if="mrf.mrfType == 1" class="text-md text-teal-500 font-bold">
                <MRFItemSummary
                  :mrf_text="`${mrf.mrfNumber} (REQ)`"
                  :key="mrf.id"
                  :mrf_id="mrf.id"
                />
              </p>
              <p v-if="mrf.mrfType == 2" class="text-md text-blue-500 font-bold">
                <MRFItemSummary
                  :mrf_text="`${mrf.mrfNumber} (TRANS)`"
                  :key="mrf.id"
                  :mrf_id="mrf.id"
                />
              </p>
              <p class="text-md font-bold">Created: {{ mrf.dateOfmrf ?? "-" }}</p>
            </td>
            <!-- <td class="px-2 py-2 border"></td> -->
            <!-- <td class="px-2 py-2 border">
              <div class="flex justify-center">
                <MRFProofViewer
                  :key="mrf.id"
                  :mrf_id="mrf.id"
                  :thumbnail="mrf.thumbNail"
                  :isBase64="true"
                />
              </div>
            </td> -->
            <!-- <td class="px-2 py-2 border">
             <div class="text-base font-semibold text-gray-800">
                  {{ mrf.userName }}
             </div>
              <span
                v-if="mrf.forStocking"
                  class="inline-flex items-center gap-1 bg-blue-800 text-white text-xs font-medium px-2.5 py-0.5 
                  rounded-full shadow-sm hover:bg-blue-700 transition-all duration-200"
                >
                  <span class="text-sm">For PR</span>
              </span>
            </td> -->
              <td class="px-2 py-2 border">
              <div class="flex flex-col items-center space-y-2 text-center">
                <div class="text-base font-semibold text">
                  {{mrf.userName }}
                </div>
                <span
                  v-if="mrf.forStocking"
                  class="inline-flex items-center gap-1 bg-blue-800 text-white text-sm font-medium px-2.5 py-0.5 
                  rounded-full shadow-sm hover:bg-blue-700 transition-all duration-200"
                >
                  <span class="text-sm">For PR</span>
                </span>
              </div>
            </td>
            <td class="px-2 py-2 border text-wrap">{{ mrf.remarks }}</td>
            <td class="px-2 py-2 border text-wrap">{{ mrf.items}}</td>
            <td class="px-2 py-3 border">
              <div class="flex justify-center">
                <Items
                  v-if="hasPermission('MRF_Slip_View_Button')"
                  :data="mrf"
                  :key="mrf.id"
                  :warehouse_id="props.warehouse_id"
                  @transaction_id="handleTransaction()"
                />
                <!-- <Return v-if="hasPermission('MRF_Slip_Return_Item_Button')" :data="mrf" :warehouse_id="props.warehouse_id" @transaction_id="handleTransaction()"/> -->
                <ApproveMRFSlip
                  v-if="hasPermission('MRF_Slip_Approve_Form')"
                  :data="mrf"
                  :key="mrf.id"
                  :warehouse_id="props.warehouse_id"
                  @transaction_id="handleTransaction()"
                />
                <EditMRF
                  v-if="hasPermission('MRF_Slip_Edit_Button')"
                  :data="mrf"
                  :key="mrf.id"
                  :mrf_id="mrf.id"
                  :warehouse_id="props.warehouse_id"
                  @transaction_id="handleTransaction()"
                />
                <MRFSlip
                  v-if="hasPermission('MRF_Slip_Print_Button')"
                  :key="mrf.id"
                  :data="mrf"
                  :is_pending="true"
                  :warehouse_id="props.warehouse_id"
                  @transaction_id="handleTransaction()"
                />
                <ViewMRFJO
                  v-if="hasPermission('MRF_Slip_View_JO_Button')"
                  :key="mrf.id"
                  :mrf_id="mrf.id"
                  @transaction_id="handleTransaction()"
                />
                <Reject
                  v-if="hasPermission('MRF_Slip_Reject_Button')"
                  :mrf_id="mrf.id"
                  @transaction_id="handleTransaction()"
                />
              </div>
            </td>
          </tr>
          <tr v-if="loading == true">
            <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="8">
              <Loader />
            </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="8">
              ***No MRF Items found***
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex w-full overflow-auto">
      <Paginator
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
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import ImageViewer from "@/views/Component/ImageViewer.vue";
import { VUE_APP_API_URL, DATE_NOW, COMPANIES, DEFAULT_BG } from "@/views/Utility/Global";
import { hasPermission } from "@/views/Utility/Permissions";
import Loader from "@/views/Component/Loader.vue"
import SearchDropdown from "@/views/Component/SearchDropdown.vue";;
import {
  FormDx,
  BearToken,
  Alert,
  mrfStatusFormatter,
  mrfStatusClassFormatter,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";

import Transfer from "./Actions/Transfer.vue";
import ApproveMRFSlip from "./Actions/ApproveMRFSlip.vue";
import EditMRF from "./Actions/EditMRF.vue";
import Request from "./Actions/Request.vue";
import Reject from "./Actions/Reject.vue";
import Items from "./Actions/Items.vue";
import Return from "./Actions/Return.vue";
import ViewMRFJO from "./Actions/ViewMRFJO.vue";
import MRFProofViewer from "./Actions/MRFProofViewer.vue";
import MRFSlip from "@/views/Pages/Transactions/Tabs/MRF/MRFSlipForReleasing/Actions/MRFSlip.vue";
import MRFItemSummary from "@/views/Pages/Transactions/Tabs/MRF/MRFSlipForReleasing/Actions/MRFItemSummary.vue";

const token = localStorage.getItem("token");
const props = defineProps({
  warehouse_id: Number,
});
const data = ref({});
const loading = ref(false);

const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

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
  await listMRFs();
  handlePagination(1);
}, 500);

const listMRFs = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/list-for-approval`,
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
  search.value.page_num = page_num ?? 1;
  listMRFs();
};

const handleTransaction = (transaction_id) => {
  listMRFs();
};

const handleDateChange = () => {
  search.value.page_num = 1;
  listMRFs();
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
  listMRFs();
};

const fillUserForm = (data) => {
  search.value.user_id = data.id;
  listMRFs();
};

onMounted(() => {
  listMRFs();
});
</script>
