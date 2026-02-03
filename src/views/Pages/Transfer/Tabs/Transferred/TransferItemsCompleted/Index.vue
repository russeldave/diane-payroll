<template>
  <div v-if="hasPermission('Navigation_Transfer')">
    <div class="p-4 min-h-screen rounded-lg dark:border-gray-700">
      <div class="flex flex-col md:flex-row md:justify-between mb-4">
        <div class="block md:flex items-center gap-2">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Receiving..."
            class="shadow shadow-gray-700 flex w-full font-bold focus-visible:bg-yellow-200 text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
          />

          <select
            v-model="search.type"
            class="shadow shadow-gray-700 flex w-full text-sm md:text-md py-2 px-4 rounded mb-4"
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
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '2'"
            type="date"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '3'"
            type="week"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '4'"
            type="month"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4"
            @change="handleDateChange"
          />
          <select
            v-model="search.user_id"
            @change.prevent="searchInput()"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full flex w-full"
          >
            <option value="0">All User</option>
            <option v-for="user in users" :key="user.value" :value="user.value">
              {{ user.label }}
            </option>
          </select>
        </div>
        <div
          class="flex flex-nowrap md:flex-wrap md:overflow-visible overflow-auto space-x-2"
        ></div>
      </div>

      <div class="flex w-full overflow-auto">
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
                width="20%"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Item
              </th>
              <!-- <th
              scope="col"
              class="px-2 py-3 border text-left  text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Type
            </th> -->
              <th
                scope="col"
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
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
                class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Requestor Details
              </th>
              <!-- <th
              scope="col"
              title="Quantity per Unit"
              class="px-2 py-3 border text-right  text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Units
            </th> -->
              <th
                scope="col"
                title="Requested Quantity"
                class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Requested
              </th>
              <th
                scope="col"
                title="Released Quantity"
                class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Transferred
              </th>
              <!-- <th
                scope="col"
                title="Remaining Quantity"
                class="px-2 py-3 border text-right uppercase text-xs md:text-sm font-medium tracking-wider"
              >
                Received
              </th> -->
              <th
                scope="col"
                title="Remaining Quantity"
                class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Available
              </th>
              <th
                scope="col"
                width="15%"
                class="px-2 py-3 text-center border text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                Proof
              </th>
              <!-- <th
              scope="col"
              class="px-2 py-3 text-center  text-xs md:text-sm font-medium uppercase tracking-wider"
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
          <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm text-nowrap">
            <!-- Loop through products and display them -->
            <tr
              v-for="(mrf, index) in data.mrfItems"
              v-if="data.mrfItems?.length > 0 && loading == false"
              :key="mrf.id"
              :title="
                'Source Location:' +
                mrf.fromWarehouseName +
                ', Requested By:' +
                mrf.userName
              "
              class="text-nowrap hover:bg-gray-200"
            >
              <td class="px-2 py-2 border">
                <div class="text-center">
                  <input
                    type="checkbox"
                    class="h-5 w-5 text-slate-600"
                    v-model="mrf.selected"
                    @change.prevent="selectedItemID(mrf, mrf.selected)"
                  />
                </div>
              </td>
              <td class="px-2 py-2 border hover:bg-green-200 text-wrap">
                 <ViewDetails
                  :id="mrf.ingredientIdNumber"
                  :title="`${mrf.ingredientIdNumber} - ${mrf.itemName} (${mrf.unitAbbre}) - [${mrf.ingredientCategoryName}]`"
                />
              </td>
              <!-- <td class="px-2 py-2 border hover:bg-green-200 text-nowrap">
              {{ typeFormatter(mrf.isFixed) }}
              </td> -->
              <td class="px-2 py-2 border hover:bg-green-200">
                <p v-if="mrf.mrfType == 1" class="text-md text-teal-500 font-bold">
                  {{ mrf.mrfNumber }}(REQ)
                </p>
                <p v-if="mrf.mrfType == 2" class="text-md text-blue-500 font-bold">
                  {{ mrf.mrfNumber }}(TRANS)
                </p>
                <p class="text-md font-bold">{{ mrf.dateOfmrf ?? "-" }}</p>
              </td>
              <!-- <td class="px-2 py-2 border hover:bg-green-200">
                {{ mrf.mrfManualNumber }}
              </td> -->
              <td class="px-2 py-2 border hover:bg-green-200">
                <p>
                  Warehouse: <b class="uppercase">{{ mrf.requestorWarehouse ?? "-" }}</b>
                </p>
                <p>
                  Stocks: <b class="uppercase">{{ mrf.requestorStocks ?? 0 }}</b>
                </p>
                <p>
                  Requested By:
                  <b class="uppercase">{{ mrf.requestorEmployeeName ?? "None" }}</b>
                </p>
                <p>
                  Inputted By: <b class="uppercase">{{ mrf.userName ?? "None" }}</b>
                </p>
              </td>
              <!-- <td class="px-2 py-2 border text-right hover:bg-green-200">
              {{ mrf.quantityPerUnit ?? 0 }} / {{ mrf.unitAbbre }}
            </td> -->
              <td
                class="px-2 py-3 border text-right hover:bg-green-200 bg-red-500 font-bold text-white"
              >
                <p>{{ mrf.quantity ?? 0 }} {{ mrf.unitAbbre }}</p>
              </td>
              <td
                class="px-2 py-3 border text-right hover:bg-green-200 border-white text-white bg-lime-500"
              >
                <u class="text-md md:text-lg">
                  {{ mrf.releasedQuantity ?? 0 }} {{ mrf.unitAbbre }}
                </u>
                <p>{{ mrf.releaseFromWarehouseName }}</p>
              </td>
              <!-- <td
                class="px-2 py-3 border text-right hover:bg-green-200 border-white text-white bg-green-500"
              >
                <p>{{ mrf.receivedQuantity ?? 0 }} {{ mrf.unitAbbre }}</p>
              </td> -->
              <td
                class="px-2 py-3 border text-right hover:bg-green-200 text-white bg-blue-500"
              >
                <p>{{ mrf.allStocks }} {{ mrf.unitAbbre }}</p>
              </td>
              <td class="px-2 py-3 border text-center">
                <div class="flex justify-center"></div>
              </td>
              <!-- <td class="px-2 py-3 border text-center">
              <span
                :class="mrfStatusClassFormatter(mrf.status)"
                class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
              >
                {{ mrfStatusFormatter(mrf.status) }}
              </span>
            </td> -->
              <!-- <td class="px-2 py-2 border">{{ mrfStatusFormatter(mrf.status) }}</td> -->
              <td class="px-2 py-3 border">
                <div class="flex justify-center"></div>
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
  useDebounce,
  formatNumberWithCommas,
  moneyFormatter,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

import ViewDetails from "@/views/Pages/Ingredients/Actions/ViewDetails.vue";
const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const categories = ref([]);
const users = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
  sort_by: "date",
  sort_type: "ASC",
  user_id: 0,
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listTransferItemCompleted();
  handlePagination(1);
}, 500);
const listTransferItemCompleted = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/list-mrf-items-completeds-transfer`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
    // setTimeout(async () => {
    //   //gidelay ni nako para masure nga naload tanan na data ok
    //   await generateBarcodesForSuppliers(response.data.suppliers);
    // }, 500);
  } catch (error) {
    loading.value = false;
    console.error("Error fetching data:", error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listTransferItemCompleted();
};
const handleTransaction = (transaction_id) => {
  listTransferItemCompleted();
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
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
  listTransferItemCompleted();
};

const handleDateChange = () => {
  search.value.page_num = 1;
  listTransferItemCompleted();
};

// Add these new functions for sorting
const handleSort = (column) => {
  if (search.value.sort_by === column) {
    // Toggle sort direction if clicking the same column
    search.value.sort_type = search.value.sort_type === "ASC" ? "DESC" : "ASC";
  } else {
    // Set new column and default to ascending
    search.value.sort_by = column;
    search.value.sort_type = "ASC";
  }
  listTransferItemCompleted();
};

const getSortIcon = (column) => {
  if (search.value.sort_by !== column) {
    return "fas fa-arrows-up-down text-white";
  }
  return search.value.sort_type === "ASC"
    ? "fas fa-arrow-up text-white"
    : "fas fa-arrow-down text-white";
};

const usersDropdown = async () => {
  try {
    const response = await axios.post(
      `${VUE_APP_API_URL}users/dropdown`,
      { id: 0 },
      BearToken(token)
    );
    users.value = response.data.users ?? [];
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
};
// Call listTransferItemCompleted when component is mounted
onMounted(() => {
  categoryDropdown();
  usersDropdown();
  listTransferItemCompleted();
});
</script>

<style scoped>
/* Add these styles to make the month input look consistent across browsers */
input[type="month"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: white;
}

/* Ensure consistent styling for both date inputs */
input[type="date"],
input[type="month"] {
  min-width: 150px;
}
</style>
