<template>
  <div class="p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6" v-if="customers?.length > 0 && !loading">
      <div
        v-for="customer in customers"
        :key="customer.id"
      >
        <CustomerOrderList :customer="customer" @transaction_id="handleTransaction" />
      </div>
    </div>
    <div v-if="!loading && customers?.length == 0" class="flex items-center justify-center">
        <p class="text-gray-500">No active customers found.</p>
    </div>
    <div v-if="loading" class="flex items-center justify-center">
        <Loader />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { moneyFormatter, BearToken, FormDx, useDebounce, handleApiError } from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Loader from "@/views/Component/Loader.vue";

import CustomerOrderList from './CustomerOrderList.vue';

const token = localStorage.getItem('token');
const customers = ref([]);
const loading = ref(false);
const getCustomerWithOrders = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`${VUE_APP_API_URL}menu-sales/get-customers-has-park`,BearToken(token));
    customers.value = response.data.customers ?? [];
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
}

const handleTransaction = (transaction_id) => {
  console.log(transaction_id);
  getCustomerWithOrders();
}
onMounted(() => {
  // Dummy data for active customers. Replace with an API call as needed.
  getCustomerWithOrders();
});
</script>