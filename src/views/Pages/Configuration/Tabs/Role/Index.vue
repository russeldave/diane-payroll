<template>
  <div
    class="p-0 min-h-screen rounded dark:border-gray-700"
  >
    <div class="flex flex-col lg:flex-row lg:justify-between px-2">
      <input
        type="search"
        placeholder="Search Role..."
        v-model="search.search"
        @input.prevent="listRoles()"
         class="shadow shadow-gray-700 flex w-full lg:w-1/4 focus-visible:bg-yellow-100 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
      />
      <div class="flex justify-end">
        <Add @transaction_id="handleTransaction" />
      </div>
    </div>
    <div class="flex w-full overflow-auto px-2">
      <!-- Table to display products -->
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table headers -->
        <thead class="text-white shadow" :class="DEFAULT_BG">
          <tr class="border-b-2 border-solid border-yellow-500">
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs md:text-sm font-medium  uppercase border tracking-wider"
            >
              Role
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-center text-xs md:text-sm font-medium  uppercase border tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loop through products and display them -->
          <tr v-for="role in data.roles"  v-if="data.roles?.length > 0 && loading == false" :key="role.id">
            <td class="px-2 py-2 border text-xs md:text-sm">{{ role.name }}</td>
            <td class="px-2 py-2 border">
              <div class="flex justify-center">
               <EditRole :data="role"  @transaction_id="handleTransaction" />
              </div>
            </td>
          </tr>
          <tr v-if="loading == true">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="2">
              <Loader />
             </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="2">
             ***No Roles found***
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
import { VUE_APP_API_URL, PERMISSION, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
import Add from "./Actions/Add.vue";
import EditRole from "./Actions/EditRole.vue";
import Loader from "@/views/Component/Loader.vue";
const token = localStorage.getItem("token");
const data = ref({});
const loading = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const listRoles = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}roles/list`,
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
  listRoles();
}
const handleTransaction = (transaction_id) => {
  listRoles();
}
// Call listProducts when component is mounted
onMounted(() => {
  listRoles();
});
</script>
