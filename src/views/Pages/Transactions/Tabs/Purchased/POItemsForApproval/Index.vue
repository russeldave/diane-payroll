<template>
  <div
    class="p-4 min-h-screen rounded-lg dark:border-gray-700"
  >
    <!-- Add Product Button -->
    <div class="flex flex-col md:flex-row md:justify-between">
      <div class="flex justify-start md:w-1/2 w-full">
        <input
          type="search"
          placeholder="Search Item..."
          v-model="search.search"
          @input.prevent="searchInput()"
          class="shadow shadow-gray-700 flex w-full md:w-1/2 font-bold text-md md:text-lg py-2 px-4 rounded mb-4 float-end"
        />
        <!-- <select
          placeholder="Select Building Name"
          class="shadow shadow-gray-700 flex w-1/2 font-bold text-md md:text-lg py-2 px-4 rounded-r mb-4 float-end"
          v-model="search.warehouse_id"
          @change.prevent="searchInput()"
        >
          <option
            v-for="(w, ww) in warehouse"
            :key="w.id"
            :value="w.warehouseId"
          >
            {{ w.warehouseName }}
          </option>
          <option value="0">All</option>
        </select> -->
      </div>
      <div class="flex justify-end"></div>
    </div>
    <div class="flex w-full overflow-auto">
      <!-- Table to display products -->
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table headers -->
        <thead class=" text-white shadow text-nowrap" :class="DEFAULT_BG">
          <tr class="border-b-2 border-solid">
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              <i class="fa fa-xl fa-check-square text-green-500"></i>
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Item
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              PR No.
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              PO No.
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              PR'ed
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              PO'ed
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Received
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Remark
            </th>
            <!-- <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Actions
            </th> -->
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
          <!-- Loop through products and display them -->
          <tr
            v-for="(pr, index) in data.prItems"
            v-if="data.prItems?.length > 0 && loading == false"
            :key="pr.id"
            class="text-nowrap hover:bg-gray-200"
          >
            <td class="px-2 py-3 border">
              <div class="text-center">
                <input
                  type="checkbox"
                  class="h-5 w-5 text-slate-600"
                  v-model="pr.selected"
                  @change.prevent="selectedItemID(pr, pr.selected)"
                />
              </div>
            </td>
            <td class="px-2 py-3 border hover:bg-green-200 text-wrap">
              <ItemTitle :item_id="pr.itemId" :item_name="pr.itemName" />
            </td>
            <td class="px-2 py-3 border">{{ pr.prNumber }}</td>
            <td class="px-2 py-3 border">{{ pr.poNumber }}</td>
            <td class="px-2 py-3  border text-right bg-green-500 font-bold text-white">
              <p>{{ pr.prQuantity ?? 0 }} {{ pr.unitAbbre }}</p>
            </td>
            <td class="px-2 py-3  border text-right bg-yellow-500  font-bold text-white">
              <p>{{ pr.quantity ?? 0 }} {{ pr.unitAbbre }}</p>
            </td>
            <td class="px-2 py-3  border text-right bg-teal-500  font-bold text-white">
              <u class="text-md md:text-lg">{{ pr.receivedQuantity ?? 0 }} {{ pr.unitAbbre }}</u>
            </td>
            <td class="px-2 py-3 border">{{ pr.remarks }}</td>
            <!-- <td class="px-2 py-3  border">{{ mrfStatusFormatter(mrf.status) }}</td> -->
            <!-- <td class="px-2 py-3 border">
              <div class="flex justify-center">
                <Undo
                  v-if="hasPermission('PO_Item_Assign_Undo_Button')"
                  :data="pr"
                  @transaction_id="handleTransaction()"
                />
              </div>
            </td> -->
          </tr>
          <tr v-if="loading == true">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="11">
              <Loader />
             </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="11">
             ***No PO Items found***
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
import { onMounted, ref, watch, defineProps } from "vue";
import axios from "axios";
import { VUE_APP_API_URL, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  useDebounce,
  moneyFormatter,
  handleApiError
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";
import Paginator from "@/views/Component/Pagination.vue";
import Undo from "./Actions/Undo.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import Loader from "@/views/Component/Loader.vue";

const token = localStorage.getItem("token");
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const props = defineProps({
  warehouse_id: Number,
});
// Define reactive refs
const data = ref({});
const fd_data = ref([]);
const loading = ref(false);
const item_array = ref([]);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  warehouse_id: props.warehouse_id, // Initialize with default_warehouse value
});

// Watch for changes in default_warehouse and update warehouse_id
watch(props.warehouse_id, (newValue, oldValue) => {
  if(newValue != oldValue){
    search.value.warehouse_id = newValue; // Update search.warehouse_id
    listFDs(); // Reload data based on new warehouse_id
  }
});
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await listFDs();
  handlePagination(1);
}, 500);
const listFDs = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}pos/list-po-items-for-approval`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
    checkSelected();
  } catch (error) {
    handleApiError(error);//
  }
};

const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listFDs();
};

const handleTransaction = (transaction_id) => {
  fd_data.value = [];
  listFDs();
};

const checkSelected = () => {
  data.value.prItems.forEach((cp) => {
    cp.selected = fd_data.value.some((mrf) => mrf.mrf_item_id === cp.id);
  });
};

const selectedItemIDV1 = (data, selected) => {
  if (!fd_data.value) {
    fd_data.value = []; // Initialize fd_data.value as an array if it's not already defined
  }

  if (selected) {
    // If selected is true, push the item to fd_data.value
    fd_data.value.push({
      po_item_id: data.id,
      item_id: data.itemId,
      item_name: data.itemName,
      received_sub_quantity: data.subQuantity,
      requested_sub_quantity: data.subQuantity,
      sub_unit_abbre: data.subUnitAbbre,
      quantity_per_unit: data.quantityPerUnit,
      sub_unit_id: data.subUnitId,
      received_quantity: data.quantity,
      requested_quantity: data.quantity,
      unit_abbre: data.unitAbbre,
      unit_id: data.unitId,
      price: 0,
      brand_id: data.brandId,
      brand_name: data.brandName,
      brand_abbre: data.brandAbbre,
      sub_price: 0,
      discount: 0,
      total_price: 0,
      remarks: data.remarks,
      total_quantity: 0,
    });
  } else {
    // If selected is false, remove the item from fd_data.value
    // Find the index of the item to remove based on mrf_item_id
    const indexToRemove = fd_data.value.findIndex(
      (item) => item.po_item_id === data.id
    );
    if (indexToRemove !== -1) {
      fd_data.value.splice(indexToRemove, 1); // Remove item from fd_data.value array
    }
  }
};
const selectedItemID = (data, selected) => {
  // Initialize fd_data.value as an array if it's not already defined
  if (!fd_data.value) {
    fd_data.value = [];
  }

  // Initialize item_array.value as an array if it's not already defined
  if (!item_array.value) {
    item_array.value = [];
  }

  if (selected) {
    // If selected is true, push the item to fd_data.value
    fd_data.value.push({
      po_item_id: data.id,
      item_id: data.itemId,
      item_name: data.itemName,
      received_sub_quantity: data.subQuantity,
      requested_sub_quantity: data.subQuantity,
      sub_unit_abbre: data.subUnitAbbre,
      quantity_per_unit: data.quantityPerUnit,
      sub_unit_id: data.subUnitId,
      received_quantity: data.quantity,
      requested_quantity: data.quantity,
      unit_abbre: data.unitAbbre,
      unit_id: data.unitId,
      price: 0,
      brand_id: data.brandId,
      brand_name: data.brandName,
      brand_abbre: data.brandAbbre,
      sub_price: 0,
      discount: 0,
      total_price: 0,
      remarks: data.remarks,
      total_quantity: 0,
    });

    // Add itemId to item_array.value if not already present
    if (!item_array.value.includes(data.itemId)) {
      item_array.value.push(data.itemId);
    }
  } else {
    // If selected is false, remove the item from fd_data.value
    const indexToRemove = fd_data.value.findIndex(
      (item) => item.po_item_id === data.id
    );
    if (indexToRemove !== -1) {
      fd_data.value.splice(indexToRemove, 1); // Remove item from fd_data.value array
    }

    // Remove itemId from item_array.value if present
    const itemIndexToRemove = item_array.value.indexOf(data.itemId);
    if (itemIndexToRemove !== -1) {
      item_array.value.splice(itemIndexToRemove, 1); // Remove itemId from item_array.value array
    }
  }
};

onMounted(() => {
  listFDs();
});
</script>
