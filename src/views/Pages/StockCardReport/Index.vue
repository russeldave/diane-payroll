<template>
  <div v-if="hasPermission('Navigation_Production_Report')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700">
      <!-- <BreadCrumbs :page="'Production Report'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1">Production Report</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 mb-4 gap-4">
        <div>
          <label for="" class="text-gray-500 text-md">Search</label>
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Transaction..."
            class="shadow shadow-gray-700 flex w-full focus-visible:bg-yellow-100 font-bold text-nowrap flex py-2 px-4 rounded-lg mb-4 float-end"
          />
        </div>
        <div>
          <label for="" class="text-gray-500 text-md">From Date</label>
          <DatePicker @dateSelected="(date) => handleFromDateSelected(date)" />
        </div>
        <div>
          <label for="" class="text-gray-500 text-md">To Date</label>
          <DatePicker @dateSelected="(date) => handleToDateSelected(date)" />
        </div>
      </div>
      <div class="p-4 overflow-x-auto">
        <div class="flex w-full overflow-auto text-nowrap">
          <table class="min-w-full divide-y divide-gray-200">
            <thead :class="DEFAULT_BG" class="text-white">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Category
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Beginning Stocks
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Prepare Stocks
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Deducted Stocks
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Current
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Cost Price
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Prepare Price Stocks
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Total Price
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
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 uppercase"
                >
                  {{ order.paymentMethodName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 uppercase"
                >
                  {{ order.cashierUserName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 text-right uppercase"
                >
                  {{ order.amount ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 uppercase"
                >
                  {{ order.paymentMethodName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 uppercase"
                >
                  {{ order.cashierUserName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 text-right uppercase"
                >
                  {{ order.amount ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 uppercase"
                >
                  {{ order.paymentMethodName ?? "-" }}
                </td>
              </tr>
              <tr v-if="data.collections?.length == 0 && !loading" class="text-center">
                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="9">
                  No production report found.
                </td>
              </tr>
              <tr v-if="loading" class="text-center">
                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="9">
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

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  to_date: "",
  from_date: "",
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getProductionReport();
  handlePagination(1);
}, 500);

const handleFromDateSelected = (date) => {
  search.value.to_date = date;
  searchInput();
};
const handleToDateSelected = (date) => {
  search.value.from_date = date;
  searchInput();
};
const getProductionReport = async () => {
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
  getProductionReport();
};

// Call getProductionReport when component is mounted
onMounted(() => {
  getProductionReport();
});
</script>
