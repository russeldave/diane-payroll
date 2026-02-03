<template>
  <div>
    <!-- Button to trigger print functionality -->
    <button 
      @click.prevent="PRBehavior()"
      :class="loading ? 'animated-pulse' : ''"
     class="bg-red-500 hover:opacity-70 focus:bg-red-300 text-white font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap">
      <i :class="loading ? 'fa fa-spinner fa-spin' : 'fas fa-print'"></i>&nbsp;{{ loading ? 'Preparing Data' : 'Print PR Slip' }}
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
                    <h2><b v-if="props.is_pending" :style="{color: props.is_pending ? 'red' : 'black' }">Draft</b> Purchase Requisition Form</h2>
                  </td>
                  <td style="border: 0" width="23%" >
                    <p>PR No. &nbsp; <b style="color: red">{{ mrfForm.pr_number }}</b></p>
                    <p>Date: &nbsp; <u style="color: black">{{ mrfForm.date_of_pr ?? '-' }}</u></p>
                  </td>
                </tr>
                <tr>
                  <td style="border: 0;text-align: start;" width="77%" colspan="2">
                    <p>Company: &nbsp; <u style="color: black">Diane</u></p>
                  </td>
                  <td style="border: 0" width="23%">
                    
                  </td>
                </tr>
                <tr>
                  <td style="border: 0;text-align: start;" width="77%" colspan="2">
                    <p>Building No: &nbsp; <u style="color: black">Diane</u></p>
                  </td>
                  <td style="border: 0" width="23%">
                    
                  </td>
                </tr>
                <tr>
                  <td style="border: 0;text-align: start;" width="77%" colspan="2">
                    <p>Warehouse Destination: &nbsp; <u style="color: black">{{ mrfForm.warehouse_destination }}</u></p>
                  </td>
                  <td style="border: 0" width="23%">
                    
                  </td>
                </tr>
              </thead>
            </table>
            <table>
              <tbody>
                <tr>
                  <td style="border: 0; width: 100%; text-align: center; vertical-align: middle;">
                    <h4>Particulars</h4>
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th style="width: 20%;"><p>Item</p></th>
                  <!-- <th style="width: 35%;"><p><b>Item Description</b></p></th> -->
                  <th style="width: 10%;"><p>PR'ed</p></th>
                  <th style="width: 10%;"><p>Conversion</p></th>
                  <th style="width: 10%;"><p>Price</p></th>
                  <th style="width: 10%;"><p>Total</p></th>
                  <th style="width: 20%;"><p>MRF'ed By</p></th>
                  <th style="width: 20%;"><p>Remarks</p></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i,ii) in items" :key="ii">
                  <td>
                    <div class="flex">
                      <p style="color: black;">{{ i.itemName }}</p>
                      <span 
                      v-if="i.unitAbbre  != i.toUnitAbbre"
                      style="color: red;"
                      class="italic"
                      >
                      &nbsp;({{i.conversionRate }} {{i.unitAbbre }}/{{ i.toUnitAbbre ?? '' }})
                    </span>
                  </div>
                  </td>
                  
                  <!-- <td><p>{{ i.description }}</p></td> -->
                  <td>
                    <p>{{ i.quantity ?? 0 }} {{ i.unitAbbre }}</p>
                    <span style="color: red"  class="italic">
                      (₱{{ i.price }}/{{ i.unitAbbre }})
                    </span>
                  </td>
                  <td>    
                    <div style="width: 100px;" class="">
                      <p>{{ i.conversionQuantity }} {{ i.toUnitAbbre }}</p>
                      <!-- <span 
                        v-if="i.unitAbbre != i.toUnitAbbre"
                        style="color: red" class="italic text-red-500"
                        >
                        ({{i.conversionRate }} {{i.unitAbbre }}/{{ i.toUnitAbbre ?? '' }})
                      </span> -->
                    </div>
                  </td>
                  <td><p>₱{{parseFloat(i.prPriceConversion) }}</p></td>
                  <td>
                    <span class="text-lg font-bold underline">
                      ₱{{(i.conversionQuantity * i.prPriceConversion).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                    </span>
                  </td>
                  <td class="text-wrap"><p>{{ i.mrfByEmployeeName ?? '-' }}</p></td>
                  <!-- <td><p>{{ i.locationBuildingAbbre }} - {{ i.roomLocationNumber }}</p></td> -->
                  <td><p>{{ i.remarks === 'null' ? '' : i.remarks }}</p></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td colspan="2"class="font-bold underline text-lg text-right">Total</td>
                  <td class="font-bold text-xl underline decoration-double text-black">{{ grandTotal  }}</td>
                  <td></td>
                  <td></td>
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
  moneyFormatter
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
const data = ref([]);
const currentDate = new Date().toLocaleDateString();
const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  pr_id: 0,
});
const items = ref([]);
const mrfForm = ref({
  pr_id: 0,
  date_now: DATE_NOW(),
  our_company_id: 0,
  remarks: "",
  mrf_manual_number: "",
  building_name: "",
  requester_name: "",
  approver_name: "",
  inputted_by_name: "",
});

const PRBehavior = async () => {
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
  mrfForm.value.pr_id = data.id;
  await listItemsPerMRF(mrfForm.value.pr_id);
};

const fillPRHeader = async (data) => {
  mrfForm.value.date_of_pr = data.dateOfPr ?? DATE_NOW();
  mrfForm.value.our_company_id = data.ourCompanyId;
  mrfForm.value.our_company_name = data.ourCompanyName;
  mrfForm.value.remarks = data.remarks;
  mrfForm.value.pr_manual_number = data.prManualNumber;
  mrfForm.value.pr_number = data.prNumber;
  mrfForm.value.pr_type = data.prType;
  mrfForm.value.requester_name = data.requestedByEmployeeName;
  mrfForm.value.approver_name = data.approvedByEmployeeName;
  mrfForm.value.building_name = data.buildingName ?? '-';
  mrfForm.value.inputted_by_name = data.createdByEmployeeName;
  mrfForm.value.warehouse_destination = data.warehouseName ?? '-';
};

const listItemsPerMRF = async (id) => {
  try {
    search.value.pr_id = id;
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}prs/get-items-per-pr`,
      formData,
      BearToken(token)
    );
    const { prItems, pr} = response.data;

    await fillPRHeader(pr);
    items.value = prItems;
  } catch (error) {
    loading.value = false;
   console.log(error);
  }
};

const grandTotal = computed(() => {
  const total = items.value
    .reduce((sum, item) => sum + parseFloat((item.conversionQuantity * parseFloat(item.prPriceConversion)) || 0), 0);
  return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

// Printing Function (static content for testing)
const printMRF = () => {
  // Print the modal's .pdf-content
  const contentHTML = document.querySelector('.pdf-content').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print PR Slip</title>
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
            font-size: 8pt;
          }
          th, td {
            padding: 6px;
            font-size: 10pt;
            text-align: left;
            border: 1px solid #ddd;
          }
          h2 {
            font-size: 20pt !important;
          }
          p {
            font-size: 10pt;
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