<template>
  <div class="p-4 min-h-screen rounded-lg dark:border-gray-700">
    <!-- Add Product Button -->
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

      <div class="flex justify-end">
        <PurchaseOrder
          v-if="hasPermission('Purchase_Order_Button')"
          :data="pr_data"
          :pr_item_array="pr_item_array"
          @transaction_id="handleTransaction()"
        />
      </div>
    </div>
    <div class="flex w-full overflow-auto">
      <!-- Table to display products -->
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table headers -->
        <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
          <tr class="border-b-2 border-solid">
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              <i class="fa fa-xl fa-check-square text-green-500"></i>
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Item
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              PR No.
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              MRF Quantity
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium tracking-wider"
            >
              PR'ed
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Received
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
             Created By
            </th>
            <!-- <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Status
            </th> -->
            <!-- <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              To Purchaser
            </th> -->
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Remarks
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm md:text-md">
          <!-- Loop through products and display them -->
          <tr
            v-if="data.prItems?.length > 0 && loading == false"
            v-for="(pr, index) in data.prItems"
            :key="pr.id"
            :title="'Created By: ' + pr.requestedByUserName"
            class="text-nowrap hover:bg-gray-200"
          >
            <td class="px-2 py-3 border">
              <div class="text-center">
                <input
                  type="checkbox"
                  class="h-5 w-5 text-slate-600"
                  v-model="pr.selected"
                  @change.prevent="selectedItemID(pr, pr.selected)"
                />
              </div>
            </td>
            <td class="px-2 py-3 border hover:bg-green-200 text-wrap">
              <span class="bg-blue-200 rounded-lg p-1 font-bold italic">
                To: {{ pr.toEmployeeName ?? '-' }}
              </span>
              <div class="flex flex-row flex-wrap">
                <span class="">
                  {{ pr.ingredientIdNumber}} - 
                </span>
                <ItemTitle   :item_id="pr.ingredientIdNumber" :item_name="pr.ingredientName" 
                />
                <span class="italic text-red-500">
                  [{{ pr.unitAbbre}}]
                </span>
              </div>
            </td>
            <td class="px-2 py-3 border">
              <p title="Date of PR: " class="text-md font-semibold">{{ pr.dateOfPr }}</p>
              <p class="text-xs">{{ pr.prNumber }}</p>
              <p class="font-lg italic font-bold">{{ pr.destinationWarehouseName }}</p>
              <!-- <p class="">Available:&nbsp;
                <span class="font-lg font-bold">{{ pr.floatStocks }}</span>
                <span class="text-red-500 italic">{{ pr.unitAbbre }}</span>
              </p> -->
            </td>
            <td class="px-2 py-3 border text-right bg-red-500 font-bold text-white">
             <p>{{ Number(pr.quantity ?? 0 ).toLocaleString() }} {{ pr.unitAbbre }}</p>
            </td>
            <td class="px-2 py-3 border text-right bg-green-500 font-bold text-white">
              <p>{{ Number(pr.quantity ?? 0 ).toLocaleString() }} {{ pr.unitAbbre }}</p>
            </td>
            <td class="px-2 py-3 border text-right bg-blue-500 font-bold text-white">
              <p>{{ Number(pr.receivedQuantity).toLocaleString() }} {{ pr.unitAbbre }}</p>
            </td>
            <td class="px-2 py-3 border text-right">
              <span class="w-[100px] text-left border rounded-md px-2 py-1 bg-gray-200 font-bold">₱{{ pr.price }}/{{ pr.unitAbbre }}</span>
              <!-- <input 
                class=" w-[100px] text-left border rounded-md px-2 py-1 bg-gray-200"
                v-model.number="pr.price"
                type="number"
                min="0"
                step="0.01"
                disabled
                placeholder="Enter price"
              > -->
            </td>
            <td class="px-2 py-3 border">
             <p><strong>Inputed By: </strong> {{ pr.requestedByUserName ?? '-' }}</p>
             <p><strong>Mrf'ed By: </strong> {{ pr.mrfByEmployeeName ?? '-' }}</p>
            </td>
           <!-- <td class="px-3 py-3 border bg-white/60 backdrop-blur-sm">
              <div class="flex flex-col items-center space-y-2 text-center"> -->
                <!-- <div class="text-base font-semibold text-gray-800">
                  {{ pr.requestedByUserName ?? '-' }}
                </div> -->
                <!-- <span
                  v-if="pr.forStocking"
                  class="inline-flex items-center gap-1 bg-blue-800 text-white text-sm font-medium px-2.5 py-0.5 
                  rounded-full shadow-sm hover:bg-blue-700 transition-all duration-200"
                >
                  <span class="text-sm">For PR</span>
                </span> -->
                <!-- <div 
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
                </div> -->
              <!-- </div>
            </td> -->
             <!-- <td class="px-2 py-3 border">
              <p><strong>to: </strong> {{ pr.toEmployeeName ?? '-' }}</p>
            </td> -->
            <td class="px-2 py-3 border">
              <textarea
                class="w-[150px] text-left border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                v-model="pr.prRemarks"
                placeholder="Enter remarks"
              ></textarea>
            </td>
            <!-- <td class="px-2 py-3 border">{{ mrfStatusFormatter(mrf.status) }}</td> -->
            <td class="px-2 py-3 border">
              <div class="flex justify-center">
                <!-- <EditPR  v-if="hasPermission('PR_Slip_Edit_Button')" :data="pr" @transaction_id="handleTransaction()"/> -->
                <!-- <Cancelled
                  v-if="hasPermission('PR_Slip_Cancelled_Button')"
                  :data="pr"
                  @transaction_id="handleTransaction()"
                /> -->
                <!-- <EditPRItem
                  v-if="hasPermission('Edit_Pr_Item_Price_Button')"
                  :data="pr"
                  @transaction_id="handleTransaction()"
                /> -->
                <ReceiveItem
                  v-if="hasPermission('PR_Slip_Receive_Button')"
                  :data="pr"
                  @transaction_id="handleTransaction()"
                />
                <!-- <RejectPRItem
                  v-if="hasPermission('PR_Slip_Item_Delete_Button')"
                  :data="pr"
                  @transaction_id="handleTransaction()"
                /> -->
                <PRISlip v-if="hasPermission('PR_Slip_Print_Button')" 
                :key="pr.id" 
                :data="pr" 
                :warehouse_id="defaultWarehouse" 
                @transaction_id="handleTransaction()" />
              </div>
            </td>
          </tr>
          <tr v-if="loading == true">
            <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="17">
              <Loader />
            </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="17">
              ***No PR Items found***
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
  handleApiError,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import Loader from "@/views/Component/Loader.vue";
import PRISlip from "./Actions/PRISlip.vue";
//actions
import PurchaseOrder from "./Actions/PurchaseOrder.vue";
import Cancelled from "../PRSlipForPurchase/Actions/DeletePRItem.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import EditPR from "../PRSlipForPurchase/Actions/EditPR.vue";
import ReceiveItem from "./Actions/ReceiveItem.vue";
import RejectPRItem from "../PRSlipForPurchase/Actions/RejectPRItem.vue";
import EditPRItem from "../PRSlipForPurchase/Actions/EditPRItem.vue";
import { computed } from "vue"
const token = localStorage.getItem("token");
const data = ref({});
const loading = ref(false);
const pr_data = ref([]);
const pr_item_array = ref([]);
const props = defineProps({
  item_id: {
    type: Number,
    required: true
  },
  item_name: {
    type: String,
    default: "-" 
  
  },
  is_fixed: {
    type: Number,
    default: 0
  },
  is_repaired: {
    type: Number,
    default: 0
  }
})
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
  await listPRs();
  handlePagination(1);
}, 500);

const listPRs = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/list-pr-items`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    if (data.value.prItems && Array.isArray(data.value.prItems)) {
      data.value.prItems.forEach(prItem => {
        prItem.pr_item_id = prItem.id;
      });
    }
    loading.value = false;
    checkSelected();
  } catch (error) {
    handleApiError(error);
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listPRs();
};

const handleTransaction = (transaction_id) => {
  pr_data.value = [];
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

const checkSelected = () => {
  data.value.prItems.forEach((cp) => {
    cp.selected = pr_data.value.some((pr) => pr.pr_id === cp.id);
  });
};

const selectedItemID = (data, selected) => {
  if (!pr_data.value) {
    pr_data.value = []; // Initialize pr_data.value as an array if it's not already defined
  }
  if (selected) {
    // If selected is true, push the item to pr_data.value
    pr_data.value.push({
      pr_item_id: data.id,
      item_id: data.itemId,
      item_name: data.name,
      item_name: data.itemName,
      quantity_per_unit: data.quantityPerUnit,
      quantity: data.quantity,
      requested_quantity: data.quantity,
      unit_abbre: data.unitAbbre,
      unit_id: data.unitId,
      price: 0,
      brand_id: 0,
      brand_name: data.brandName ?? "none",
      brand_abbre: data.brandAbbre,
      requested_brand_id: 0,
      requested_brand_name: data.brandName ?? "none",
      requested_brand_abbre: data.brandAbbre,
      sub_price: 0,
      chart_of_account_name: data.chartOfAccountName ?? "",
      chart_of_account_id: data.chartOfAccountId ?? 0,
      sku_name: data.itemSku ?? 0,
      discount_amount: 0,
      vat: 0,
      tax_type_id: 0,
      tax_percentage: data.taxPercentage ?? 0,
      total_price: 0,
      remarks: "",
      tax_code_id: 0,
      total_quantity: 0,
    });

    if (!pr_item_array.value.includes(data.id)) {
      pr_item_array.value.push(data.id);
    }
  } else {
    // If selected is false, remove the item from pr_data.value
    // Find the index of the item to remove based on mrf_item_id
    const indexToRemove = pr_data.value.findIndex((item) => item.pr_item_id === data.id);
    if (indexToRemove !== -1) {
      pr_data.value.splice(indexToRemove, 1); // Remove item from pr_data.value array
    }
    const prItemIndexToRemove = pr_item_array.value.indexOf(data.id);
    if (prItemIndexToRemove !== -1) {
      pr_item_array.value.splice(prItemIndexToRemove, 1); // Remove itemId from item_array.value array
    }
  }
};

onMounted(() => {
  listPRs();
});
</script>
