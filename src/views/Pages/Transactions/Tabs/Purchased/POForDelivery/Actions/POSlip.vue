<template>
  <div>
    <!-- Button to trigger print functionality -->
    <button 
    @click.prevent="printPO()"
    :class="loading ? 'animated-pulse' : ''"
    class="bg-stone-500 hover:opacity-70 focus:bg-stone-300 text-white font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap">
      <i class="fas fa-print"></i> Print PO Slip
    </button>

    <!-- Content to be printed -->
    <div ref="content" class="pdf-content hidden">
      <div class="max-w-[200mm] mx-auto bg-white p-6 shadow-lg text-xs">
        <!-- Header Section -->
        <div class="flex justify-between items-start mb-4">
          <div class="w-1/2">
                <h1 class="text-xl font-bold text-gray-800 mb-2">PURCHASE ORDER</h1>
                <p class="text-gray-600">{{ supplier.name }}</p>
                <p class="text-gray-600">{{ supplier.address }}</p>
                <p class="text-gray-600">Tax Number: {{ supplier.tin }}</p>
          </div>
          <div class="w-1/2 text-right">
                <h4 class="text-gray-600">{{ company.name }}</h4>
                <p class="text-gray-600"><b>Purchase Order Date:</b> {{ po.dateOfPo }}</p>
                <p class="text-gray-600"><b>Delivery Date:</b>{{ po.deliverDate }}</p>
                <p class="text-gray-600"><b>Purchase Order Number:</b>{{ po.poNumber}}</p>
                <p class="text-gray-600">{{ company.ourCompanyName }}</p>
                <p class="text-gray-600">{{ company.ourCompanyAddress }}</p>
                <p class="text-gray-600">{{ company.ourCompanyTin }}</p>
          </div>
        </div>

        <!-- Table Section -->
        <table class="w-full table-auto mb-6 border border-collapse text-nowrap">
          <thead>
            <tr class="bg-gray-200">
              <th class="border px-4 py-2 text-left">Description</th>
              <th class="border px-4 py-2 text-right">Quantity</th>
              <th class="border px-4 py-2 text-right">Unit Price</th>
              <th class="border px-4 py-2 text-right">Discount</th>
              <th class="border px-4 py-2 text-right">Amount PHP</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="items.length > 0" v-for="(i,ii) in items" :key="ii">
              <td class="border px-4 py-2">{{ i.itemName }}({{ i.unitAbbre }})</td>
              <td class="border px-4 py-2 text-right">{{i.quantity ?? 0 }}</td>
              <td class="border px-4 py-2 text-right">{{ i.price ?? 0 }}</td>
              <td class="border px-4 py-2 text-right">{{ i.discountAmount }}</td>
              <td class="border px-4 py-2 text-right">{{ i.total.toFixed(2) }}</td>
            </tr>
            <tr v-else>
              <td class="border px-4 py-2 text-center text-bold" colspan="5">No items available</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="border-0 px-4 py-2 text-right font-medium text-nowrap font-semibold text-gray-400" colspan="4">
                Subtotal (<i class="text-xs">Includes a discount of {{ totalDiscount }}</i>)
              </td>
              <td class="border-0 px-4 py-2 text-right">{{ subtotal }}</td>
            </tr>
            <tr>
              <td class="border-0 px-4 py-2 text-right font-normal" colspan="4">Total VAT 12%</td>
              <td class="border-0 px-4 py-2 text-right">{{ totalVAT }}</td>
            </tr>
            <tr>
              <td class="border-0 px-4 py-2 text-right font-bold" colspan="4">TOTAL PHP</td>
              <td class="border-0 px-4 py-2 text-right font-bold">{{ grandTotal }}</td>
            </tr>
          </tfoot>

        </table>
        <!-- Footer Section -->
        <div class="relative p-3">
          <p class="text-gray-800 mb-4"><b>Note:</b> {{ po.remarks }}</p>
          <p class="text-gray-800 mb-4"><b>Delivery Address:</b> {{ po.wareHouseAddress }}</p>
          <p class="text-gray-800"><b>Delivery Instructions:</b> {{ po.deliveryInstruction }}</p>
          <small class="text-gray-300 text-nowrap text-xs">Company Registration No. 224-546-644-000&nbsp;Registered Office: Villa Aurora, J. Abad Santos St., Cebu City, 6000, PHI</small>
          <div class="absolute top-0 right-0">
            <img :src="company.logoImage ? 'data:image/png;base64,'+company.logoImage : defaultImage" alt="Company Logo" height="120" style="padding: 20px;" width="120">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { VUE_APP_API_URL, DATE_NOW, COMPANIES, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  mrfStatusFormatter,
  moneyFormatter,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const defaultImage = ref('/default/image.jpg');
const props = defineProps({
  po_id: Number,
});
const content = ref(null);
const vat_percentage = ref(0.12);
const po = ref([]);
const items = ref([]);
const company = ref([]);
const supplier = ref([]);
const loading = ref(false);
const printPO = async() => {
  await getPODetails();
  printPDF();
};
const totalDiscount = computed(() => {
  // Calculate the total discount by summing up the discount amounts of all items
  return items.value.reduce((acc, item) => acc + parseFloat(item.discountAmount || 0), 0).toFixed(2);
});

const subtotal = computed(() => {
  // Subtotal is the sum of all item totals
  return items.value.reduce((acc, item) => acc + parseFloat(item.total || 0), 0).toFixed(2);
});

const totalVAT = computed(() => {
  // VAT is 12% of the subtotal
  return (parseFloat(subtotal.value) * vat_percentage.value).toFixed(2);
});

const grandTotal = computed(() => {
  // Grand total is subtotal + VAT
  return (parseFloat(subtotal.value) + parseFloat(totalVAT.value)).toFixed(2);
});

const getPODetails = async () => {
  try{
    const formData = FormDx({po_id: props.po_id});
    loading.value = true;
    const response = await axios.post(VUE_APP_API_URL+'pos/details',formData,BearToken(token));
    
    po.value = response.data.po;
    items.value = response.data.poItems;
    supplier.value = response.data.supplier;
    company.value = response.data.ourCompany;
    loading.value = false;
  }catch(error){
    loading.value = false;
    console.log(error);
  }
}
const printPDF = async() => {
  const printWindow = window.open('', '_blank');
  const contentHTML = content.value.innerHTML;
  printWindow.document.write(`
    <html>
      <head>
        <title>Print PO Slip</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: Arial, sans-serif;
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
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
          p {
            font-size: 8pt;
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
  // printWindow.document.close();
  // printWindow.print();
};
</script>

<style scoped>
.pdf-content {
  padding: 20px;
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
