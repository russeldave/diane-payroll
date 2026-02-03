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
                    Ingredients Name
                </th>
                <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Item Image
                </th>
                <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    MRF No.
                </th>
                <th title="Quantity per Unit" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    To Employee
                </th>
                <th class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Requestor Details
                </th>
                <th title="Requested Quantity" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Requested
                </th>
                <th title="Remaining Quantity" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Available
                </th>
                <th title="Released Quantity" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Released
                </th>
                <th title="PR Quantity" class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    PR'ed
                </th>
                <th class="px-2 py-3 text-center border text-xs md:text-sm font-medium uppercase tracking-wider">
                    Sample / Damage / Comparison
                </th>
                <th class="px-2 py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Remarks
                </th>
                <th class="px-2 py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider">
                    Status
                </th>
                </tr>
          </thead>
          <tbody>
            <template v-if="!loading && data.recivedIngreints?.length > 0">
             <tr
                v-for="mrf in data.recivedIngreints"
                :key="mrf.id"
                class="hover:bg-gray-300"
              >
                <td class="px-3 py-3 border text-center">
                  {{ mrf.DateOnly }}
                </td>

                <td class="px-4 py-4 border text-center">
                <span class="font-bold"> {{ mrf.ingredientIdNumber }}</span> - {{ mrf.itemName }} <span class=" italic text-xs font-semibold text-red-600">[{{ mrf.unitAbbre}}]</span>
                </td>

                <td class="px-3 py-3 border text-center">
                  {{ mrf.storeInWarehouseName }}
                </td>

                <td class="px-3 py-3 border text-center">
                  {{ mrf.supplierName }}
                </td>

                <td 
                  class="px-3 py-3 border text-center text-white text-xl text-nowrap bg-green-600 font-bold">
                  {{ Number(mrf.receivedQuantity).toLocaleString() }} <span class="text-xs font-semibold text-red-600">{{ mrf.unitAbbre}}</span>
                </td>

                <td 
                class="px-3 py-3 border text-center">
                {{ mrf.unitAbbre}}
                </td>

                <td class="px-3 py-3 border text-center">
                  {{ Number(mrf.price).toLocaleString() }}
                </td>

                <td class="px-3 py-3 border text-center">
                  {{ Number(mrf.price).toLocaleString() }}
                </td>

                <td class="px-3 py-3 border text-center">
                  {{ mrf.receivedByUserName}}
                </td>

                <td class="px-3 py-3 border text-center">
                  {{ mrf.remarks}}
                </td>
              </tr>
           </template>
           <!-- Loader -->
            <tr v-else-if="loading">
                <td class="px-2 py-2 border text-center" colspan="10">
                <Loader />
                </td>
            </tr>

            <tr v-else class="text-center">
              <td class="px-20 py-20 whitespace-nowrap text-sm text-gray-500" colspan="10">
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
import Paginator from "@/views/Component/Pagination.vue";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const props = defineProps({
  mrfs: Object,
});

const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({ mrfHistory: [], totalrows: 0 });

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
  await getmrfHistory();
  handlePagination(1);
}, 500);

const getmrfHistory = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/get-item-history`,
      formData,
      BearToken(token)
    );
       isViewModalOpen.value = true;
      
       console.log("dsa",response.data);

     if (response.data) {
      data.value = response.data;
    } else {
      data.value = { mrfHistory: [], totalrows: 0 };
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getmrfHistory();
};
const handleDateChange = () => {
  search.value.page_num = 1;
  getmrfHistory();
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
getmrfHistory()
};

const fillUserForm = (data) => {
  search.value.user_id = data.id;
  getmrfHistory();
};


onMounted(() => {
  if (props.show) getmrfHistory();
});
</script>
