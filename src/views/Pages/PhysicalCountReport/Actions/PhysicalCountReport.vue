<template>
  <button
    @click.prevent="reportBehavior()"
    type="button"
    :class="[
      'bg-purple-500 text-white hover:opacity-70 focus:bg-blue-300 w-full font-bold text-sm md:text-md py-2 rounded px-4 mb-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-file-invoice"></i>
    Physical Count Report
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isReportModalOpen"
    :maxWidth="'lg'"
    title="Generate Physical Count Report"
    @close="isReportModalOpen = false"
  >
    <div class="p-4 overflow-x-auto">
      <div class="grid grid-cols-1 gap-1 md:gap-4">
        <!-- <div>
            <label for="" class="text-gray-500 text-md mb-1">Search</label>
            <input type="search" 
              v-model="search.search"
              @input.prevent="searchInput()"
              placeholder="Search Transaction..." 
              class="shadow shadow-gray-700 flex w-full focus-visible:bg-yellow-100 font-bold text-nowrap flex py-2 px-4 rounded-lg mb-4 float-end">
        </div> -->
        <div>
          <label for="" class="text-gray-500 text-md mb-1">From Date</label>
          <DatePicker
            v-if="search.from_date"
            :defaultTime="search.from_date"
            :key="updateKey"
            :use24Hours="true"
            @dateSelected="(date) => handleFromDateSelected(date)"
          />
        </div>
        <div>
          <label for="" class="text-gray-500 text-md mb-1">To Date</label>
          <DatePicker
            v-if="search.to_date"
            :defaultTime="search.to_date"
            :key="updateKey"
            :use24Hours="true"
            @dateSelected="(date) => handleToDateSelected(date)"
          />
        </div>
        <div>
          <div class="flex justify-end gap-2">
            <a
              target="_blank"
              v-if="search.from_date && search.to_date"
              :href="`${VUE_APP_API_URL}ingredient-reports-download-excel/physical-count/${search.from_date}/${search.to_date}`"
              class="bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200"
            >
              <i class="fa fa-file-excel"></i>
              <span>Generate as Excel</span>
            </a>
          </div>
        </div>
      </div>
      <!-- <div class="overflow-x-auto">
        <div class="flex w-full overflow-auto text-nowrap">
          <table class="min-w-full divide-y divide-gray-200">
            <thead :class="DEFAULT_BG" class="text-white">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Date Received
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Quantity Received
                </th>
                <th
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Reference No.
                </th>
                <th
                  class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Remarks
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
              </tr>
              <tr v-if="data.collections?.length == 0 && !loading" class="text-center">
                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="5">
                  No receiving report found.
                </td>
              </tr>
              <tr v-if="loading" class="text-center">
                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500" colspan="5">
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
      </div> -->
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import DatePicker from "@/views/Component/DatePicker.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { VUE_APP_API_URL, UNITS, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
  useDebounce,
  formatDateTo24Hour,
} from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
});
const isReportModalOpen = ref(false);
const loading = ref(false);
const data = ref({});
const updateKey = ref(Math.random());

// Set default dates with specific times
const getDefaultDates = () => {
  const today = new Date();

  // Create start date (today at 00:01)
  const start = new Date(today);
  start.setHours(0, 1, 0);

  // Create end date (today at 23:59)
  const end = new Date(today);
  end.setHours(23, 59, 0);

  return {
    start: formatDateTo24Hour(start),
    end: formatDateTo24Hour(end),
  };
};

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  from_date: getDefaultDates().start,
  to_date: getDefaultDates().end,
});

// Update the handlers to preserve 24-hour time format
const handleFromDateSelected = (date) => {
  if (!date) return;
  const [datePart] = date.split(" ");
  search.value.from_date = `${datePart} 00:01:00`;
  getReceivingReport();
};

const handleToDateSelected = (date) => {
  if (!date) return;
  const [datePart] = date.split(" ");
  search.value.to_date = `${datePart} 23:59:00`;
  getReceivingReport();
};

// Initialize report on open
const reportBehavior = () => {
  getReceivingReport();
  isReportModalOpen.value = true;
};

const getReceivingReport = async () => {
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
  getReceivingReport();
};

// Call getProductionReport when component is mounted
onMounted(() => {});
</script>
