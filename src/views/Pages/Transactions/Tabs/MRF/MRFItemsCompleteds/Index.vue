<template>
  <div class="p-4 min-h-screen rounded-lg dark:border-gray-700">
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
           
          <!-- :href="`${ING_DOWNLOAD_LINK}/${search.category_id}/${search.sort_by}/${search.sort_type}`" -->
          <DownloadExcel 
          :data = 'search'
          :key="downloadKey"
          />
          

        </div>
      <div class="flex justify-end">
        <!-- <ReturnItem
          v-if="hasPermission('MRF_Slip_Return_Item_Button')"
          :data="mrf_data"
          :item_array="item_array"
          :mrf_item_array="mrf_item_array"
          :warehouse_id="props.warehouse_id"
          @transaction_id="handleTransaction()"
        /> -->
      </div>
    </div>
    <div class="flex w-full overflow-auto">
      <!-- Table to display products -->
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table headers -->
        <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
          <tr class="border-b-2 border-solid">
            <!-- <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              <i class="fa fa-xl fa-check-square text-green-500"></i>
            </th> -->
            <th
              scope="col"
              width="20%"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Item
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Item Image
            </th>
            <th
              scope="col"
               width="10%"
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
            <th
              scope="col"
              title="Quantity per Unit"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              MRF'ed By
            </th>
            <th
              scope="col"
              title="Quantity per Unit"
              width="5%"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Location
            </th>
            <th
              scope="col"
              title="Requested Quantity"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Requested
            </th>
            <th
              scope="col"
               v-if="hasPermission('MRF_Available_Column')"
              title="Remaining Quantity"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Available
            </th>
            <th
              scope="col"
              title="Released Quantity"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Released
            </th>
            <th
              scope="col"
               v-if="hasPermission('MRF_PR_Column')"
              title="Remaining Quantity"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium tracking-wider"
            >
              PR'ed
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
             Proof of Released
            </th>
            <!-- <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Status
            </th> -->

            <th
              scope="col"
              class="px-2 py-3 text-center text-xs md:text-sm border font-medium uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
          <!-- Loop through products and display them -->
          <tr
            v-for="(mrf, index) in data.mrfItems"
            v-if="data.mrfItems?.length > 0 && loading == false"
            :key="mrf.id"
            :title="'Requested By:' + mrf.userName"
            class="text-nowrap hover:bg-gray-200"
          >
            <!-- <td class="px-2 py-3 border">
              <div class="text-center hover:bg-green-200">
                <input
                  type="checkbox"
                  class="h-5 w-5 text-slate-600"
                  v-model="mrf.selected"
                  @change.prevent="selectedItemID(mrf, mrf.selected)"
                />
              </div>
            </td> -->
            <td class="px-2 py-3 border hover:bg-green-200 text-wrap">
              <ItemTitle :item_id="mrf.itemId" :item_name="mrf.itemName" :is_fixed="mrf.isFixed" />
            </td>
            <td class="px-2 py-3 border hover:bg-green-200 text-wrap">
              <ItemImageViewer v-if="mrf.itemId" :item_id="mrf.itemId" :thumbnail="mrf.thumbNail" :canDeleteImage="false"/>
            </td>
            <!-- <td class="px-2 py-3 border hover:bg-green-200 text-wrap">
              {{ typeFormatter(mrf.isFixed) }}
            </td> -->
            <!-- <td class="px-2 py-3 border hover:bg-green-200 text-nowrap">
              <p v-if="mrf.mrfType == 1" class="text-md text-teal-500 font-bold">
                {{ mrf.mrfNumber }}(REQ)
              </p>
              <p v-if="mrf.mrfType == 2" class="text-md text-blue-500 font-bold">
                {{ mrf.mrfNumber }}(TRANS)
              </p>
              <p class="text-md font-bold">Created: {{ mrf.dateOfmrf ?? '-' }}</p>
              <p class="text-md font-bold">Released: {{ mrf.dateOfReleased ?? '-' }}</p>
            </td>
            <td class="px-2 py-3 border hover:bg-green-200">
              {{ mrf.mrfManualNumber }}
            </td> -->
            <td class="px-2 py-3 border hover:bg-green-200 text-nowrap">
               <p>
                MRF Mnl: <span class="italic">{{ mrf.mrfManualNumber }}</span>
              </p>
              <p v-if="mrf.mrfType == 1" class="text-md text-teal-500 font-bold">
                {{ mrf.mrfNumber }}(REQ)
              </p>
              <p v-if="mrf.mrfType == 2" class="text-md text-blue-500 font-bold">
                {{ mrf.mrfNumber }}(TRANS)
              </p>
              <p class="text-md font-bold">Created: {{ mrf.dateOfmrf ?? "-" }}</p>
            </td>
            <td class="px-2 py-3 border text-left hover:bg-green-200">
              {{ mrf.userName }}
            </td>
            <td class="px-2 py-3 border text-left hover:bg-green-200">
              {{ mrf.locationName }}
            </td>
            <td
              class="px-2 py-3 border text-right hover:bg-green-200 bg-red-500 font-bold text-white"
            >
              <p class="text-md md:text-lg">{{ Number(mrf.quantity).toLocaleString() }} {{ mrf.unitAbbre }}</p>
            </td>
            <td
             v-if="hasPermission('MRF_Available_Column')"
              class="px-2 py-3 border text-right hover:bg-green-200 font-bold text-white bg-green-500"
            >
              <p>{{ Number(mrf.allStocks).toLocaleString() }} {{ mrf.unitAbbre }}</p>
            </td>
            <td
              class="px-2 py-3 border text-right hover:bg-blue-200 border-white font-bold text-white bg-blue-500"
            >
              <p>{{ Number(mrf.releasedQuantity).toLocaleString() }} {{ mrf.unitAbbre }}</p>
              <span class="underline">{{ mrf.dateOfReleased }}</span>
            </td>
            <td
           v-if="hasPermission('MRF_PR_Column')"
              class="px-2 py-3 border text-right hover:bg-orange-200 border-white font-bold text-white bg-orange-500"
            >
              <p>{{ Number(mrf.prQuantity).toLocaleString() }} {{ mrf.unitAbbre }}</p>
              <span class="underline">{{ mrf.dateOfmrf }}</span>
              
            </td>
            <td class="px-2 py-3 border text-center">
              <div class="flex justify-center">
                <CompletedProofViewer
                  v-if="mrf.id"
                  :mrf_id="mrf.id"
                  :thumbnail="mrf.proofThumbNail ?? false"
                  :canDeleteImage="false"
                />
              </div>
            </td>
            <!-- <td class="px-2 py-2 border text-center">
              <span
                :class="mrfStatusClassFormatter(mrf.status)"
                class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
              >
                {{ mrfStatusFormatter(mrf.status) }}
              </span>
            </td> -->
            <!-- <td class="px-2 py-2 border">{{ mrfStatusFormatter(mrf.status) }}</td> -->
            <td class="px-2 py-3 border">
              <div class="flex">
                <ViewMRF
                  v-if="hasPermission('MRF_Slip_Item_View_Button')"
                  :data="mrf"
                  @transaction_id="handleTransaction()"
                />
                <ReturnItem v-if="hasPermission('MRF_Slip_Item_Return_Button')" :data="mrf" :key="props.warehouse_id" :hasMRFID="true" :warehouse_id="props.warehouse_id" @transaction_id="handleTransaction" />
                <!-- <ReturnMRF
                  v-if="hasPermission('MRF_Slip_Item_Return_Button')"
                  :key="mrf.id"
                  :data="mrf"
                  @transaction_id="handleTransaction()"
                /> -->
              </div>
            </td>
          </tr>
          <tr v-if="loading == true">
            <td
              class="px-2 py-2 border text-center text-red-500 font-bold"
              colspan="16"
            >
              <Loader />
            </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td
              class="px-2 py-2 border text-center text-red-500 font-bold"
              colspan="16"
            >
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
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import DownloadExcel from "./Actions/DownloadExcel.vue";
import {
  VUE_APP_API_URL,
  DATE_NOW,
  MRF_DOWNLOAD_LINK,
  COMPANIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  mrfStatusFormatter,
  mrfStatusClassFormatter,
  useDebounce,
  typeFormatter,
  handleApiError,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Loader from "@/views/Component/Loader.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

import CompletedProofViewer from "@/views/Pages/Items/Actions/CompletedProofViewer.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import ViewMRF from "./Actions/ViewMRF.vue";
import ReturnItem from "@/views/Pages/Transactions/Tabs/Return/ToReturnItem/Actions/ReturnItem.vue";
import ReturnMRF from "./Actions/ReturnMRF.vue";
import ItemImageViewer from "@/views/Pages/Items/Actions/ItemImageViewer.vue";

const token = localStorage.getItem("token");
const props = defineProps({
  warehouse_id: Number,
});
const data = ref({});
const loading = ref(false);
const mrf_data = ref([]);
const item_array = ref([]);
const mrf_item_array = ref([]);
const downloadKey = ref(0);



const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  warehouse_id: props.warehouse_id, // Initialize with default_warehouse value
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
      `${VUE_APP_API_URL}mrfs/list-mrf-items-completeds`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
    // checkSelected();
  } catch (error) {
    handleApiError(error);
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listMRFs();
};
watch(
  () => [...Object.values(search.value)], 
  () => {
    downloadKey.value++;
  },
  { deep: true }
);
const handleTransaction = (transaction_id) => {
  mrf_data.value = [];
  listMRFs();
};

const handleDateChange = () => {
  search.value.page_num = 1;
  listMRFs();
};
const downloadExcel = async () => {
  if (isProcessing.value) return; // avoid double clicks
  isProcessing.value = true;

  const url = `${VUE_APP_API_URL}ingredient-reports-download-excel/expences/${search.value.type}/${search.value.date}`;

  try {
    const response = await axios.get(url, {
      ...BearToken(token),
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "expences.xlsx";
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Download error:", err);
    Swal.fire("Download Failed", "There was a problem downloading the report.", "error");
  } finally {
    isProcessing.value = false;
  }
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
const checkSelected = () => {
  data.value.mrfItems.forEach((cp) => {
    cp.selected = mrf_data.value.some((mrf) => mrf.mrf_item_id === cp.id);
  });
};

const selectedItemID = (data, selected) => {
  if (!mrf_data.value) {
    mrf_data.value = []; // Initialize mrf_data.value as an array if it's not already defined
  }

  if (selected) {
    // If selected is true, push the item to mrf_data.value
    mrf_data.value.push({
      mrf_item_id: data.id,
      item_id: data.itemId,
      item_name: data.itemName,
      quantity_per_unit: data.quantityPerUnit,
      received_quantity: data.releasedQuantity - data.receivedQuantity,
      released_quantity: data.releasedQuantity,
      requested_quantity: data.quantity,
      brand_id: data.brandId,
      brand_name: data.brandName ?? "No Brand",
      brand_abbre: data.brandAbbre,
      requested_quantity: data.quantity,
      unit_abbre: data.unitAbbre,
      unit_id: data.unitId,
      price: 0,
      remarks: data.remarks,
      total_quantity: 0,
    });

    // Add itemId to item_array.value if not already present
    if (!item_array.value.includes(data.itemId)) {
      item_array.value.push(data.itemId);
    }
    if (!mrf_item_array.value.includes(data.id)) {
      mrf_item_array.value.push(data.id);
    }
  } else {
    // If selected is false, remove the item from mrf_data.value
    // Find the index of the item to remove based on mrf_item_id
    const indexToRemove = mrf_data.value.findIndex(
      (item) => item.mrf_item_id === data.id
    );
    if (indexToRemove !== -1) {
      mrf_data.value.splice(indexToRemove, 1); // Remove item from mrf_data.value array
    }

    // Remove itemId from item_array.value if present
    const itemIndexToRemove = item_array.value.indexOf(data.itemId);
    if (itemIndexToRemove !== -1) {
      item_array.value.splice(itemIndexToRemove, 1); // Remove itemId from item_array.value array
    }
    const mrfItemIndexToRemove = mrf_item_array.value.indexOf(data.id);
    if (mrfItemIndexToRemove !== -1) {
      mrf_item_array.value.splice(mrfItemIndexToRemove, 1); // Remove itemId from item_array.value array
    }
  }
};

onMounted(() => {
  listMRFs();
});
</script>
