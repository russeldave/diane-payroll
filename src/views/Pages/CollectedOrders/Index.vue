<template>
  <div
    v-if="
      hasPermission('Navigation_Collected_Orders') &&
      hasPermission('Navigation_Transactions')
    "
  >
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Collected Orders'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1 px-2">Collected Orders</h1>

      <div class="flex flex-col lg:flex-row lg:justify-between mb-2 px-2">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="searchInput()"
          placeholder="Search Sales..."
          class="shadow shadow-gray-700 flex w-full lg:w-1/4 focus-visible:bg-yellow-100 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
        />

        <select
          v-model="search.status"
          @change.prevent="searchInput()"
          class="shadow shadow-gray-700 flex w-full lg:w-32 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
        >
          <option value="0">All</option>
          <option value="1">Pending</option>
          <option value="2">Completed</option>
          <option value="7">Cancelled</option>
        </select>
      </div>
      <div class="px-2 overflow-x-auto">
        <div class="flex w-full overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 text-nowrap">
            <thead :class="DEFAULT_BG" class="text-white">
              <tr>
                <th
                  width="10%"
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Sales ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Sales Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Customer
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Grand Total
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Inputted By
                </th>
                <th
                  class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in data.sales"
                class="hover:bg-gray-200"
                v-if="data.sales?.length > 0 && !loading"
                :key="order.id"
              >
                <td class="px-6 py-4 border whitespace-nowrap text-sm text-gray-900">
                  {{ order.salesNumber }}
                </td>
                <td class="px-6 py-4 border whitespace-nowrap text-sm text-gray-900">
                  {{ order.dateOfSales }}
                </td>
                <td
                  class="px-6 py-4 border whitespace-nowrap text-sm text-gray-900 capitalize"
                >
                  {{ order.customerName }}
                </td>
                <td
                  class="px-6 py-4 border whitespace-nowrap text-sm text-gray-900 uppercase text-right"
                >
                  {{ order.grandTotal ?? 0 }}
                </td>
                <td
                  class="px-6 py-4 border whitespace-nowrap text-sm text-gray-900 capitalize"
                >
                  {{ order.userName == null ? "-" : order.name }}
                </td>
                <td
                  class="px-6 py-4 border whitespace-nowrap text-sm text-center text-gray-900"
                >
                  <span :class="orderStatusClassFormatter(order.status)">
                    {{ orderStatusFormatter(order.status) }}
                  </span>
                </td>
              </tr>
              <tr v-if="data.sales?.length == 0 && !loading" class="text-center">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="6">
                  No orders found.
                </td>
              </tr>
              <tr v-if="loading" class="text-center">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="6">
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
import { FormDx, BearToken, useDebounce } from "@/views/Utility/Helper";
import {
  orderStatusFormatter,
  orderStatusClassFormatter,
} from "@/views/Utility/Formatter";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";

//actions
import Loader from "@/views/Component/Loader.vue";

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const categories = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  status: 0,
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listOrderLogs();
  handlePagination(1);
}, 500);
const listOrderLogs = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/list-all-sales`,
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
  listOrderLogs();
};
const handleTransaction = (transaction_id) => {
  listOrderLogs();
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
};
// Call listOrderLogs when component is mounted
onMounted(() => {
  categoryDropdown();
  listOrderLogs();
});
</script>
