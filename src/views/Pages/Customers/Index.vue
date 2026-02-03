<template>
  <div v-if="hasPermission('Navigation_Users') && hasPermission('Navigation_Settings')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- Add Product Button -->
      <!-- <BreadCrumbs :page="'Customer Management'" /> -->
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-1 px-2">Customer Management</h1>
      <div class="flex flex-col lg:flex-row lg:justify-between px-2">
        <input
          type="search"
          placeholder="Search Customer..."
          v-model="search.search"
          @input.prevent="listCustomers()"
          class="shadow shadow-gray-700 flex w-full lg:w-1/4 focus-visible:bg-yellow-100 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
        />
        <!-- <Add v-if="hasPermission('Add_Customer_Button')" @transaction_id="handleTransaction()"/> -->
      </div>
      <div class="flex w-full overflow-auto px-2">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Customer ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Customer Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Contact No.
              </th>
              <!-- <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium  uppercase border tracking-wider"
              >
                Actions
              </th> -->
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loop through products and display them -->
            <tr
              v-for="user in data.customers"
              v-if="data.customers?.length > 0 && loading == false"
              :key="user.id"
            >
              <td class="px-2 py-2 border">{{ user.accountNumber }}</td>
              <td class="px-2 py-2 border capitalize">{{ user.name }}</td>
              <td class="px-2 py-2 border">{{ user.contactInfo }}</td>
              <!-- <td class="px-2 py-2 border">
                <div class="flex justify-center">
                
                </div>
              </td> -->
            </tr>
            <tr v-if="loading == true">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="8">
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="8">
                ***No Users found***
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

    <!-- Edit Product Modal -->
    <!-- Similar modal structure as above -->
  </div>
  <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

import Add from "./Actions/Add.vue";

const token = localStorage.getItem("token");
const data = ref([]); // Array to hold products
const loading = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const listCustomers = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}customers/list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    handleApiError(error); //
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listCustomers();
};
const handleTransaction = (transaction_id) => {
  listCustomers();
};
// Call listCustomers when component is mounted
onMounted(() => {
  listCustomers();
});
</script>
