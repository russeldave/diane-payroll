<template>
  <div
    v-if="
      hasPermission('Navigation_Payments') && hasPermission('Navigation_Transactions')
    "
  >
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Payments'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1 px-2">Payments</h1>

      <div class="flex px-4 flex-col md:flex-row md:justify-between mb-4">
        <div class="block md:flex items-center gap-2">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Collection..."
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
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '2'"
            type="date"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '3'"
            type="week"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
            @change="handleDateChange"
          />

          <input
            v-if="search.type === '4'"
            type="month"
            v-model="search.date"
            class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
            @change="handleDateChange"
          />

          <select
            v-model="search.payment_method_id"
            @change.prevent="searchInput()"
            class="shadow shadow-gray-700 flex w-full text-sm md:text-md py-2 px-4 rounded mb-4"
          >
            <option value="0">Select Payment Method</option>
            <option v-for="(pm, pp) in payment_methods" :key="pm.value" :value="pm.value">
              {{ pm.label }}
            </option>
          </select>
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
          <CollectionReport
            v-if="hasPermission('Collection_Report_Button')"
            @transaction_id="handleTransaction"
          />
        </div>
      </div>
      <div class="px-2 overflow-x-auto">
        <div class="flex w-full overflow-auto text-nowrap">
          <table class="min-w-full divide-y divide-gray-200">
            <thead :class="DEFAULT_BG" class="text-white">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Collection Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Sales No.
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Payment Method
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Cashier
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Amount
                </th>
                <th
                  class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in data.collections"
                class="hover:bg-gray-200"
                v-if="data.collections?.length > 0 && !loading"
                :key="order.id"
              >
                <td class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900">
                  {{ order.collectionDate ?? "-" }}
                </td>
                <td class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900">
                  {{ order.salesNumber }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 capitalize"
                >
                  {{ order.paymentMethodName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 capitalize text-wrap"
                >
                  {{ order.cashierUserName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 text-right uppercase"
                >
                  {{ order.amount ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 text-center uppercase"
                >
                  <div class="flex justify-center items-center">
                    <OrderItems
                      v-if="hasPermission('Order_Items_Button')"
                      :data="order"
                      :key="order.id"
                    />
                  </div>
                </td>
              </tr>
              <tr v-if="data.collections?.length == 0 && !loading" class="text-center">
                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="6">
                  No collections found.
                </td>
              </tr>
              <tr v-if="loading" class="text-center">
                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="6">
                  <Loader />
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
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import DatePicker from "@/views/Component/DatePicker.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import { FormDx, BearToken, useDebounce } from "@/views/Utility/Helper";
import {
  orderStatusFormatter,
  orderStatusClassFormatter,
} from "@/views/Utility/Formatter";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

//modules
import CollectionReport from "./Actions/CollectionReport.vue";
import OrderItems from "./Actions/OrderItems.vue";

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const users = ref([]);
const payment_methods = ref([]); // Add a reference for menus
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
  payment_method_id: 0, // Default to all menus
  user_id: 0,
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listCollections();
  handlePagination(1);
}, 500);

const handleDateChange = () => {
  search.value.page_num = 1;
  listCollections();
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
  listCollections();
};

const listCollections = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/collections-list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listCollections();
};

const paymentMethodDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}payment-methods/dropdown`,
      BearToken(token)
    );
    payment_methods.value = response.data.paymentMethods ?? [];
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
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
// Call listCollections when component is mounted
onMounted(() => {
  paymentMethodDropdown();
  usersDropdown();
  listCollections();
});
</script>
