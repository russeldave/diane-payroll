<template>
  <div>
    <!-- Button to trigger print functionality -->
    <button 
      @click.prevent="MRFBehavior()"
      :class="loading ? 'animated-pulse' : ''"
      class="bg-red-500 hover:opacity-70 focus:bg-blue-700 focus:bg-blue-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap">
      <i :class="loading ? 'fa fa-spinner fa-spin' : 'fas fa-print'"></i>&nbsp;{{ loading ? 'Preparing Data' : 'Print MRF Slip' }}
    </button>

    <!-- Tailwind Modal -->
   <Modal :show="isPrintMOdalOpen" :maxWidth="'6xl'" title="Print Preview" @close="isPrintMOdalOpen = false">
      <div class="block py-4">
        <!-- Modal Actions -->
        <div class="flex justify-end gap-2 px-6 py-2 border-b bg-gray-50">
          <button @click="printMRF"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2">
            <i class="fas fa-print"></i> Print
          </button>
          <!-- <button @click="isPrintMOdalOpen = false"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            Close
          </button> -->
        </div>
        <!-- Modal Content -->
        <div ref="content" class="pdf-content overflow-auto p-6">
          <!-- ...existing print content here... -->
          <table>
            <thead>
              <tr>
                <td style="border: 0;text-align: start;" width="77%" colspan="2">
                  <h2><b v-if="props.is_pending" :style="{color: props.is_pending ? 'red' : 'black' }">Draft</b> Material Requisition Form</h2>
                </td>
                <td style="border: 0" width="23%">
                  <p>MRF &nbsp; <b style="color: red">{{ mrfForm.mrf_number }}</b></p>
                  <p>Date: &nbsp; <u style="color: black">{{ mrfForm.date_of_mrf ?? '-' }}</u></p>
                </td>
              </tr>
            </thead>
          </table>
          <table>
            <thead>
              <tr>
                <td style="border: 0"  width="70%">
                  <p>Requested By: &nbsp; <u style="color: black">{{ mrfForm.requester_name }}</u></p>
                </td>
                <td style="border: 0" width="30%"></td>
              </tr>
              <tr>
                <td style="border: 0"  width="70%">
                  <p>Building No: &nbsp; <u style="color: black">{{ mrfForm.building_name }}</u></p>
                </td>
                <td style="border: 0" width="30%"></td>
              </tr>
            </thead>
          </table>
          <table>
            <tbody>
              <tr>
                <td style="border: 0; width: 100%; text-align: center; vertical-align: middle;">
                  <h4>SPECIFICATIONS</h4>
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th style="width: 20%;"><p>Item</p></th>
                <th style="width: 35%;"><p>Item Description</p></th>
                <th style="width: 10%;"><p>Unit</p></th>
                <th style="width: 15%;"><p>Location</p></th>
                <th style="width: 20%;"><p>Remarks</p></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i,ii) in items" :key="ii">
                <td><p style="color: black;text-transform: uppercase;">{{ i.itemName }} ({{ i.itemSku }})</p></td>
                <td><p>{{ i.description }}</p></td>
                <td><p>{{ i.quantity }} {{ i.unitAbbre }}</p></td>
                <td><p>{{ i.locationCompleteName ?? '-' }}</p></td>
                <td><p>{{ i.remarks === null ? '-' : i.remarks }}</p></td>
              </tr>
            </tbody>
          </table>
          <table style="margin-top: 20px;">
            <thead>
              <tr>
                <td style="border: 0"  width="50%">
                  <p>Created By: &nbsp; <u style="color: black;text-transform: uppercase;">{{ mrfForm.inputted_by_name }}</u></p>
                </td>
                <td style="border: 0" width="50%">
                  <p>Approved By: &nbsp; <u v-if="mrfForm.approver_name" style="color: black;text-transform: uppercase;">{{ mrfForm.approver_name ?? 'No Approver' }}</u></p>
                </td>
              </tr>
            </thead>
          </table>
          <p v-if="props.is_pending" style="color: red">{{ props.is_pending ? 'Note: This document is not valid until approved by an authorized person.' : '' }}</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from "vue"; // <-- add nextTick
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "@/views/Component/Loader.vue";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  mrfStatusFormatter,
  typeFormatter,
  handleApiError,
} from "@/views/Utility/Helper";
import { VUE_APP_API_URL,DATE_NOW,COMPANIES,DEFAULT_BG } from "@/views/Utility/Global";
import defaultImage from '@/assets/images/default/imageNotAvailable.jpg';
import Modal from "@/views/Component/Modal.vue";

const props = defineProps({
  data: Object,
  warehouse_id: Number,
  is_pending: {
    type: Boolean,
    default: false,
  },
});
const token = localStorage.getItem("token");

const isPrintMOdalOpen = ref(false);
const loading = ref(false);
const currentDate = new Date().toLocaleDateString();
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  mrf_id: 0,
});
const items = ref([]);
const mrfForm = ref({
  mrf_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  remarks: "",
  mrf_manual_number: "",
  building_name: "",
  requester_name: "",
  approver_name: "",
  inputted_by_name: "",
});

const MRFBehavior = async () => {
  loading.value = true;
  await fillForm(props.data);
  await nextTick(); // <-- wait for DOM update
  loading.value = false;
  isPrintMOdalOpen.value = true;
  // printMRF();
};
const fillForm = async () => {
  const data = props.data;

  console.log(data);
  mrfForm.value.mrf_id = data.id;
  mrfForm.value.date_of_mrf = data.dateOfmrf;
  mrfForm.value.our_company_id = data.ourCompanyId;
  mrfForm.value.our_company_name = data.ourCompanyName;
  mrfForm.value.remarks = data.remarks;
  mrfForm.value.mrf_manual_number = data.mrfManualNumber;
  mrfForm.value.mrf_number = data.mrfNumber;
  mrfForm.value.mrf_type = data.mrfType;
  mrfForm.value.requester_name = data.requestedByEmployeeName;
  mrfForm.value.approver_name = data.approvedByEmployeeName;
  mrfForm.value.building_name = data.buildingName ?? '-';
  mrfForm.value.inputted_by_name = data.createdByEmployeeName;

  await listItemsPerMRF(mrfForm.value.mrf_id);
};
const listItemsPerMRF = async (id) => {
  try {
    search.value.mrf_id = id;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}mrfs/get-items-per-mrf`,
      formData,
      BearToken(token)
    );
    items.value = response.data.mrfItems ?? [];
  } catch (error) {
    loading.value = false;
   console.log(error);
  }
};
// Printing Function (static content for testing)
const printMRF = () => {
  // Print the modal's .pdf-content
  const contentHTML = document.querySelector('.pdf-content').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print MRF Slip</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: figtree, sans-serif;
            margin: 0;
            padding: 0;
          }
          .pdf-content {
            padding: 20px;
            font-size: 12pt;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
          }
          th, td {
            padding: 6px;
            text-align: left;
            border: 1px solid #ddd;
          }
          p {
            font-size: 10pt;
          }
          h2 {
            font-size: 20pt !important;
          }
          th {
            background-color: #f2f2f2;
          }
          .text-right {
            text-align: right;
          }
          .font-bold {
            font-weight: bold;
          }
          .absolute {
            position: absolute;
          }
          .top-0 {
            top: 0;
          }
          .right-0 {
            right: 0;
          }
          .text-pink-600 {
            color: #d6336c;
          }
          .text-3xl {
            font-size: 1.875rem;
          }
        </style>
      </head>
      <body>
        <div class="pdf-content">${contentHTML}</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};
</script>
 <style scoped>
  @page {
    size: A4;
    margin: 20mm;
  }
  body {
    font-family: figtree, sans-serif;
    margin: 0;
    padding: 0;
  }
  .pdf-content {
    padding: 20px;
    font-size: 12pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
  }
  th, td {
    padding: 6px;
    text-align: left;
    border: 1px solid #ddd;
  }
  h2 {
    font-size: 20pt !important;
    font-weight: bold;
  }
  p {
    font-size: 12pt;
  }
  th {
    background-color: #f2f2f2;
  }
  .text-right {
    text-align: right;
  }
  .font-bold {
    font-weight: bold;
  }
  .absolute {
    position: absolute;
  }
  .top-0 {
    top: 0;
  }
  .right-0 {
    right: 0;
  }
  .text-pink-600 {
    color: #d6336c;
  }
  .text-3xl {
    font-size: 1.875rem;
  }
</style>