<template>
  <div
    class="p-4 min-h-screen rounded-lg dark:border-gray-700"
  >
    <!-- Add Product Button -->
    <div class="flex justify-between md:w-1/2 w-full">
      <input
        type="search"
        placeholder="Search PO..."
        v-model="search.search"
        @input.prevent="listFDs()"
        class="shadow shadow-gray-700 flex w-full md:w-1/2 font-bold text-md md:text-lg py-2 px-4 rounded mb-4 float-end"
      />
      <div class="flex justify-end">
       
      </div>
    </div>
    <div class="flex w-full overflow-auto">
      <!-- Table to display products -->
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table headers -->
        <thead class=" text-white shadow text-nowrap" :class="DEFAULT_BG">
          <tr class="border-b-2 border-solid border-yellow-500">
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium  uppercase tracking-wider"
            >
              Order Date
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium  uppercase tracking-wider"
            >
              PO Manual No.
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium  uppercase tracking-wider"
            >
              PO No.
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium  uppercase tracking-wider"
            >
              Warehouse
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium  uppercase tracking-wider"
            >
              Supplier
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-left text-xs md:text-sm font-medium  uppercase tracking-wider"
            >
              Remark
            </th>
            <th
              scope="col"
              class="px-2 py-3 border text-center text-xs md:text-sm font-medium  uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-xs md:text-sm">
          <!-- Loop through products and display them -->
          <tr
            v-for="ri in data.pos"
            v-if="data.pos?.length > 0 && loading == false"
            :key="ri.id"
             class="text-nowrap hover:bg-gray-200"
          >
            <td class="px-2 py-1 border">{{ ri.dateOfPo }}</td>
            <td class="px-2 py-1 border">{{ ri.poManualNumber }}</td>
            <td class="px-2 py-1 border">{{ ri.poNumber }}</td>
            <td class="px-2 py-1 border">{{ ri.warehouseName ?? "-" }}</td>
            <td class="px-2 py-1 border">{{ ri.suppliername }}</td>
            <td class="px-2 py-1 border">{{ ri.remarks }}</td>
            <td class="px-2 py-1 border">
              <div class="flex justify-center">
                <View v-if="hasPermission('PO_Slip_View_Button')" :data="ri" @transaction_id="handleTransaction()" />
                <POSlip v-if="hasPermission('PO_Slip_View_Button')" :key="ri.id" :po_id="ri.id" @transaction_id="handleTransaction()" />
                <Undo v-if="hasPermission('PO_Slip_Undo_Button')" :data="ri" @transaction_id="handleTransaction()" />
              </div>
            </td>
          </tr>
          <tr v-if="loading == true">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="7">
              <Loader />
            </td>
          </tr>
          <tr v-if="data.totalrows == 0 && loading == false">
            <td  class="px-2 py-2 border text-center text-red-500 font-bold" colspan="7">
             ***No PO found***
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
  handleApiError
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";

import View from "../POForApproval/Actions/View.vue";
import POSlip from "./Actions/POSlip.vue";
import EditPO from "./Actions/EditPO.vue";
import Undo from "./Actions/Undo.vue";
import Loader from "@/views/Component/Loader.vue";


const token = localStorage.getItem("token");
const loading = ref(false);
const data = ref({});
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const listFDs = async () => {
  try {
    loading.value = true;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}pos/list-for-receiving`,
      formData,
      BearToken(token)
    );
    data.value = response.data;
    loading.value = false;
  } catch (error) {
    handleApiError(error);//
  }
};
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  listFDs();
};
const handleTransaction = (transaction_id) => {
  listFDs();
};
const downloadPDF = async (poId) => {
  try {
    const response = await axios.get(`${VUE_APP_API_URL}slip/poslip/${poId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Important for handling binary data
    });

    // Create a URL for the PDF Blob and open it
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'POS.pdf'); // Specify the filename
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    handleApiError(error);//
  }
}
onMounted(() => {
  listFDs();
});
</script>
