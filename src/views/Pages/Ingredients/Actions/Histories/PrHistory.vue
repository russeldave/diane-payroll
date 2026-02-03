<template>
  <div>
  
      <!-- Filters -->
      <div class="flex flex-col md:flex-row md:justify-between mb-4 mt-4">
        <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 mt-4"
      >
        <!-- Search Text -->
        <input
          type="search"
          placeholder="Search Requested Item..."
          v-model="search.search"
          @input.prevent="searchInput()"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
        />

        <!-- Type Select -->
        <select
          v-model="search.type"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleTypeChange"
        >
          <option value="0">All Dates</option>
          <!-- <option value="1">Hourly</option> -->
          <option value="2">Daily</option>
          <option value="3">Weekly</option>
          <option value="4">Monthly</option>
        </select>

        <input
          v-if="search.type === '1'"
          type="datetime-local"
          v-model="search.date"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleDateChange"
        />

        <input
          v-if="search.type === '2'"
          type="date"
          v-model="search.date"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleDateChange"
        />

        <input
          v-if="search.type === '3'"
          type="week"
          v-model="search.date"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleDateChange"
        />

        <input
          v-if="search.type === '4'"
          type="month"
          v-model="search.date"
          class="shadow shadow-gray-700 flex-1 font-bold text-lg py-2 px-4 rounded-lg"
          @change="handleDateChange"
        />

        <!-- User Search Dropdown -->
        <div
          class="w-full shadow shadow-gray-700 font-semibold text-base px-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <SearchDropdown
            apiEndpoint="users/search-name-only"
            :searchModel="searchUser"
            placeholder="Search User"
            itemLabel="name"
            itemId="id"
            inputId="userName"
            @item-selected="(data) => fillUserForm(data)"
            dataKey="users"
            returnName="['name']"
          />
        </div>
      </div>
      </div>

      <!-- Table -->
      <div class="flex w-full overflow-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid">
                <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    <i class="fa fa-xl fa-check-square text-green-500"></i>
                </th>
                <th width="20%" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Item
                </th>
                <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Pr No.
                </th>
                <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    MRF Quantity
                </th>
                <th title="Quantity per Unit" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    PR'ed
                </th>
                <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Received
                </th>
                <th title="Requested Quantity" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Price
                </th>
                <th title="Remaining Quantity" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    MRF'ed By
                </th>
                <th title="Released Quantity" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Created By
                </th>
                <th title="PR Quantity" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Remark
                </th>
                <th class="px-2 py-3 text-center border text-xs md:text-sm font-medium uppercase tracking-wider">
                    Status
                </th>
            </tr>
          </thead>
          <tbody>
             <template v-if="data.recivedIngreints?.length > 0 && !loading">
            <tr
              v-for="mrf in data.recivedIngreints"
              :key="mrf.id"
              class="hover:bg-gray-100"
            >
             
            </tr>
           </template>
           <tr v-else-if="loading">
              <td class="px-2 py-2 border text-center" colspan="10">
                <Loader />
              </td>
          </tr>
            <tr v-else class="text-center">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="10">
                     No Data Received.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
       <div class="flex w-full overflow-auto">
            <Paginator
                v-if="data.totalrows > 0 && !loading"
                :page_number="search.page_num"
                :total_rows="data.totalrows"
                :itemsperpage="search.itemsperpage"
                @page_num="handlePagination"
            />
       </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, handleApiError, useDebounce} from "@/views/Utility/Helper.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const props = defineProps({
  mrfs: Object,
});

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({ prHistory: [], totalrows: 0 });

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  type: 0, // Default to daily
  date: new Date().toISOString().split("T")[0], // Default to current date
  user_id: 0, // Default to current user
});

const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getprHistory();
  handlePagination(1);
}, 500);

const getprHistory = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/get-item-history`,
      formData,
      BearToken(token)
    );
     isViewModalOpen.value = true;
     if (response.data) {
      data.value = response.data;
    } else {
      data.value = { prHistory: [], totalrows: 0 };
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getprHistory();
};
const handleDateChange = () => {
  search.value.page_num = 1;
  getprHistory();
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
getprHistory()
};

const fillUserForm = (data) => {
  search.value.user_id = data.id;
  getprHistory();
};


onMounted(() => {
  if (props.show) getprHistory();
});
</script>
