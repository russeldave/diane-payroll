<template>
  <div v-if="loading" class="flex justify-center items-center py-12">
    <Loader />
  </div>
  <div
    v-else-if="invoice && invoice.salesMother && invoice.salesMother.length"
    class="space-y-4"
  >
    <!-- Receipt Header -->
    <div class="flex flex-col sm:flex-row justify-between text-base border-b pb-4">
      <div class="space-y-2 mb-4 sm:mb-0">
        <h2 class="font-semibold text-2xl">Receipt</h2>
        <p>
          <strong class="capitalize">Sales No.: </strong>
          {{ invoice.salesMother[0].salesNumber ?? "-" }}
        </p>
        <p class="uppercase">
          <strong class="capitalize">SI No.: </strong>
          {{ invoice.salesMother[0].siNumber ?? "-" }}
        </p>
        <p>
          <strong class="capitalize">Date: </strong>
          {{ invoice.salesMother[0].dateOfSales }}
        </p>
      </div>
      <div class="text-left sm:text-right space-y-2">
        <h2 class="font-semibold text-2xl font-bold text-green-300">
          # {{ invoice.salesMother[0].salesNumber }}
        </h2>
        <p class="uppercase text-base">
          <strong class="capitalize">Cashier:</strong>
          {{ invoice.salesMother[0].cashierUserName }}
        </p>
        <p class="uppercase text-base">
          <strong class="capitalize">Customer:</strong>
          {{ invoice.salesMother[0].customerName || "Walk-in" }}
        </p>
        <p class="uppercase text-base">
          <strong class="capitalize">Captain's Pad No.:</strong>
          {{ invoice.salesMother[0].cpNumber || "-" }}
        </p>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="border-b pb-4">
      <h3 class="font-semibold text-lg mb-2">Menu Items</h3>
      <div v-if="loading" class="flex justify-center items-center py-4">
        <Loader />
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="text-left p-2">Menu Name</th>
            <th class="text-right p-2">Quantity</th>
            <th class="text-right p-2">Unit Price</th>
            <th class="text-right p-2">Total</th>
            <th class="text-center p-2">Discount</th>
            <th class="text-center p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(menu, index) in invoice.sales" :key="index" class="border-b">
            <td class="p-2 text-base">{{ menu.menuName }}</td>
            <td class="p-2 text-right text-base">{{ menu.quantity }}</td>
            <td class="p-2 text-right text-base">
              {{ moneyFormatter(menu.retailPrice) }}
            </td>
            <td class="p-2 text-right text-base">{{ moneyFormatter(menu.subTotal) }}</td>
            <td class="p-2 text-center">
              <span
                v-if="menu.salesItemDiscountAbbre"
                class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded"
              >
                {{ menu.salesItemDiscountAbbre }}
                <span v-if="menu.less">Less:{{ menu.less }}</span>
              </span>
            </td>
            <td class="p-2 text-center">
              <div class="flex justify-center">
                <VoidOrderItem :key="menu.id" :data="menu" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment Details -->
    <!-- If you have payments array in your API, use it here. Otherwise, you can remove this block or adjust as needed. -->
    <!-- <div class="border-b pb-4">
      <h3 class="font-semibold text-lg mb-2">Payment Details</h3>
      <div v-if="loading" class="flex justify-center items-center py-4">
        <Loader />
      </div>
      <table class="w-full text-sm">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="text-left p-2">Payment Type</th>
            <th class="text-right p-2">Amount Paid</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in invoice.payments" :key="index" class="border-b">
            <td class="p-2 text-base">{{ payment.paymentMethodName }}</td>
            <td class="p-2 text-right text-base">{{ moneyFormatter(payment.amount) }}</td>
          </tr>
        </tbody>
      </table>
    </div> -->

    <div class="flex justify-between text-left">
      <!-- Payment Info -->
      <div class="space-x-2 text-base">
        <!-- <span><strong>Payment Type:</strong></span> -->
        <div class="flex flex-col space-y-2">
          <span
            v-for="(payment, index) in invoice.payments"
            :key="index"
            class="flex column bg-yellow-200 text-black text-xs font-semibold p-1 rounded"
          >
            {{ payment.paymentMethodName }} {{ moneyFormatter(payment.amount) }}
          </span>
        </div>
      </div>

      <!-- Totals -->
      <div class="space-y-2">
        <div class="text-right space-x-3 text-base">
          <span><strong>Sub Total:</strong></span>
          <span>{{ moneyFormatter(invoice.salesMother[0].subTotal) }}</span>
        </div>
        <div v-if="invoice.salesMother[0].motherDiscountAbbre">
          <span
            class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded text-right"
          >
            {{ invoice.salesMother[0].motherDiscountAbbre }} Discount Less:
            {{ moneyFormatter(invoice.salesMother[0].motherDiscountValue) }}
          </span>
        </div>
        <div class="space-x-3 text-xl font-bold text-right">
          <span>Service Fee:</span>
          <span class="text-green-600">{{
            moneyFormatter(invoice.salesMother[0].serviceFee)
          }}</span>
        </div>
        <div class="space-x-3 text-xl font-bold text-right">
          <span>Grand Total:</span>
          <span class="text-green-600">{{
            moneyFormatter(invoice.salesMother[0].grandTotal)
          }}</span>
        </div>
      </div>
    </div>

    <!-- Totals -->
    <!-- <div class="space-y-2 text-right"> -->
    <!-- <div class="flex justify-end space-x-3 text-base">
        <span><strong>Sub Total:</strong></span>
        <span>{{ moneyFormatter(invoice.salesMother[0].subTotal) }}</span>
      </div> -->
    <!-- <div class="flex justify-end">
        <span
          v-if="invoice.salesMother[0].motherDiscountAbbre"
          class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded"
        >
          {{ invoice.salesMother[0].motherDiscountAbbre }} Discount Less:{{
            invoice.salesMother[0].motherDiscountValue
          }}
        </span>
      </div> -->
    <!-- <div class="flex justify-end space-x-3 text-xl font-bold">
        <span>Service Fee:</span>
        <span class="text-green-600">{{
          moneyFormatter(invoice.salesMother[0].serviceFee)
        }}</span>
      </div> -->
    <!-- <div class="flex justify-end space-x-3 text-xl font-bold">
        <span>Grand Total:</span>
        <span class="text-green-600">{{
          moneyFormatter(invoice.salesMother[0].grandTotal)
        }}</span>
      </div> -->
    <!-- </div> -->
  </div>
  <div v-else class="text-center text-gray-500 py-8">Select a sale to view details</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Loader from "@/views/Component/Loader.vue";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  moneyFormatter,
  handleApiError,
} from "@/views/Utility/Helper";
import { hasPermission } from "@/views/Utility/Permissions";

import VoidOrderItem from "./VoidOrderItem.vue";
const props = defineProps({
  data: Object,
});

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const invoice = ref(null);
const loading = ref(false);

const getInvoiceData = async () => {
  if (!props.data) return;
  loading.value = true;
  try {
    const formData = FormDx({ transaction_id: props.data.id });
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/transaction-details`,
      formData,
      BearToken(token)
    );
    invoice.value = response.data;
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getInvoiceData();
});
</script>
