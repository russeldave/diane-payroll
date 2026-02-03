<template>
  <div class="px-4">
    <!-- Filters -->
    <div class="flex flex-col md:flex-row md:justify-between mb-4">
      <div class="block md:flex items-center gap-2 order-2 md:order-1">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="handleSearch"
          placeholder="Search Sales..."
          class="shadow shadow-gray-700 flex w-full font-bold focus-visible:bg-yellow-200 text-sm md:text-md py-2 px-4 rounded mb-4"
        />

        <select
          v-model="search.type"
          class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
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
          v-model="search.menu_category_id"
          @change.prevent="handleSearch"
          class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
        >
          <option value="0">All Menu Categories</option>
          <option v-for="menu in menus" :key="menu.id" :value="menu.id">
            {{ menu.name }}
          </option>
        </select>

        <select
          v-model="search.user_id"
          @change.prevent="handleSearch"
          class="shadow shadow-gray-700 text-sm md:text-md py-2 px-4 rounded mb-4 flex w-full"
        >
          <option value="0">All User</option>
          <option v-for="user in users" :key="user.value" :value="user.value">
            {{ user.label }}
          </option>
        </select>

        <a
          target="_blank"
          v-if="hasPermission('Sales_Report_Button')"
          :href="`${VUE_APP_API_URL}ingredient-reports-download-excel/sales/${search.type}/${search.date}/${search.user_id}`"
          @click="
            console.log(
              `${VUE_APP_API_URL}ingredient-reports-download-excel/sales/${search.type}/${search.date}/${search.user_id}`
            )
          "
          class="bg-green-500 text-white hover:opacity-70 focus:bg-green-300 items-center flex w-full justify-center font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
        >
          <i class="fa fa-file-excel"></i>
          <span>&nbsp;Generate as Excel</span>
        </a>
      </div>
      <!-- Total Sales Summary -->
      <div class="flex justify-end mb-2 md:mb-0 order-1 md:order-2">
        <div
          class="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-lg p-4 min-w-[200px]"
        >
          <div title="Total Sales" class="flex justify-between text-white text-end">
            <i class="fa fa-coins"></i>
            <p class="text-2xl font-bold">{{ moneyFormatter(data.totalSales ?? 0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="flex w-full overflow-auto text-nowrap">
      <table class="min-w-full divide-y divide-gray-200">
        <thead :class="DEFAULT_BG" class="text-white">
          <tr>
            <th
              width="10%"
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              @click="handleSort('dateOfSales')"
            >
              Date of Sales
              <i :class="getSortIcon('dateOfSales')" class="ml-1"></i>
            </th>
            <th
              width="20%"
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              @click="handleSort('menuName')"
            >
              Menu Name
              <i :class="getSortIcon('menuName')" class="ml-1"></i>
            </th>
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Category
            </th>
            <!-- <th
              class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
              @click="handleSort('cost')"
            >
              Cost
              <i :class="getSortIcon('cost')" class="ml-1"></i>
            </th> -->
            <th
              class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
              @click="handleSort('retailPrice')"
            >
              Retail
              <i :class="getSortIcon('retailPrice')" class="ml-1"></i>
            </th>
            <th
              class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
              @click="handleSort('quantity')"
            >
              Qty
              <i :class="getSortIcon('quantity')" class="ml-1"></i>
            </th>
            <th
              class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
              @click="handleSort('less')"
            >
              Less
              <i :class="getSortIcon('less')" class="ml-1"></i>
            </th>
            <th
              class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
              @click="handleSort('total')"
            >
              Total
              <i :class="getSortIcon('total')" class="ml-1"></i>
            </th>
            <th
              title="Captain's Pad Number"
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              CP. No.
            </th>
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              SI. No.
            </th>
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              @click="handleSort('referenceNumber')"
            >
              Ref. No.
              <i :class="getSortIcon('referenceNumber')" class="ml-1"></i>
            </th>
            <th
              class="px-6 py-3 text-left text-wrap text-xs md:text-sm font-medium uppercase border tracking-wider"
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
              class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="order in data.menuSales"
            class="hover:bg-gray-200"
            v-if="data.menuSales?.length > 0 && !loading"
            :key="order.id"
          >
            <td class="px-6 py-3 border text-sm text-gray-900 text-wrap">
              {{ order.dateOfSales }}
            </td>
            <td
              width="15%"
              class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 first-letter:capitalize lowercase text-wrap"
            >
              {{ order.menuName ?? "-" }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 first-letter:capitalize lowercase"
            >
              {{ order.menuCategoryName ?? "-" }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
            >
              {{ order.retailPrice ?? parseFloat(0).toFixed(2) }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
            >
              {{ order.quantity ?? parseFloat(0).toFixed(2) }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
            >
              {{ order.less ?? parseFloat(0).toFixed(2) }}<br />
              <div
                v-if="order.discountId != 0"
                class="mt-1 bg-yellow-400 text-white text-xs rounded px-1 py-0 inline-flex items-center"
              >
                <span
                  >{{ order.salesItemDiscountAbbre }} Discount:
                  <i class="text-red-500">-{{ order.less.toFixed(2) }}</i></span
                >
              </div>
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-right text-sm text-gray-900 uppercase"
            >
              {{ order.total ?? parseFloat(0).toFixed(2) }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 uppercase"
            >
              {{ order.cpNumber ?? "-" }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 uppercase"
            >
              {{ order.siNumber ?? "-" }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 uppercase"
            >
              {{ order.referenceNumber ?? "-" }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 first-letter:capitalize lowercase"
            >
              {{ order.paymentMethodName ?? "-" }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 first-letter:capitalize lowercase"
            >
              {{ order.customerName ?? "-" }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 first-letter:capitalize lowercase"
            >
              {{ order.cashierUserName ?? "-" }}
            </td>
            <td
              class="px-6 py-3 border whitespace-nowrap text-sm text-gray-900 first-letter:capitalize lowercase"
            >
              <div class="flex justify-center items-center">
                <VoidOrderItem :key="order.id" :data="order" />
              </div>
            </td>
          </tr>
          <tr v-if="data.menuSales?.length == 0 && !loading" class="text-center">
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="15">
              No transactions found.
            </td>
          </tr>
          <tr v-if="loading" class="text-center">
            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="15">
              <Loader />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex w-full overflow-auto mt-4">
      <Paginator
        v-if="data.totalrows"
        :page_number="search.page_num"
        :total_rows="data.totalrows"
        :itemsperpage="search.itemsperpage"
        @page_num="handlePagination"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import Paginator from "@/views/Component/Pagination.vue";
import Loader from "@/views/Component/Loader.vue";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, useDebounce, moneyFormatter } from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";

import VoidOrderItem from "./VoidOrderItem.vue";

const token = localStorage.getItem("token");
const menus = ref([]);
const users = ref([]);
const data = ref([]);
const loading = ref(false);
// Local search state
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0,
  date: new Date().toISOString().split("T")[0],
  menu_category_id: 0,
  user_id: 0,
  sort_by: "menuName",
  sort_type: "ASC",
});

// Fetch data function
const fetchData = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/sales-list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

// Handlers
const handleSearch = useDebounce(() => {
  search.value.page_num = 1;
  fetchData();
}, 500);

const handleDateChange = () => {
  search.value.page_num = 1;
  fetchData();
};

const handleTypeChange = () => {
  if (search.value.type === "2") {
    search.value.date = new Date().toISOString().split("T")[0];
  } else {
    search.value.date = new Date().toISOString().slice(0, 7);
  }
  search.value.page_num = 1;
  fetchData();
};

const handleSort = (column) => {
  if (search.value.sort_by === column) {
    search.value.sort_type = search.value.sort_type === "ASC" ? "DESC" : "ASC";
  } else {
    search.value.sort_by = column;
    search.value.sort_type = "ASC";
  }
  fetchData();
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num;
  fetchData();
};

const getSortIcon = (column) => {
  if (search.value.sort_by !== column) {
    return "fas fa-arrows-up-down text-white";
  }
  return search.value.sort_type === "ASC"
    ? "fas fa-arrow-up text-white"
    : "fas fa-arrow-down text-white";
};

// Fetch dropdown data
const fetchDropdowns = async () => {
  try {
    // Fetch menu categories
    const menuResponse = await axios.get(
      `${VUE_APP_API_URL}menu-categories/list-cashier`,
      BearToken(token)
    );
    menus.value = menuResponse.data.menuCategories ?? [];

    // Fetch users
    const userResponse = await axios.get(
      `${VUE_APP_API_URL}users/get-dropdown`,
      BearToken(token)
    );
    users.value = userResponse.data.users ?? [];
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
  }
};

onMounted(() => {
  fetchDropdowns();
  fetchData();
});
</script>
