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
    Scrap Report
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isReportModalOpen"
    :maxWidth="'lg'"
    title="Generate Scrap Report"
    @close="isReportModalOpen = false"
  >
    <div class="px-4 overflow-x-auto">
      <!-- <h1 class="text-lg lg:text-2xl font-bold mb-4">Generate Production Report</h1> -->
      <div class="grid grid-cols-1 mb-2 mt-4 gap-4">
        <!-- <div>
          <label for="" class="text-gray-500 text-md mb-1">Search</label>
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Transaction..."
            class="shadow shadow-gray-700 flex w-full focus-visible:bg-yellow-100 font-bold text-nowrap flex py-2 px-4 rounded-lg mb-4 float-end"
          />
        </div> -->
        <div>
          <label for="" class="text-gray-500 text-md mb-1">From Date</label>
          <DatePicker @dateSelected="(date) => handleFromDateSelected(date)" />
        </div>
        <div>
          <label for="" class="text-gray-500 text-md mb-1">To Date</label>
          <DatePicker @dateSelected="(date) => handleToDateSelected(date)" />
        </div>
        <div class="flex justify-end items-center mb-4">
          <button
            type="button"
            class="bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200"
          >
            <i class="fa fa-file-excel"></i>
            <span>Generate as Excel</span>
          </button>
        </div>
      </div>
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
} from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
});
const isReportModalOpen = ref(false);

const reportBehavior = () => {
  getScrapReport();
  isReportModalOpen.value = true;
};
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
  await getScrapReport();
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
const getScrapReport = async () => {
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
  getScrapReport();
};

// Call getScrapReport when component is mounted
onMounted(() => {});
</script>
