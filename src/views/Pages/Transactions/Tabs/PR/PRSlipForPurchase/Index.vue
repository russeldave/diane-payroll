<template>
  <div
    class="p-4 min-h-screen rounded-lg dark:border-gray-700"
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
      <div>     
      </div>
      </div>
      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class=" text-white shadow" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500 text-nowrap">
              <th
                scope="col"
                class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
              >
                Date Requested
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
              >
                PR No.
              </th>
              <!-- <th
                scope="col"
                class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
              >
                PR Manual No.
              </th> -->
              <!-- <th
                scope="col"
                width="15%"
                class="px-2 py-3 border text-left text-sm font-medium uppercase tracking-wider"
              >
                MRF'ed By
              </th> -->
              <th
                scope="col"
                width="15%"
                class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
              >
                Created By
              </th>
              <th
                scope="col"
                width="15%"
                class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
              >
                Remarks
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                To Purchaser
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                Items
              </th>
              <!-- <th
                scope="col"
                class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
                >
                PR Status
              </th> -->
              <th
                scope="col"
                class="px-2 py-3 border text-center text-sm font-medium uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-sm">
          <!-- Loop through products and display them -->
          <tr
            v-for="pr in data.prs"
            v-if="data.prs?.length > 0 && loading == false"
            :key="pr.id"
            :title="'Created By: ' + pr.requestedByUserName"
             class="text-nowrap hover:bg-gray-200"
          >
            <td class="px-2 py-2 border text-center">
              <p class="text-md font-bold">{{ pr.dateOfPr }}</p>
                  <!-- <span
               :class="mrfStatusFormatter(pr.status)"
              class="inline-flex items-center  gap-1 bg-blue-400 text-gray-200 rounded-lg px-3 py-1 text-xs font-bold mt-1
              shadow-sm hover:bg-blue-600 transition-colors duration-200"
              >
                {{ mrfStatusFormatter(pr.status) }}
              </span> -->
            </td>
            <td class="px-2 py-2 border">
              <p>
                PR Mnl: <span>{{ pr.prManualNumber }}</span>
              </p>
              <p>
                <span>{{ pr.prNumber }}</span>
              </p>
            </td>
            <!-- <td class="px-2 py-2 border">{{ pr.mrfByEmployeeName ?? '-' }}</td> -->
            <td class="px-2 py-2 text-center border">{{ pr.requestedByUserName ?? '-' }}</td>
            <td class="px-2 py-2 text-center border w-[200px]">{{ pr.remarks }}</td>
            <td class="px-2 py-2 text-center border w-[200px] font-bold italic">
              <div class=" bg-blue-200 p-2 rounded-lg">
                {{ pr.purchasers.length == 0 ? 'N/a': pr.purchasers}}
              </div>
            </td>
            <td class="px-2 py-2 border">
            <div class="w-[400px] whitespace-normal break-words text-left">{{ pr.items }}</div>
            </td>
            
            <!-- <td class="px-2 py-2 border">
              <div 
                v-if="pr.isApproved == 1"
                class="flex justify-center rounded-lg bg-green-700 font-bold text-white text-lg px-4 py-2"
                >
                Approved
              </div>
              <div 
                v-else
                class="flex justify-center rounded-lg bg-green-300 text-sm text-white px-2 py-1"
                >
                Pending...
              </div>
            </td> -->
            <td class="px-2 py-2 border">
              <div class="flex justify-center">
                <!-- <View v-if="hasPermission('PR_Slip_View_Button')" :data="pr" @transaction_id="handleTransaction()" /> -->
                <EditPR v-if="hasPermission('PR_Slip_Edit_PR_Button')" :data="pr" @transaction_id="handleTransaction()"/>
           <!-- <UploadPO :data="pr" @transaction_id="handleTransaction()" /> -->
              <!-- <UploadPR
                :data="pr"
                @transaction_id="handleTransaction"
                @uploaded_files="(files) => handleUploadedFiles(pr.id, files)"
              /> -->
              <DeletePr
              :data="pr" 
              @transaction_id="handleTransaction"
              />
                <ImageButton
                :data="pr"
                :uploadedFiles="uploadedFiles[pr.id] || []"
                @transaction_id="handleTransaction"
              />
                <PRSlip v-if="hasPermission('PR_Slip_Print_Button')" :key="pr.id" :data="pr" :warehouse_id="defaultWarehouse" @transaction_id="handleTransaction()" />
              </div>
            </td>
          </tr>
          <tr v-if="loading == true">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="8">
              <Loader />
             </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="8">
             ***No PR found***
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
import { VUE_APP_API_URL, DATE_NOW, COMPANIES, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  mrfStatusFormatter,
  useDebounce,
  handleApiError
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Loader from "@/views/Component/Loader.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

import EditPR from "./Actions/EditPR.vue";
import Add from "./Actions/Add.vue";
import View from "./Actions/View.vue";
import UploadPO from "./Actions/UploadPO.vue";
import ImageButton from "./Actions/ImageButton.vue";
import UploadPR from "./Actions/UploadPR.vue";
import PRSlip from "./Actions/PRSlip.vue";
import DeletePr from "./Actions/DeletePr.vue";

const token = localStorage.getItem("token");
const defaultWarehouse = JSON.parse(localStorage.getItem("defaultWarehouse")) || 0;
const loading = ref(false);
const data = ref({});

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

const uploadedFiles = ref({}); // store uploaded files by PR ID
const handleUploadedFiles = (prId, files) => {
  uploadedFiles.value[prId] = files;
  console.log("Uploaded files for PR:", prId, files);
};

const searchInput =  useDebounce(async () => {
    search.value.page_num = 1;
    await listPRs();
    handlePagination(1);
},500);

const listPRs = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/list`,
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
  listPRs();
};

const handleTransaction = (transaction_id) => {
  console.log(transaction_id);
  listPRs();
};


const handleDateChange = () => {
  search.value.page_num = 1;
  listPRs();
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
  listPRs();
};

const fillUserForm = (data) => {
  search.value.user_id = data.id;
  listPRs();
};

onMounted(() => {
  listPRs();
});
</script>
