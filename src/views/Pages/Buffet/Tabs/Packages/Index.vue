<template>
  <!-- <div v-if="hasPermission('Buffet_Packages_Tab')"> -->
    <div>
    <div class="p-4 min-h-screen">
      <div class="flex flex-col lg:flex-row lg:justify-between mb-4">
        <div class="block lg:flex justify-start items-center space-x-2">
          <input
            type="search"
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search  Buffet..."
            class="shadow shadow-gray-700 flex w-full font-bold focus-visible:bg-yellow-100 text-sm md:text-md py-2 px-4 mb-4 float-end rounded"
          />
        </div>
        <div class="flex justify-end items-center space-x-2 overflow-auto">
          <!-- v-if="hasPermission('Add_Buffet_Button')" -->
          <Add
            @transaction_id="handleTransaction"
          />
        </div>
      </div>

      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <!-- <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  ID #
                </th> -->
              <!-- <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Image
                </th> -->
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('name')"
              >
                Package Name
                <i :class="getSortIcon('name')" class="ml-1"></i>
              </th>
              <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Ingredients
                </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs md:text-sm font-medium uppercase border tracking-wider"
                @click="handleSort('retailPrice')"
              >
                Price / pack
                <i :class="getSortIcon('retailPrice')" class="ml-1"></i>
              </th>
              <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Description
                </th>
              <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs md:text-sm font-medium uppercase border tracking-wider"
                >
                  Date Created
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
              v-for="pack in data.package"
              class="hover:bg-gray-200"
              v-if="data.package?.length > 0"
              :title="`Updated by: ${pack.userName ?? 'None'}`"
              :key="pack.id"
            >
              <td class="px-2 py-2 border text-center font-bold capitalize">{{ pack.name ?? 0 }}</td>
              <td class="px-2 py-2 border text-center font-bold text-wrap" width="35%">
                {{ pack.ingredients ?? "none" }}
              </td>
              <!-- <td class="px-2 py-2 border text-left uppercase">
                {{ pack.warehouseName ?? "none" }}
              </td> -->
              <!-- <td class="px-2 py-2 border text-left text-wrap">
                {{ pack.dateFrom ?? 0 }}
              </td> -->
              <td class="px-2 py-2 border text-center">{{ pack.price }}</td>
               <td class="px-2 py-2 border text-right">
                {{ pack.description ?? "none" }}
              </td>
              <td class="px-2 py-2 border text-center text-wrap">{{ pack.dateCreated ?? 0 }}</td>
              <td class="px-2 py-2 border">
                <div class="flex justify-center text-nowrap">
                  <!-- <View v-if="hasPermission('View_packet_Button')" :key="pack.id" :data="pack" @transaction_id="handleTransaction" /> -->
                  <!-- v-if="hasPermission('Edit_packet_Button')" -->
                  <Edit
                    :key="pack.id"
                    :data="pack"
                    @transaction_id="handleTransaction"
                  />
                  <!-- v-if="hasPermission('Delete_packet_Button')" -->
                  <Delete
                    :key="pack.id"
                    :data="pack"
                    @transaction_id="handleTransaction"
                  />
                </div>
              </td>
            </tr>
            <tr v-if="loading == true">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="7">
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="7">
                ***No buffet found***
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
  <!-- <div v-else>
    <Error403 />
  </div> -->
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
  MENU_DOWNLOAD_LINK,
  MENU_INGREDIENTS_DOWNLOAD_LINK,
} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  barcodeConverter,
  useDebounce,
  handleApiError,
  formatNumberWithCommas,
} from "@/views/Utility/Helper";
import Loader from "@/views/Component/Loader.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import Error403 from "@/views/Error/403.vue";
//actions
import Add from "./Actions/Add.vue";
import View from "./Actions/View.vue";
import Menu from "./Actions/Menu.vue";
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
  category_id: 0,
  sort_by: "dateFrom",
  sort_type: "DESC",
  is_show_deleted: false,
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  search.value.is_show_deleted = search.value.is_show_deleted ? 1 : 0;
  await listBuffets();
  handlePagination(1);
}, 500);

const listBuffets = async () => {
  try {
    loading.value = true;
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}buffets/list-package`,
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
  listBuffets();
};

const handleTransaction = (transaction_id) => {
  listBuffets();
  // alert('list reloaded');
};

// Add these new functions for sorting
const handleSort = (column) => {
  if (search.value.sort_by === column) {
    // Toggle sort direction if clicking the same column
    search.value.sort_type = search.value.sort_type === "ASC" ? "DESC" : "ASC";
  } else {
    // Set new column and default to ascending
    search.value.sort_by = column;
    search.value.sort_type = "ASC";
  }
  listBuffets();
};

const getSortIcon = (column) => {
  if (search.value.sort_by !== column) {
    return "fas fa-arrows-up-down text-white";
  }
  return search.value.sort_type === "ASC"
    ? "fas fa-arrow-up text-white"
    : "fas fa-arrow-down text-white";
};

const categoryDropdown = async () => {
  try {
    const response = await axios.get(
      `${VUE_APP_API_URL}buffet-categories/dropdown`,
      BearToken(token)
    );
    categories.value = response.data.categories;
  } catch (error) {
    handleApiError(error);
  }
};
// Call listBuffets when component is mounted
onMounted(() => {
  categoryDropdown();
  listBuffets();
});
</script>
