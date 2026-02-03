<template>
  <div
    class="p-4 min-h-screen rounded-lg dark:border-gray-700"
  >
    <div class="flex flex-col md:w-1/2 w-full">
      <input
        type="search"
        placeholder="Search Item..."
        v-model="search.search"
        @input.prevent="searchInput()"
        class="shadow shadow-gray-700 flex w-full md:w-1/2 font-bold text-md md:text-lg py-2 px-4 rounded mb-4 float-end"
      />
      <!-- <div class="flex justify-end">
        <PurchaseRequest
          v-if="hasPermission('Purchase_Request_Button')"
          :data="mrf_data"
          @transaction_id="handleTransaction()"
        />
      </div> -->
    </div>
    <div class="flex w-full overflow-auto">
      <!-- Table to display products -->
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table headers -->
        <thead class=" text-white shadow text-nowrap" :class="DEFAULT_BG">
          <tr class="border-b-2 border-solid">
            <th
              scope="col"
              width="20%"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Item
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              title="Quantity per Unit"
              class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Units
            </th>
            <th
              scope="col"
              title="Remaining Quantity"
              class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Float Stocks
            </th>
            <th
              scope="col"
              title="Remaining Quantity"
              class="px-2 py-3 border text-right text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Warehouse
            </th>
            <th
              scope="col"
              class="px-2 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider"
            >
              Remarks
            </th>
            <th
              scope="col"
              class="px-2 py-3 text-center text-xs md:text-sm border font-medium uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
          <!-- Loop through products and display them -->
          <tr
            v-for="(item, index) in data.floatStocks"
            v-if="data.floatStocks?.length > 0 && loading == false"
            :key="item.id"
            :title="'Requested By:' + item.userName"
            class="text-nowrap hover:bg-gray-200"
          >
            <td class="px-2 py-2 border hover:bg-green-200">
              <ItemTitle :item_id="item.itemId" :item_name="item.itemSku+' - '+item.itemName" />
            </td>
            <td class="px-2 py-2 border hover:bg-green-200 text-nowrap">
              {{ typeFormatter(item.isFixed) }}
            </td>
            <td class="px-2 py-2 border text-right hover:bg-green-200">
              {{ item.quantityPerUnit ?? 0 }} / {{ item.unitAbbre }}
            </td>
            <td
              class="px-2 py-3 border text-right hover:bg-green-200 text-white bg-blue-500"
            >
              <u class="text-md md:text-lg">{{ item.floatStocks }} {{ item.unitAbbre }}</u>
            </td>
            <td
              class="px-2 py-3 border text-left"
            >
              <p>{{ item.warehouseName }}</p>
            </td>
            <td
              class="px-2 py-3 border text-left"
            >
              <p>{{ item.remarks }}</p>
            </td>
            <!-- <td class="px-2 py-2 border">{{ mrfStatusFormatter(mrf.status) }}</td> -->
            <td class="px-2 py-3 border">
              <div class="flex justify-center">
                <AssignItemToBin 
                v-if="hasPermission('Assign_Item_To_Bin_Button')"
                :warehouse_id="props.warehouse_id" :mrf_id="item.id" :data="item" @transaction_id="handleTransaction"/>
              </div>
            </td>
          </tr>
          <tr v-if="loading == true">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="16">
              <Loader />
             </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="16">
             ***No MRF Items found***
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
import { VUE_APP_API_URL, DATE_NOW, COMPANIES, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  mrfStatusFormatter,
  mrfStatusClassFormatter,
  useDebounce,
  typeFormatter,
  handleApiError
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";


// controls

import AssignItemToBin from "./Actions/AssignItemToBin.vue";
import ProofImageViewer from "@/views/Pages/Items/Actions/ProofImageViewer.vue";
import ItemTitle from "@/views/Pages/Items/Actions/ItemTitle.vue";
import Loader from "@/views/Component/Loader.vue";
const token = localStorage.getItem("token");
const props = defineProps({
  warehouse_id: Number,
});
const data = ref({});
const mrf_data = ref([]);
const loading = ref(false);
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const searchInput =  useDebounce(async () => {
    search.value.page_num = 1;
    await listMRFs();
    handlePagination(1);
},500);
const listMRFs = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}warehouse-has-items/float-list`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
    checkSelected();
  } catch (error) {
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listMRFs();
};
const handleTransaction = (transaction_id) => {
  mrf_data.value = [];
  listMRFs();
};
const checkSelected = () => {
  if(data.value.mrfItems?.length > 0) {
    data.value.mrfItems.forEach((cp) => {
      cp.selected = mrf_data.value.some((mrf) => mrf.mrf_item_id === cp.id);
    });
  }else{
    console.log('No data found!');
  }
};

const selectedItemID = (data, selected) => {
  if (!mrf_data.value) {
    mrf_data.value = []; // Initialize mrf_data.value as an array if it's not already defined
  }

  if (selected) {
    // If selected is true, push the item to mrf_data.value
    mrf_data.value.push({
      mrf_item_id: data.id,
      item_id: data.itemId,
      item_name: `${data.itemSku} - ${ data.itemName }`,
      sub_quantity: data.subQuantity,
      requested_sub_quantity: data.subQuantity,
      sub_unit_abbre: data.subUnitAbbre,
      quantity_per_unit: data.quantityPerUnit,
      sub_unit_id: data.subUnitId,
      quantity: data.quantity - data.unpaidQuantity,
      requested_quantity: data.quantity - data.unpaidQuantity,
      unit_abbre: data.unitAbbre,
      unit_id: data.unitId,
      price: 0,
      remarks: data.remarks,
      total_quantity: 0,
    });
  } else {
    // If selected is false, remove the item from mrf_data.value
    // Find the index of the item to remove based on mrf_item_id
    const indexToRemove = mrf_data.value.findIndex(
      (item) => item.mrf_item_id === data.id
    );
    if (indexToRemove !== -1) {
      mrf_data.value.splice(indexToRemove, 1); // Remove item from mrf_data.value array
    }
  }
};

onMounted(() => {
  listMRFs();
});
</script>
