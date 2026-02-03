<template>
  <div v-if="hasPermission('Navigation_Tables')">
    <div class="px-4 min-h-screen rounded-lg dark:border-gray-700 bg-white">
      <BreadCrumbs :page="'Restaurant Tables'" />
      <h1 class="text-lg lg:text-2xl font-bold mb-4 mt-4">Restaurant Tables</h1>
      <div class="flex flex-col lg:flex-row lg:justify-between mb-4">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="searchInput()"
          placeholder="Search Tables..."
          class="shadow shadow-gray-700 flex w-full focus-visible:bg-yellow-100 lg:w-1/4 font-bold text-sm md:text-md py-2 px-4 rounded mb-4 float-end"
        />
        <div></div>
        <!-- <Add
          v-if="hasPermission('Add_Table_Button')"
          @transaction_id="handleTransaction"
        /> -->
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
                Name
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
            <!-- Loop through products and display them -->
            <tr
              v-for="ing in data.dinningTables"
              class="hover:bg-gray-200"
              v-if="data.dinningTables?.length > 0 && loading == false"
              :key="ing.id"
            >
              <td class="px-2 py-2 border capitalize">{{ ing.name }}</td>
              <td class="px-2 py-2 border">
                <div class="flex justify-center">
                  <Edit
                    v-if="hasPermission('Edit_Table_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
                  />
                  <Delete
                    v-if="hasPermission('Delete_Table_Button')"
                    :data="ing"
                    @transaction_id="handleTransaction"
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
                ***No Restaurant Table found***
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
import ImageViewer from "@/views/Component/ImageViewer.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  barcodeConverter,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
//actions
import Add from "./Actions/Add.vue";
import Edit from "./Actions/Edit.vue";
import Delete from "./Actions/Delete.vue";
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
  await listCategories();
  handlePagination(1);
}, 500);
const listCategories = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}dinning-tables/list-in-cashier`,
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
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listCategories();
};
const handleTransaction = (transaction_id) => {
  listCategories();
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
};
// Call listCategories when component is mounted
onMounted(() => {
  // categoryDropdown();
  listCategories();
});
</script>
