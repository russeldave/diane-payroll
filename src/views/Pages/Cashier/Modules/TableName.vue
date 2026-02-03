<template>
  <div
    :class="table.isUsed ? 'bg-red-500 hover:bg-red-600' : DEFAULT_BG"
    class="flex flex-col items-center relative justify-center text-white text-wrap text-center w-24 h-24 rounded shadow-lg p-4 cursor-pointer"
  >
    <p class="capitalize text-xs md:text-base uppercase">{{ table.name }}</p>
    <p class="capitalize text-md md:text-md uppercase" v-if="table.isUsed"> 
      {{ table?.customerDetails?.customerName }}
    </p>
    <p class="text-gray-200" v-if="table.isUsed"> {{ table?.orderId ?? '-' }} </p>
    <!-- <span
      class="absolute -top-1 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
    >
      {{ customer.parkCount }}
    </span> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { moneyFormatter, BearToken, FormDx, useDebounce, handleApiError } from "@/views/Utility/Helper.js";
import { DEFAULT_BG, VUE_APP_API_URL } from "@/views/Utility/Global.js";
import Loader from "@/views/Component/Loader.vue";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";

import CollectPayment from './CollectPayment.vue';

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  table: Object,
});
const token = localStorage.getItem('token');
const isViewModalOpen = ref(false);
const data = ref([]);
const loading = ref(false);

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  customer_id: 0,
});
</script>