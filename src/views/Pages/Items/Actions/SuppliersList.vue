<template>
  <button
    @click.prevent="itemBehavior()"
    title="Supplier List"
    type="button"
    :class="props.className"
  >
    <i class="fas fa-truck"></i>
    <span v-if="!props.iconOnly">&nbsp;Suppliers</span>
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'6xl'"
    title="View List of Suppliers"
    @close="isViewModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="flex flex-col md:flex-row md:justify-between mb-4">
        <h1 class="text-2xl font-bold" v-if="props.iconOnly">
          {{ props.data.sku_name }} - {{ props.data.item_name }}
        </h1>
        <h1 class="text-2xl font-bold" v-else>
          {{ props.data.sku }} - {{ props.data.name }}
        </h1>
      </div>
      <div class="flex flex-col md:flex-row md:justify-between">
        <input
          type="search"
          v-model="search.search"
          @input.prevent="searchInput()"
          placeholder="Search Items..."
          class="shadow shadow-gray-700 flex w-full md:w-1/2 font-bold text-lg py-2 px-4 rounded-lg mb-4 float-end"
        />
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
                Supplier
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-md font-medium uppercase border tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs md:text-md font-medium uppercase border tracking-wider"
              >
                Discount
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
              v-for="item in data.suppliersOfItems"
              v-if="data.suppliersOfItems?.length > 0 && loading == false"
              :key="item.id"
            >
              <td class="px-2 py-2 border">{{ item.supplierName ?? "-" }}</td>
              <td class="px-2 py-2 border">{{ item.price }}</td>
              <td class="px-2 py-2 border">{{ item.discountAmount ?? "-" }}</td>
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
  iconOnly: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default:
      "bg-stone-700 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap",
  },
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
  console.log(data);
  search.value.item_id = props.iconOnly ? data.item_id : data.id;
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
      `${VUE_APP_API_URL}items/get-item-suppliers`,
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
