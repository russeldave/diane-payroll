<template>
  <div v-if="hasPermission('Navigation_Users') && hasPermission('Navigation_Settings')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <!-- Add Product Button -->
      <BreadCrumbs :page="'User Management'" />
      <h1 class="text-lg md:text-2xl font-bold mb-4 mt-4 px-2">User Management</h1>
      <div class="flex flex-col md:flex-row md:justify-between px-2">
        <input
          type="search"
          placeholder="Search Users..."
          v-model="search.search"
          @input.prevent="searchInput()"
          class="shadow shadow-gray-700 flex w-full md:w-1/4 focus-visible:bg-yellow-100 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
        />
        <Add
          v-if="hasPermission('Add_User_Button')"
          @transaction_id="handleTransaction()"
        />
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
                Username
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                ZOHO User ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Employee Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Barcode
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loop through products and display them -->
            <tr
              v-for="user in data.users"
              v-if="data.users?.length > 0 && loading == false"
              :key="user.id"
            >
              <td class="px-2 py-2 border">{{ user.name }}</td>
              <td class="px-2 py-2 border">{{ user.email }}</td>
              <td class="px-2 py-2 border">{{ user.zohoUserId ?? "-" }}</td>
              <td class="px-2 py-2 border">{{ user.roleName }}</td>
              <td class="px-2 py-2 border">{{ user.employeeName }}</td>
              <td class="px-2 py-2 border">{{ user.barCodeToken }}</td>
              <td class="px-2 py-2 border">
                <div class="flex justify-center">
                  <Role
                    v-if="hasPermission('Assign_Role_Button')"
                    :data="user"
                    @transaction_id="handleTransaction()"
                  />
                  <Edit
                    v-if="hasPermission('Edit_User_Button')"
                    :data="user"
                    @transaction_id="handleTransaction()"
                  />
                  <BindEmployee
                    v-if="hasPermission('Bind_Employee_Button')"
                    :data="user"
                    @transaction_id="handleTransaction()"
                  />
                  <!-- <AssignStore
                    v-if="hasPermission('Assign_Store_Button')"
                    :data="user"
                    @transaction_id="handleTransaction()"
                  /> -->
                  <AssignWarehouse
                    v-if="hasPermission('Assign_Warehouse_Button')"
                    :data="user"
                    @transaction_id="handleTransaction()"
                  />
                  <ResetPassword
                    v-if="hasPermission('Reset_Password_Button')"
                    :data="user"
                    @transaction_id="handleTransaction()"
                  />
                </div>
              </td>
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
import { FormDx, BearToken, Alert, handleApiError,useDebounce } from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
import Loader from "@/views/Component/Loader.vue";

import Add from "./Actions/Add.vue";
import Edit from "./Actions/Edit.vue";
import Role from "./Actions/Role.vue";
import ResetPassword from "./Actions/ResetPassword.vue";
import AssignStore from "./Actions/AssignStore.vue";
import AssignWarehouse from "./Actions/AssignWarehouse.vue";
import BindEmployee from "./Actions/BindEmployee.vue";

const token = localStorage.getItem("token");
const data = ref([]); // Array to hold products
const loading = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const listUsers = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}users/list`,
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
  listUsers();
};
const handleTransaction = (transaction_id) => {
  listUsers();
};

const searchInput =  useDebounce(async () => {
  search.value.page_num = 1;
  await listUsers();
  handlePagination(1);
},500);

// Call listUsers when component is mounted
onMounted(() => {
  listUsers();
});
</script>
