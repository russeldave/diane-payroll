<template>
  <div v-if="hasPermission('Navigation_Transactions')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Receiving'" /> -->
      <h1 class="text-lg md:text-2xl font-bold mb-4 mt-1">Receiving</h1>
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
          <a
            target="_blank"
            v-if="hasPermission('Receiving_Report_Button')"
            :href="`${VUE_APP_API_URL}ingredient-reports-download-excel/receiving/${search.type}/${search.date}/${search.user_id}`"
            @click="
              console.log(
                `${VUE_APP_API_URL}ingredient-reports-download-excel/receiving/${search.type}/${search.date}/${search.user_id}`
              )
            "
            class="hidden md:inline bg-green-500 text-white hover:opacity-70 focus:bg-green-300 items-center flex w-full justify-center font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
          >
            <i class="fa fa-file-excel"></i>
            <span>&nbsp;Generate as Excel</span>
          </a>
          <!-- <ReceivingReport
            v-if="hasPermission('Receiving_Report_Button')"
            @transaction_id="handleTransaction"
          /> -->
        </div>
        <div
          class="flex flex-nowrap md:flex-wrap md:overflow-visible overflow-auto space-x-2"
        >
          <AddIngredients
            v-if="hasPermission('Add_Ingredient_Button')"
            @transaction_id="handleTransaction"
          />
          <ReceiveIngredients
            v-if="hasPermission('Receive_Ingredients_Button')"
            @transaction_id="handleTransaction"
          />
          <a
            target="_blank"
            v-if="hasPermission('Receiving_Report_Button')"
            :href="`${VUE_APP_API_URL}ingredient-reports-download-excel/receiving/${search.type}/${search.date}/${search.user_id}`"
            @click="
              console.log(
                `${VUE_APP_API_URL}ingredient-reports-download-excel/receiving/${search.type}/${search.date}/${search.user_id}`
              )
            "
            class="inline md:hidden bg-green-500 text-white hover:opacity-70 focus:bg-green-300 items-center flex w-full justify-center font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
          >
            <i class="fa fa-file-excel"></i>
            <span>&nbsp;Generate as Excel</span>
          </a>
        </div>
      </div>

      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                width="10%"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('date')"
              >
                Received Date
                <i :class="getSortIcon('date')" class="ml-1"></i>
              </th>
              <th
                scope="col"
                width="20%"
                class="px-6 py-3 text-left text-wrap text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('name')"
              >
                Name
                <i :class="getSortIcon('name')" class="ml-1"></i>
              </th>
              <th
                scope="col"
                width="10%"
                class="px-6 py-3 text-wrap text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Received Quantity
              </th>
              <th
                scope="col"
                width="20%"
                class="px-6 py-3 text-wrap text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('actualPrice')"
              >
                Actual Price Per Item
                <i :class="getSortIcon('actualPrice')" class="ml-1"></i>
              </th>
              <th
                scope="col"
                width="20%"
                class="px-6 py-3 text-wrap text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Receiving Price
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-nowrap text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Reference No.
              </th>
              <th
                scope="col"
                width="20%"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Remarks
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Received By
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
            <!-- Loop through products and display them -->
            <tr
              v-for="ing in data.ingredients"
              :title="`Received by:${ing.userName}`"
              class="hover:bg-gray-200"
              v-if="data.ingredients?.length > 0 && loading == false"
              :key="ing.id"
            >
              <td class="px-6 py-3 border">{{ ing.dateOfReceived }}</td>
              <td class="px-6 py-3 border">
                <ViewDetails
                  :id="ing.ingredientId"
                  :key="ing.id"
                  :title="ing.ingredientName"
                  :type="ing.ingredientTypeAbbre"
                />
              </td>
              <td class="px-6 py-3 border text-center">
                {{ formatNumberWithCommas(ing.quantity ?? 0) }}
                <sub>{{ ing.unitAbbre ?? "-" }}</sub>
              </td>
              <td class="px-6 py-3 border text-center">
                {{ moneyFormatter(ing.costPrice ?? 0) }}
              </td>
              <td class="px-6 py-3 border text-center">
                {{ moneyFormatter(ing.receivingPrice ?? 0) }}
              </td>
              <td class="px-6 py-3 border text-left">{{ ing.invoiceNumber ?? "-" }}</td>
              <td class="px-6 py-3 border text-wrap">{{ ing.remarks ?? "-" }}</td>
              <td class="px-6 py-3 border text-left capitalize">
                {{ ing.userName ?? "-" }}
              </td>
              <td class="px-6 py-3 border text-right">
                <div class="flex items-center justify-center">
                  <ReceiveImage
                    v-if="hasPermission('View_Receive_Image_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                  <Edit
                    v-if="hasPermission('Edit_Receiving_Button')"
                    :key="ing.id"
                    @transaction_id="handleTransaction()"
                    :data="ing"
                  />
                  <Delete
                    v-if="hasPermission('Delete_Receiving_Button')"
                    :key="ing.id"
                    @transaction_id="handleTransaction()"
                    :data="ing"
                  />
                </div>
              </td>
            </tr>
            <tr v-if="loading == true">
              <td class="px-6 py-3 border text-center text-red-500 font-bold" colspan="9">
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td
                class="px-6 py-3 border text-center text-red-500 font-bold"
                colspan="9  "
              >
                ***No Receiving Ingredients found***
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

import ReceiveIngredients from "./Actions/ReceiveIngredients.vue";
import ReceivingReport from "./Actions/ReceivingReport.vue";
import Delete from "./Actions/Delete.vue";
import Edit from "./Actions/Edit.vue";
import AddIngredients from "@/views/Pages/Ingredients/Actions/Add.vue";
import ReceiveImage from "./Actions/ReceiveImage.vue";
import ViewDetails from "../Ingredients/Actions/ViewDetails.vue";

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
  await listSuppliers();
  handlePagination(1);
}, 500);
const listSuppliers = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredient-receiving/list`,
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
    console.error("Error fetching data:", error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listSuppliers();
};
const handleTransaction = (transaction_id) => {
  listSuppliers();
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
  listSuppliers();
};

const handleDateChange = () => {
  search.value.page_num = 1;
  listSuppliers();
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
  listSuppliers();
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
    const response = await axios.get(
      `${VUE_APP_API_URL}users/get-dropdown`,
      BearToken(token)
    );
    users.value = response.data.users ?? [];
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
};
// Call listSuppliers when component is mounted
onMounted(() => {
  categoryDropdown();
  usersDropdown();
  listSuppliers();
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
