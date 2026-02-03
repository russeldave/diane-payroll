<template>
  <button
    @click.prevent="itemBehavior()"
    title="Supplier List"
    class="p-2 bg-stone-500 hover:opacity-70 focus:bg-stone-300 animate-pulse rounded-r text-white"
  >
    <i class="fas fa-warehouse"></i>
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'6xl'"
    title="Item Warehouse Location"
    @close="isViewModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="flex flex-col md:flex-row md:justify-between mb-4">
        <h1 class="text-2xl font-bold">{{ props.data.item_name }}</h1>
      </div>
      <div class="flex flex-col md:flex-row md:justify-between">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="searchInput()"
          placeholder="Search Items..."
          class="shadow shadow-gray-700 flex w-full md:w-1/2 font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
        />
        <!-- <AssignItem v-if="hasPermission('Items_Assign_Warehouse_To_Items_Button')" :data="props.data" @transaction_id="handleTransaction" /> -->
        <!-- <AssignSupplier v-if="hasPermission('Items_Assign_Supplier_To_Items_Button')" :data="props.data" @transaction_id="handleTransaction" /> -->
      </div>
      <div class="flex w-full overflow-auto">
        <!-- Table to display products -->
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table headers -->
          <thead class="text-white shadow text-nowrap" :class="DEFAULT_BG">
            <tr class="border-b-2 border-solid border-yellow-500">
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-md font-medium uppercase border tracking-wider"
              >
                Warehouse
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-md font-medium uppercase border tracking-wider"
              >
                Stocks
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-md font-medium uppercase border tracking-wider"
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-lg">
            <!-- Loop through products and display them -->
            <tr
              v-for="item in data.itemInWarehouses"
              v-if="data.itemInWarehouses?.length > 0 && loading == false"
              :key="item.id"
            >
              <td class="px-2 py-2 border">{{ item.warehouseName ?? "-" }}</td>
              <td class="px-2 py-2 border">{{ item.floatStocks }}</td>
              <td class="px-2 py-2 border">{{ item.remarks }}</td>
            </tr>
            <tr v-if="loading == true">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="4">
                <Loader />
              </td>
            </tr>
            <tr v-if="data.totalrows == 0 && loading == false">
              <td class="px-2 py-2 border text-center text-red-500 font-bold" colspan="4">
                ***No Supplier found***
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
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import {
  VUE_APP_API_URL,
  PERMISSION,
  BUILDING,
  CATEGORIES,
  DEFAULT_BG,
} from "@/views/Utility/Global";
import { FormDx, BearToken, useDebounce, moneyFormatter } from "@/views/Utility/Helper";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { hasPermission } from "@/views/Utility/Permissions";

import Loader from "@/views/Component/Loader.vue";
const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});

const isViewModalOpen = ref(false);
const data = ref({});
const loading = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  item_id: 0,
});
const itemBehavior = () => {
  const data = props.data;

  search.value.item_id = data.item_id;
  isViewModalOpen.value = true;
  listItemSuppliers();
};
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listItemSuppliers();
  handlePagination(1);
}, 500);
const handleTransaction = () => {
  listItemSuppliers();
};
const listItemSuppliers = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}warehouse-has-items/item-in-warehouses`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
    // setTimeout(async () => {
    //   //gidelay ni nako para masure nga naload tanan na data ok
    //   await generateBarcodesForSuppliers(response.data.suppliers);
    // }, 500);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  listItemSuppliers();
};
</script>
