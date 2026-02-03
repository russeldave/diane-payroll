<template>
  <div class="p-0 min-h-screen rounded-lg dark:border-gray-700">
    <div class="flex flex-col md:flex-row md:justify-between">
      <input
        type="search"
        placeholder="Search Warehouse..."
        v-model="search.search"
        @input.prevent="searchInput()"
        class="shadow shadow-gray-700 flex w-full md:w-1/4 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
      />
      <Add
        v-if="hasPermission('Add_Warehouse_Button')"
        @transaction_id="handleTransaction"
      />
    </div>
    <div class="flex w-full overflow-auto">
      <!-- Table to display warehouses -->
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table headers -->
        <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
          <tr class="border-b-2 border-solid border-yellow-500">
            <th
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Allowed in Receiving
            </th>
            <th
              class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Auto Unpack
            </th>
            <th
              class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Show Stocks
            </th>
            <th
              width="20%"
              class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Remarks
            </th>
            <th
              class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
          <!-- Loop through warehouses -->
          <tr
            v-for="warehouse in data.warehouses"
            v-if="data.warehouses?.length > 0 && loading == false"
            :key="warehouse.id"
          >
            <td class="px-2 py-2 border">{{ warehouse.name }}</td>
            <!-- Toggle display: show check or cross -->
            <td class="px-2 py-2 border text-center">
              <span
                class="inline-block px-2 py-1 rounded text-white text-xs"
                :class="warehouse.isAllowedInReceiving ? 'bg-green-500' : 'bg-red-500'"
              >
                {{ warehouse.isAllowedInReceiving ? "Yes" : "No" }}
              </span>
            </td>
            <td class="px-2 py-2 border text-center">
              <span
                class="inline-block px-2 py-1 rounded text-white text-xs"
                :class="warehouse.isAutoUnpack ? 'bg-green-500' : 'bg-red-500'"
              >
                {{ warehouse.isAutoUnpack ? "Yes" : "No" }}
              </span>
            </td>
            <td class="px-2 py-2 border text-center">
              <span
                class="inline-block px-2 py-1 rounded text-white text-xs"
                :class="warehouse.isShowStocks ? 'bg-green-500' : 'bg-red-500'"
              >
                {{ warehouse.isShowStocks ? "Yes" : "No" }}
              </span>
            </td>
            <td class="px-2 py-2 border text-wrap">{{ warehouse.remarks }}</td>

            <!-- Actions -->
            <td class="px-2 py-2 border">
              <div class="flex justify-center">
                <Edit
                  v-if="hasPermission('Edit_Warehouse_Button')"
                  :data="warehouse"
                  @transaction_id="handleTransaction"
                />
                <Delete
                  v-if="hasPermission('Delete_Warehouse_Button')"
                  :data="warehouse"
                  @transaction_id="handleTransaction"
                />
              </div>
            </td>
          </tr>

          <!-- Loading -->
          <tr v-if="loading == true">
            <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="6">
              <Loader />
            </td>
          </tr>

          <!-- Empty -->
          <tr v-if="data.totalrows == 0 && loading == false">
            <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="6">
              ***No Warehouse found***
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex w-full overflow-auto">
      <Paginator
        v-if="data.totalrows"
        :page_number="search.page_num"
        :total_rows="data.totalrows ?? 0"
        :itemsperpage="search.itemsperpage"
        @page_num="handlePagination"
      />
    </div>
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
  DEFAULT_BG,
} from "@/views/Utility/Global";
import { hasPermission } from "@/views/Utility/Permissions";

import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  useDebounce,
} from "@/views/Utility/Helper";

//actions
import Add from "./Actions/Add.vue";
import Edit from "./Actions/Edit.vue";
import Delete from "./Actions/Delete.vue";
import Loader from "@/views/Component/Loader.vue";

const token = localStorage.getItem("token");
const data = ref({});
const building = ref([]);
const loading = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listWarehouses();
  handlePagination(1);
}, 500);
const listWarehouses = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}warehouses/list`,
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
  listWarehouses();
};
const handleTransaction = (transaction_id) => {
  listWarehouses();
};
const buildingsDropdown = async () => {
  building.value = await BUILDING();
};
onMounted(() => {
  listWarehouses();
  buildingsDropdown();
});
</script>
