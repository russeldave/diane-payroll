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
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class=" text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid">
              <th
                scope="col"

                class="px-2 py-3 border text-center text-xs md:text-sm font-medium  uppercase tracking-wider"
              >
                <i class="fa fa-xl fa-check-square text-green-500"></i>
              </th>
              <th
                scope="col"

              class="px-2 py-3 border text-center text-xs md:text-sm font-medium  uppercase tracking-wider"
              >
                Item
              </th>
              <th
                scope="col"

              class="px-2 py-3 border text-center text-xs md:text-sm font-medium  uppercase tracking-wider"
              >
                PR No.
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-center text-xs md:text-sm font-medium  uppercase tracking-wider"
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
                MRF'ed By
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Created By
              </th>
              <th
                scope="col"
                class="px-2 py-3 border text-center text-xs md:text-sm font-medium  uppercase tracking-wider"
              >
                Remarks
              </th>
              <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium  uppercase tracking-wider"
            >
              Actions
            </th>
            </tr>
          </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm md:text-md">
          <!-- Loop through products and display them -->
          <tr
            v-if="data.prItems?.length > 0 && loading == false"
            v-for="(pr,index) in data.prItems"
            :key="pr.id"
            :title="'Created By: '+pr.requestedByUserName"
             class="text-nowrap hover:bg-gray-200"
          >
            <td class="px-2 py-3 border">
              <div class="text-center">
                <input type="checkbox" class="h-5 w-5 text-slate-600" v-model="pr.selected" @change.prevent="selectedItemID(pr,pr.selected)">
              </div>
            </td>          
            <td class="px-2 py-3 border hover:bg-green-200 text-wrap">
              <ItemTitle :item_id="pr.itemId" :item_name="pr.itemName" />
            </td>
            <td class="px-2 py-3 border">
              <p class="font-medium">{{ pr.prNumber }}</p>
              <small title="Date of PR: ">{{ pr.dateOfPr }}</small>
            </td>
            <td class="px-2 py-3 border text-right bg-red-500 font-bold text-white">
              <p>{{ Number(pr.quantity ?? 0 ).toLocaleString() }} {{  pr.unitAbbre }}</p>
            </td>
            <td class="px-2 py-3 border text-right bg-green-500 font-bold text-white"><p>{{ Number(pr.quantity ?? 0 ).toLocaleString() }} {{  pr.unitAbbre }}</p></td>
            <td class="px-2 py-3 border text-right bg-blue-500 font-bold text-white"><p>{{ pr.receivedQuantity ?? 0 }} {{  pr.unitAbbre }}</p></td>
            <td class="px-2 py-3 border">{{ pr.mrfByEmployeeName ?? '-' }}</td>
            <td class="px-2 py-3 border">{{ pr.requestedByUserName ?? '-' }}</td>
            <td class="px-2 py-3 border">{{ pr.prRemarks === 'null' ? '-' : pr.prRemarks }}</td>
            <!-- <td class="px-2 py-3 border">{{ mrfStatusFormatter(mrf.status) }}</td> -->
            <td class="px-2 py-3 border">
              <div class="flex justify-center">
                <!-- <Edit  v-if="hasPermission('PR_Slip_Edit_Button')" :data="pr" @transaction_id="handleTransaction()"/> -->
                <!-- <Cancelled
                  v-if="hasPermission('PR_Slip_Cancelled_Button')"
                  :data="pr"
                  @transaction_id="handleTransaction()"
                /> -->
              </div>
            </td>
          </tr>
          <tr v-if="loading == true">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="10">
              <Loader />
             </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="10">
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
import { VUE_APP_API_URL,DATE_NOW,DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  mrfStatusFormatter,
  useDebounce,
  handleApiError
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import Loader from "@/views/Component/Loader.vue";

// import Cancelled from "@/views/Pages/Transactions/PR/PRSlipForPurchase/Actions/DeletePRItem.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";

const token = localStorage.getItem("token");
const data = ref({});
const loading = ref(false);
const pr_data = ref([]);

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
      `${VUE_APP_API_URL}prs/list-pr-items-rejects`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
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
}

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
    data.value.prItems.forEach(cp => {
        cp.selected = pr_data.value.some(pr => pr.pr_id === cp.id);
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
            item_name: data.itemName,
            sub_quantity: data.subQuantity,
            requested_sub_quantity: data.subQuantity,
            sub_unit_abbre: data.subUnitAbbre,
            quantity_per_unit: data.quantityPerUnit,
            sub_unit_id: data.subUnitId,
            quantity: data.quantity,
            requested_quantity: data.quantity,
            unit_abbre: data.unitAbbre,
            unit_id: data.unitId,
            price: 0,
            brand_id: 0,
            brand_name: '',
            brand_abbre: data.brandAbbre,
            sub_price: 0,
            discount: 0,
            total_price: 0,
            remarks: '',
            total_quantity: 0,
        });
    } else {
        // If selected is false, remove the item from pr_data.value
        // Find the index of the item to remove based on mrf_item_id
        const indexToRemove = pr_data.value.findIndex(item => item.pr_item_id === data.id);
        if (indexToRemove !== -1) {
            pr_data.value.splice(indexToRemove, 1); // Remove item from pr_data.value array
        }
    }
};

onMounted(() => {
  listPRs();
});
</script>
