<template>
  <div
    @click.prevent="showOrderData()"
    :class="DEFAULT_BG"
    class="flex flex-col shadow-[4px_4px_0_rgba(0,0,0,0.25)] items-center border-2 border-amber-100 relative justify-center text-white font-semibold shadow-l-2 hover:bg-cyan-800 text-wrap text-center w-24 h-24 rounded-full shadow-lg p-4 cursor-pointer"
  >
    <p class="capitalize text-xs md:text-base">{{ customer.name }}</p>
    <span
      class="absolute -top-1 border-2 border-amber-100 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
    >
      {{ customer.parkCount }}
    </span>
  </div>
  <Modal
    :show="isViewModalOpen"
    :maxWidth="'6xl'"
    :title="`${customer.name.toUpperCase()}'s ORDER`"
    @close="isViewModalOpen = false"
  >
    <div v-if="loading" class="p-4">
      <Loader />
    </div>
    <div class="p-4 overflow-x-auto" v-else>
        <!-- <div class="mb-4">
            <input
                type="search"
                v-model="search.search"
                @input="searchInput"
                placeholder="Search orders..."
                class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div> -->
        <div class="flex w-full overflow-auto py-4">
            <div class="flex w-full justify-between">
                <h1 class="text-lg font-bold text-gray-700">Orders</h1>
            </div>
        </div>
        <div class="flex w-full overflow-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead :class="DEFAULT_BG">
                <tr class="text-nowrap">
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Order ID
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Order Date
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Table
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Total
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Discount
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Grand Total
                    </th>
                    <!-- <th class="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Status
                    </th> -->
                    <th class="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                    </th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in data.customerParks" class="hover:bg-gray-200" v-if="data.customerParks?.length > 0 && !loading"  :key="order.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.dateOfPark }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">{{ order.name === 'null' ? 'No Name' : order.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{{ order.grandTotal ?? 0 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span v-if="order.discountId > 0" class="bg-yellow-400 text-black text-xs font-semibold p-1 rounded">
                        {{ order.discountAbbre }} Discount Applied Less:{{ order.less }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{{ order.grandFinalTotal?.toFixed(2) ?? 0 }}</td>
                    <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        <span class="text-sm text-yellow-500 font-semibold bg-yellow-100 px-2 py-1 rounded-full">
                            Pending
                        </span>
                    </td> -->
                    <td class="px-6 py-4 space-x-2 whitespace-nowrap text-sm text-center text-gray-900">
                      <CollectPayment
                          v-if="hasPermission('Collect_Payment_Button')"
                          :menu_park_id="order.id"
                          :customer="order"
                          :key="order.id"
                          @transaction_id="handleTransaction"
                        />
                        <DeleteCollection
                        v-if="hasPermission('Delete_Collection_Button')"
                        :key="order.id" 
                        :data="order"
                        @transaction_id="handleTransaction" />
                    </td>
                </tr>
                <tr v-if="data.customerParks?.length == 0 && !loading" class="text-center">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colspan="5">No orders found for this customer.</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="flex w-full overflow-auto">
            <Paginator v-if="data.totalrows" :page_number="search.page_num" :total_rows="data.totalrows" :itemsperpage="search.itemsperpage" @page_num="handlePagination"/>
        </div>
    </div>
  </Modal>
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
import DeleteCollection from './DeleteCollection.vue';
import { hasPermission } from '@/views/Utility/Permissions';

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  customer: Object,
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

const searchInput =  useDebounce(async () => {
  search.value.page_num = 1;
  await getCustomerOrders();
  handlePagination(1);
},500);
const getCustomerOrders = async () => {
  try {
    loading.value = true;
    search.value.customer_id = props.customer.id;

    const formData = FormDx(search.value);
    const response = await axios.post(`${VUE_APP_API_URL}menu-sales/get-customer-parks`,formData,BearToken(token));
    if(response.data.customerParks?.length > 0){
      data.value = response.data;
    }else{
        isViewModalOpen.value = false;
        emits('transaction_id',Math.random());
    }
   
    loading.value = false;
  } catch (error) {
    loading.value = false;
    handleApiError(error);
  }
};
const handlePagination = (page_num) => {
  console.log(page_num);
  search.value.page_num = page_num ?? 1;
  getCustomerOrders();
};
const handleTransaction = (transaction_id) => {
  getCustomerOrders();
  emits('transaction_id',Math.random()+'transactions-done');
};
const showOrderData = async () => {
    isViewModalOpen.value = true;
    await getCustomerOrders();
    console.log('showOrderData');
}

</script>