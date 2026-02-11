<template>
  <div v-if="hasPermission('Navigation_Logs') && hasPermission('Navigation_Settings')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- <BreadCrumbs :page="'Logs'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1">Logs</h1>
      <div class="flex flex-col lg:flex-row lg:justify-between mb-4">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="searchInput()"
          placeholder="Search Logs..."
          class="shadow shadow-gray-700 flex w-full lg:w-1/2 font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
        />
      </div>

      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Log Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Details
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Type
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
            <!-- Loop through products and display them -->
            <tr
              v-for="logs in data.logs"
              class="hover:bg-gray-200"
              v-if="data.logs?.length > 0 && loading == false"
              :key="logs.id"
            >
              <td class="px-6 py-3 border">{{ logs.createOn }}</td>
              <td class="px-6 py-3 border">{{ logs.description }}</td>
              <td class="px-6 py-3 border">{{ logs.type ?? "-" }}</td>
            </tr>
            <tr v-if="loading == true">
              <td class="px-6 py-3 border text-center text-red-500 font-bold" colspan="3">
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td class="px-6 py-3 border text-center text-red-500 font-bold" colspan="3">
                ***No Suppliers found***
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
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listSystemLogs();
  handlePagination(1);
}, 500);
const listSystemLogs = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}/logs/list`,
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
  listSystemLogs();
};
const handleTransaction = (transaction_id) => {
  listSystemLogs();
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
};
// Call listSystemLogs when component is mounted
onMounted(() => {
  categoryDropdown();
  listSystemLogs();
});
</script>
