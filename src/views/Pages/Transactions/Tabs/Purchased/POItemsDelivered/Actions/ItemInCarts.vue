<template>
    <button
      @click.prevent="isEditModalOpen = true, locationBehavior()"
      type="button"
      class="border border-l-0 hover:opacity-70 focus:bg-blue-300 rounded-r px-3 bg-blue-500 text-sm md:text-md text-white"
    >
      <i class="fas fa-eye"></i>
      View
    </button>
   <!-- Add Item Modal -->
   <Modal :show="isEditModalOpen" :maxWidth="'6xl'">

    <div class="flex justify-between p-4">
      <h2 class="text-lg font-semibold text-gray-800">View Items</h2>
      <button
      class="flex float-end bg-gray-100 p-3"
      @click.prevent="isEditModalOpen = false"
    >
      <i class="fa fa-times text-black-600"></i>
    </button>
    </div>
    <div class="grid grid-cols-1 gap-6 p-6">
   
      <form class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="mb-4">
                <label
                  for="LeagueName"
                  class="block text-sm font-medium text-gray-700"
                  > Location</label
                >
                <input
                  type="text"
                  id="ProductName"
                  v-model="locationForm.location_sku"
                  placeholder="Input Product Name"
                  disabled
                  class="mt-1 p-2 border uppercase rounded-md w-full bg-gray-200"
                />
              </div>
              <div class="mb-4">
                
              </div>
              <div class="mb-4">
               
              </div>
        </div> 
        <div class="flex w-full overflow-auto">
          <!-- Table to display products -->
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table headers -->
            <thead class="bg-yellow-900 text-white shadow">
              <tr class="border-b-2 border-solid border-yellow-500">
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-md font-medium  uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-md font-medium  uppercase tracking-wider"
                >
                  Stocks
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loop through products and display them -->
              <tr v-for="item in data.cartHasItems" v-if="data.cartHasItems?.length > 0" :key="item.id" :title="'Inputted By: '+ item.createdByUserName +'Inputted Date: '+item.dateCreated">
                <td class="px-2 py-2 border">{{ item.itemSku }} - {{ item.itemName }}</td>
                <td class="px-2 py-2 border text-right">{{ item.quantity }} /{{ item.unitAbbre }}</td>
              </tr>
              <tr v-else>
                <td
                  class="px-2 py-2 border text-center text-red-500 font-bold"
                  colspan="6"
                >
                  ***No Item Found***
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex w-full overflow-auto">
          <Paginator v-if="data.totalrows" :page_number="search.page_num" :total_rows="data.totalrows" :itemsperpage="search.itemsperpage" @page_num="handlePagination"/>
        </div>
        <!-- <div class="flex items-center justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div> -->
      </form>
    </div>
  </Modal>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import Swal from "sweetalert2";
  import axios from "axios";
  import Modal from "@/views/Component/Modal.vue";
  import Paginator from "@/views/Component/Pagination.vue";
  import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
  import { VUE_APP_API_URL, PERMISSION, BUILDING, CATEGORIES } from "@/views/Utility/Global";
  import {
    FormDx,
    BearToken,
    Alert,
    replaceUnderScore,
    handleApiError
  } from "@/views/Utility/Helper";
  
  const token = localStorage.getItem("token");
  const emits = defineEmits(["transaction_id"]);
  const isEditModalOpen = ref(false);
  const data = ref([]);
  const props = defineProps({
    data: Array,
  });
  const search = ref({
    cart_id: 0,
    search: '',
    itemsperpage: 10,
    page_num: 1,
  });
  const locationForm = ref({
    sku: 0,
    cart_id: 0,
    warehouse_name: '',
    building_name: '',
  });
  const locationBehavior = () => {
    const locs = props.data;

    console.log(locs);
    locationForm.value.cart_id = locs.cart_id;
    locationForm.value.location_sku = locs.sku;
    locationForm.value.warehouse_name = locs.name;
    locationForm.value.building_name = locs.buildingName;
    search.value.cart_id = locs.cart_id;

    listFixedAssets();
  };
  const listFixedAssets = async () => {
  try {
    data.value = [];
    const formData = FormDx(search.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}carts/get-items-per-cart-id`,
      formData,
      BearToken(token)
    );
    data.value = response.data;

    // setTimeout(async () => {
    //   //gidelay ni nako para masure nga naload tanan na data ok
    //   await generateBarcodesForItems(response.data.roomsWarehouses);
    // }, 500);
  } catch (error) {
    handleApiError(error);//
  }
};
  </script>
  