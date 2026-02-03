<template>
  <div v-if="hasPermission('Navigation_Units') && hasPermission('Navigation_Inventory')">
    <div class="px-4 file:min-h-screen rounded-lg">
      <div class="flex flex-col md:flex-row md:justify-between mb-4">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="searchInput()"
          placeholder="Search Unit..."
          class="shadow shadow-gray-700 flex w-full md:w-1/4 font-bold text-sm md:text-md py-2 px-4 rounded-lg mb-4 float-end"
        />
        <Add
          v-if="hasPermission('Add_Unit_Button')"
          @transaction_id="handleTransaction"
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
                Name
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
            <!-- Loop through products and display them -->
            <tr
              v-for="unit in data.units"
              v-if="data.units?.length > 0 && loading == false"
              :key="unit.id"
            >
              <td class="px-2 py-2 border capitalize">
                {{ unit.name }} ({{ unit.abbre }})
              </td>
              <td class="px-2 py-2 border">{{ unit.remarks }}</td>
              <td class="px-2 py-2 border">
                <div class="flex justify-center items-center">
                  <!-- <Edit :data="unit" @transaction_id="handleTransaction" /> -->
                  <Delete
                    v-if="hasPermission('Delete_Unit_Button')"
                    :data="unit"
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
                ***No Units found***
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
import Loader from "@/views/Component/Loader.vue";
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
  await listUnits();
  handlePagination(1);
}, 500);
const listUnits = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}units/list`,
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
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listUnits();
};
const handleTransaction = (transaction_id) => {
  listUnits();
};
const categoryDropdown = async () => {
  categories.value = await CATEGORIES();
};
// Call listUnits when component is mounted
onMounted(() => {
  categoryDropdown();
  listUnits();
});
</script>
