<template>
  <button
    @click="showOrderData()"
    :class="[
      'bg-blue-500 text-white hover:opacity-70 rounded focus:bg-blue-300 font-bold text-xs md:text-sm py-2 px-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fa fa-receipt"></i>&nbsp;All Orders
  </button>
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'fullscreen'"
    title="All Orders"
    @close="isViewModalOpen = false"
  >
    <div v-if="loading" class="p-4">
      <Loader />
    </div>
    <div class="py-4 overflow-x-auto" v-else>
      <!-- <div class="mb-4">
            <input
                type="search"
                v-model="search.search"
                @input="searchInput"
                placeholder="Search orders..."
                class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div> -->
      <!-- <div class="flex w-full overflow-auto py-4">
        <div class="flex w-full justify-between">
          <h1 class="text-lg font-bold text-gray-700">Orders</h1>
        </div>
      </div> -->

      <!-- Order Details Summary -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex items-center">
              <span class="text-gray-600 font-medium w-32">Sales Number:</span>
              <span class="text-gray-900 font-semibold">{{
                props.data.salesNumber
              }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 font-medium w-32">Amount:</span>
              <span class="text-gray-900 font-semibold"
                >₱{{ parseFloat(props.data.amount).toFixed(2) }}</span
              >
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 font-medium w-32">Payment Method:</span>
              <span class="text-gray-900 font-semibold">{{
                props.data.paymentMethodName
              }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center">
              <span class="text-gray-600 font-medium w-32">Date:</span>
              <span class="text-gray-900 font-semibold">{{ props.data.DateOnly }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 font-medium w-32">Cashier:</span>
              <span class="text-gray-900 font-semibold">{{
                props.data.cashierUserName
              }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 font-medium w-32">Collection Date:</span>
              <span class="text-gray-900 font-semibold">{{
                props.data.collectionDate
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex w-full overflow-auto px-4 mb-2">
        <div class="flex w-full justify-between">
          <h1 class="text-lg font-bold text-gray-700">Orders</h1>
        </div>
      </div>
      <div class="px-4 overflow-x-auto">
        <div class="flex w-full overflow-auto text-nowrap">
          <table class="min-w-full divide-y divide-gray-200">
            <thead :class="DEFAULT_BG" class="text-white">
              <tr>
                <th
                  width="10%"
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Date of Sales
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                  @click="handleSort('menuName')"
                >
                  Menu
                  <i :class="getSortIcon('menuName')" class="ml-1"></i>
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Category
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Cost Price
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Retail Price
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Qty
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Less
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Total
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                  @click="handleSort('referenceNumber')"
                >
                  Ref. No.
                  <i :class="getSortIcon('referenceNumber')" class="ml-1"></i>
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Payment Method
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Customer
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Cashier
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Status
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
                v-for="order in data.items"
                class="hover:bg-gray-200"
                v-if="data.items?.length > 0 && !loading"
                :key="order.id"
              >
                <td class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900">
                  {{ order.dateOfSales }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 first-letter:capitalize lowercase"
                >
                  {{ order.menuName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 first-letter:capitalize lowercase text-nowrap text-wrap"
                >
                  {{ order.menuCategoryName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
                >
                  {{ parseFloat(order.costPrice ?? 0).toFixed(2) }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
                >
                  {{ parseFloat(order.retailPrice ?? 0).toFixed(2) }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
                >
                  {{ parseFloat(order.quantity ?? 0).toFixed(2) }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
                >
                  {{ parseFloat(order.less ?? 0).toFixed(2) }}<br />
                  <div
                    v-if="order.discountId != 0"
                    class="mt-1 bg-yellow-400 text-white text-xs rounded px-1 py-0 inline-flex items-center"
                  >
                    <span
                      >{{ order.salesItemDiscountAbbre }} Discount:
                      <i class="text-red-500"
                        >-{{ parseFloat(order.less ?? 0).toFixed(2) }}</i
                      ></span
                    >
                  </div>
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
                >
                  {{ parseFloat(order.total ?? 0).toFixed(2) }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 capitalize"
                >
                  {{ order.referenceNumber ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 capitalize"
                >
                  {{ order.paymentMethodName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 capitalize"
                >
                  {{ order.customerName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 capitalize"
                >
                  {{ order.cashierUserName ?? "-" }}
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-center text-gray-900"
                >
                  <span :class="orderStatusClassFormatter(order.status)">
                    {{ order.statusName?.toUpperCase() }}
                  </span>
                </td>
                <td
                  class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 uppercase"
                >
                  <div class="flex justify-center items-center">
                    <Refund
                      v-if="hasPermission('Refund_Collection_Button')"
                      :key="order.id"
                      :data="order"
                    />
                    <Void
                      v-if="hasPermission('Void_Collection_Button')"
                      :key="order.id"
                      :data="order"
                    />
                  </div>
                </td>
              </tr>
              <tr v-if="data.items?.length == 0 && !loading" class="text-center">
                <td
                  class="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                  colspan="14"
                >
                  No transactions found.
                </td>
              </tr>
              <tr v-if="loading" class="text-center">
                <td
                  class="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                  colspan="14"
                >
                  <Loader />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
  </Modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import {
  moneyFormatter,
  BearToken,
  FormDx,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper.js";
import {
  orderStatusFormatter,
  orderStatusClassFormatter,
} from "@/views/Utility/Formatter";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";

import Void from "./Void.vue";
import Refund from "./Refund.vue";
import { hasPermission } from "@/views/Utility/Permissions";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const token = localStorage.getItem("token");
const isViewModalOpen = ref(false);
const data = ref([]);
const loading = ref(false);

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  pay_id: 0,
  sort_by: "menuName",
  sort_type: "ASC",
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getCustomerOrders();
  handlePagination(1);
}, 500);

const getCustomerOrders = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/items-per-pay`,
      formData,
      BearToken(token)
    );
    if (response.data) {
      data.value = response.data;
    } else {
      isViewModalOpen.value = false;
      emits("transaction_id", Math.random());
    }

    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = false;
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  getCustomerOrders();
};

const handleTransaction = (transaction_id) => {
  getCustomerOrders();
  emits("transaction_id", Math.random() + "transactions-done");
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
  getCustomerOrders();
};

const getSortIcon = (column) => {
  if (search.value.sort_by !== column) {
    return "fas fa-arrows-up-down text-white";
  }
  return search.value.sort_type === "ASC"
    ? "fas fa-arrow-up text-white"
    : "fas fa-arrow-down text-white";
};

const showOrderData = async () => {
  const data = props.data;

  search.value.pay_id = data.id;
  await getCustomerOrders();
  isViewModalOpen.value = true;
};
</script>
