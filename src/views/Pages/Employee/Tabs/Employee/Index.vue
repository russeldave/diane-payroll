<template>
  <div class="flex flex-col md:flex-row md:justify-between mb-4 mt-4">
    <input
      type="search"
      placeholder="Search Employee..."
      v-model="search.search"
      @input.prevent="searchInput()"
      class="shadow shadow-gray-700 flex w-full md:w-1/2 lg:w-1/4 font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
    />
    <Add
      v-if="hasPermission('Add_Employee_Button')"
      @transaction_id="handleTransaction"
    />
  </div>
  <div class="flex w-full overflow-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
        <tr class="border-b-2 border-solid border-yellow-500 text-nowrap">
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
          >
            Employee ID
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
          >
            Name
          </th>
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
            Contact
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm text-nowrap">
        <tr v-for="employee in data.employees" :key="employee.id">
          <td class="px-6 py-4 whitespace-nowrap">
            {{ employee.employeeNumber }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ employee.firstName }} {{ employee.middleName }} {{ employee.lastName }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ employee.employeePositionName ?? "-" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ employee.contactInfo ?? "-" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex justify-center self-start">
              <View v-if="hasPermission('View_Employee_Button')" :data="employee" />
              <Edit
                v-if="hasPermission('Edit_Employee_Button')"
                :data="employee"
                @transaction_id="handleTransaction"
              />
              <Accountability
                v-if="hasPermission('Employee_Accountability_Button')"
                :data="employee"
                @transaction_id="handleTransaction"
              />
              <Barcode :data="employee" @transaction_id="handleTransaction" />
            </div>
          </td>
        </tr>
        <tr v-if="loading == true">
          <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="5">
            <Loader />
          </td>
        </tr>
        <tr v-if="data.totalrows == 0 && loading == false">
          <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="5">
            ***No Employee found***
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
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, useDebounce, handleApiError } from "@/views/Utility/Helper";
import Pagination from "@/views/Component/Pagination.vue";
import { hasPermission } from "@/views/Utility/Permissions";

//actions
import Add from "./Actions/Add.vue";
import View from "./Actions/View.vue";
import Edit from "./Actions/Edit.vue";
// import Accountability from "./Actions/Accountability.vue";
// import Loader from "@/views/Component/Loader.vue";
// import Barcode from "./Actions/Barcode.vue";

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
  await listEmployee();
  handlePagination(1);
}, 500);
const listEmployee = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      VUE_APP_API_URL + "/employees/list",
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listEmployee();
};
const handleTransaction = (id) => {
  listEmployee(); // Refresh the employee list
  console.log("Transaction handled:", id);
};

onMounted(() => {
  listEmployee();
});
</script>
