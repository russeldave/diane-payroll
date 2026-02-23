<template>
  <div class="flex flex-col md:flex-row md:justify-between mb-4 mt-4">
    <input
      type="search"
      placeholder="Search Position..."
      v-model="search.search"
      @input.prevent="searchInput()"
      class="shadow shadow-gray-700 flex w-full md:w-1/2 lg:w-1/4 font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
    />
    <Add
      v-if="hasPermission('Add_Position_Button')"
      @transaction_id="handleTransaction"
    />
  </div>
  <div class="flex w-full overflow-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
        <tr class="border-b-2 border-solid border-yellow-500">
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
          >
            Position
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
          >
            Remarks
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
        <tr
          v-for="position in data.employeePositions"
          v-if="data.employeePositions?.length > 0 && loading == false"
          :key="position.id"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            {{ position.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ position.remarks }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex justify-center">
              <Edit
                v-if="hasPermission('Edit_Position_Button')"
                :data="position"
                @transaction_id="handleTransaction"
              />
            </div>
          </td>
        </tr>
        <tr v-if="loading == true">
          <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="3">
            <Loader />
          </td>
        </tr>
        <tr v-if="data.totalrows == 0 && loading == false">
          <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="3">
            ***No Position found***
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination
    v-if="data.totalrows"
    :page_number="search.page_num"
    :total_rows="data.totalrows ?? 0"
    :itemsperpage="search.itemsperpage"
    @page_num="handlePagination"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, useDebounce, handleApiError } from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";

import Add from "./Actions/Add.vue";
import View from "./Actions/View.vue";
import Edit from "./Actions/Edit.vue";
import Pagination from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import Loader from "@/views/Component/Loader.vue";

const token = localStorage.getItem("token");
const data = ref([]);
const loading = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listPosition();
  handlePagination(1);
}, 500);
const listPosition = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      "api/employee-positions/list",
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listPosition();
};
const handleTransaction = (id) => {
  listPosition(); // Refresh the employee list
  console.log("Transaction handled:", id);
};

onMounted(() => {
  listPosition();
});
</script>
