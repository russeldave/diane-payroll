<template>
  <div v-if="!loadingDetails" class="p-0">
    <!-- <button @click.prevent="getOrderDetails" class="bg-red-500">Load data</button> -->
    <ParkCashierForm 
     :key="props.menu_park_id"
     :orderDetails="orderDetails"
     @transaction_id="handleTransaction"
     :menu_park_id="props.menu_park_id"
    />
  </div>
  <div v-else>
    <!-- Optional: Add a loading indicator -->
    <p class="text-center text-gray-500">Loading order details...</p>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import { handleApiError, Alert, FormDx, BearToken } from '@/views/Utility/Helper';
import { VUE_APP_API_URL, DEFAULT_BG } from '@/views/Utility/Global';
import ParkCashierForm from '@/views/Pages/Cashier/Modules/ParkCashierForm/Index.vue';

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  menu_park_id: Number,
  customer: Object,
});

const updateKey = ref(0);
const orderDetails = ref(0);
const clientForm  = ref([]);
const loadingDetails = ref(true); // Add loading state

onMounted(() => {
  getOrderDetails();
});

const getOrderDetails = async () => {
  loadingDetails.value = true; // Set loading to true
  try {
    const formData = FormDx({order_id: props.menu_park_id});
    const response = await axios.post(
      `${VUE_APP_API_URL}menu-sales/get-park-items`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close(); // Make sure this is appropriate here or moved if it's from a parent trigger

    if (response.data) {
      orderDetails.value = response.data.order ?? [];
    }
  } catch (error) {
    console.log(error);
    // Close processing alert on error
    Swal.close(); // Make sure this is appropriate here or moved if it's from a parent trigger
    handleApiError(error);
  } finally {
    loadingDetails.value = false; // Set loading to false when done (success or error)
  }
};

const handleTransaction = (data) => {
  emits('transaction_id', data);
}
</script>