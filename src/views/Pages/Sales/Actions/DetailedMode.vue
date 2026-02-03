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
          <option value="0">--All Dates--</option>
          <!-- <option value="1">Hourly</option> -->
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
          <span>&nbsp;Download sales</span>
        </a>

        <a
          target="_blank"
          v-if="hasPermission('Sales_Report_Button')"
          :href="`${VUE_APP_API_URL}ingredient-reports-download-excel/menus/${search.type}/${search.date}/${search.user_id}`"
          @click="
            console.log(
              `${VUE_APP_API_URL}ingredient-reports-download-excel/menus/${search.type}/${search.date}/${search.user_id}`
            )
          "
          class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 items-center flex w-full justify-center font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap"
        >
          <i class="fa fa-file-excel"></i>
          <span>&nbsp;Download menus</span>
        </a>
      </div>
      <!-- Total Sales Summary -->
      <div class="flex justify-end mb-2 md:mb-0 order-1 md:order-2">
        <div
          class="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-lg p-4 min-w-[200px]"
        >
          <div title="Total Sales" class="flex justify-between text-white text-end">
            <i class="fa fa-coins"></i>
            <p class="text-2xl font-bold">
              {{ moneyFormatter(data.totalGrandTotal ?? 0) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Split View -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Left Side - Sales List (1/4) -->
      <div
        class="w-full lg:w-1/4 bg-white rounded-lg shadow-lg p-4 overflow-y-auto max-h-full"
      >
        <div v-if="loading" class="flex justify-center items-center h-64">
          <Loader />
        </div>
        <div v-else-if="!data.salesTransactions?.length" class="text-center py-8">
          <p class="text-gray-500">No transactions found.</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="(group, date) in groupedSales" :key="date" class="border-b pb-2">
            <h3 class="font-bold text-lg text-gray-800">{{ formatDate(date) }}</h3>
            <div class="space-y-1 mt-2">
              <div
                v-for="sale in group"
                :key="sale.id"
                @click="selectSale(sale)"
                class="p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                :class="{
                  'bg-emerald-50 border-l-4 border-emerald-500':
                    selectedSale?.id === sale.id,
                }"
              >
                <div class="flex justify-between items-center">
                  <div class="flex flex-col">
                    <span class="text-base font-medium">#{{ sale.salesNumber }}</span>
                    <span class="text-sm text-gray-500 uppercase">{{
                      sale.customerName || "Walk-in"
                    }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-bold text-green-600">{{
                      moneyFormatter(sale.grandTotal)
                    }}</span>
                    <!-- <div class="text-sm text-gray-500 uppercase">
                      {{ sale.paymentMethodName ?? "None" }}
                    </div> -->

                    <td class="p-2 text-center">
                      <div class="flex justify-center">
                        <VoidTransaction :key="sale.id" :data="sale" />
                      </div>
                    </td>
                  </div>
                </div>
                <div
                  class="flex justify-between uppercase items-bottom border-t-2 border-dashed mt-1 pt-1"
                >
                  <span class="text-sm text-gray-500">
                    {{ sale.cpNumber ?? "-" }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ sale.siNumber ?? "-" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <div class="flex w-full overflow-auto mt-4">
          <Paginator
            v-if="data.totalrows"
            :page_number="search.page_num"
            :total_rows="data.totalrows"
            :itemsperpage="search.itemsperpage"
            paginationOnly="true"
            @page_num="handlePagination"
          />
        </div>
      </div>

      <!-- Right Side - Invoice Details (3/4) -->
      <div class="w-full lg:w-3/4 bg-white rounded-lg shadow-lg p-4">
        <InvoiceSheet v-if="selectedSale" :key="selectedSale?.id" :data="selectedSale" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Paginator from "@/views/Component/Pagination.vue";
import Loader from "@/views/Component/Loader.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, useDebounce, moneyFormatter } from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import InvoiceSheet from "./InvoiceSheet.vue";
import VoidTransaction from "./VoidTransaction.vue";

const token = localStorage.getItem("token");
const menus = ref([]);
const users = ref([]);
const data = ref({});
const loading = ref(false);
const selectedSale = ref(null);

// Local search state
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0,
  date: new Date().toISOString().split("T")[0],
  menu_category_id: 0,
  user_id: 0,
  sort_by: "dateOfSales",
  sort_type: "DESC",
});

// Group sales by date
const groupedSales = computed(() => {
  if (!data.value.salesTransactions) return {};

  // Sort the sales by date in descending order first
  const sortedSales = [...data.value.salesTransactions].sort((a, b) => {
    return b.DateOnly.localeCompare(a.DateOnly);
  });

  // Group by DateOnly
  return sortedSales.reduce((groups, sale) => {
    const date = sale.DateOnly;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(sale);
    return groups;
  }, {});
});

// Format date for display
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Select a sale to view details
const selectSale = (sale) => {
  selectedSale.value = sale;
};

// Fetch data function
const fetchTransactionData = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/transactions-list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;

    selectSale(data.value.salesTransactions[0]); // Reset selected sale when new data is fetched
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

// Handlers
const handleSearch = useDebounce(() => {
  search.value.page_num = 1;
  fetchTransactionData();
}, 500);

const handleDateChange = () => {
  search.value.page_num = 1;
  fetchTransactionData();
};

const handleTypeChange = () => {
  if (search.value.type === "2") {
    search.value.date = new Date().toISOString().split("T")[0];
  } else {
    search.value.date = new Date().toISOString().slice(0, 7);
  }
  search.value.page_num = 1;
  fetchTransactionData();
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num;
  fetchTransactionData();
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
  fetchTransactionData();
});
</script>

<style scoped>
.max-h-\[calc\(100vh-250px\)\] {
  max-height: calc(100vh - 250px);
}

/* Add smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
}
</style>
