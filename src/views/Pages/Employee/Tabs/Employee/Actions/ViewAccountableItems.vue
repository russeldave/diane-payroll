<template>
  <div class="flex justify-start">
    <input
      type="search"
      placeholder="Search Item..."
      v-model="search.search"
      @input="searchInput"
      class="shadow shadow-gray-700 flex w-full font-bold text-md md:text-lg py-2 px-4 rounded mb-4 float-end"
    />
  </div>
  <div class="flex w-full overflow-auto">
    <!-- Table to display products -->
    <table class="min-w-full divide-y divide-gray-200">
      <!-- Table headers -->
      <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
        <tr class="border-b-2 border-solid border-yellow-500 text-xs md:text-md">
          <th
            scope="col"
            class="px-6 py-3 text-left font-medium uppercase border tracking-wider"
          >
            Item
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-right font-medium uppercase border tracking-wider"
          >
            Quantity
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-cennter font-medium uppercase border tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200 text-sm md:text-md">
        <!-- Loop through products and display them -->
        <tr
          v-for="item in data.items"
          v-if="data.items?.length > 0 && loading == false"
          :key="item.id"
        >
          <td class="px-2 py-2 border"><p class="flex"><ItemTitle :key="item.itemId" :item_id="item.itemId" :item_name="item.itemCompleteName" /></p></td>
          <td class="px-2 py-2 border text-right">{{ item.quantity }} <sub>{{ item.unitAbbre }}</sub></td>
          <td class="px-2 py-2 border">
            <div class="flex justify-center">
              <UnassignItem
                :key="item.itemId"
                :data="item"
                @transaction_id="handleTransaction"
              />
            </div>
          </td>
        </tr>
        <tr v-if="loading == true">
          <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="6">
            <Loader />
           </td>
        </tr>
        <tr v-if="data.totalrows == 0 && loading == false">
          <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="6">
           ***No Item found***
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
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Paginator from "@/views/Component/Pagination.vue";
import { hasPermission } from "@/views/Utility/Permissions";
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
  replaceUnderScore,
  handleApiError,
  useDebounce
} from "@/views/Utility/Helper";
import Loader from "@/views/Component/Loader.vue";

import UnassignItem from './UnassignItem.vue';
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const isEditModalOpen = ref(false);
const data = ref([]);
const loading = ref(false);
const props = defineProps({
  data: Object,
});
const search = ref({
  search: "",
  itemsperpage: 10,
  page_num: 1,
  employee_id: 0,
});
const locationForm = ref({
  sku: 0,
  warehouse_name: "",
  building_name: "",
});

const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listAccountableItems();
}, 500);

const locationBehavior = () => {
  locationForm.value = props.data;

  search.value.employee_id = locationForm.value.employee_id;
  listAccountableItems();
};
const listAccountableItems = async () => {
  try {
    data.value = [];
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}employees-accountability/list`,
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
  listAccountableItems();
};
const handleTransaction = (transaction_id) => {
  listAccountableItems();
};
onMounted(() => {
  locationBehavior();
});
</script>
