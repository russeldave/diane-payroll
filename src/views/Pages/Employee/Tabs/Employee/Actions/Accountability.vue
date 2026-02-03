<template>
    <button
      @click.prevent="accountabilityBehavior()"
      class="bg-red-500 text-white hover:opacity-70 focus:bg-red-300 font-bold rounded text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
    >
      <i class="fa fa-toolbox"></i>
      Accountability
    </button>
   <!-- Add Item Modal -->
   <Modal :show="isEditModalOpen" :maxWidth="'6xl'" title="View Item Accountability" @close="isEditModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="Md:col-span-2">
                <label
                  for="LeagueName"
                  class="block text-sm font-medium text-gray-700"
                  >Employee</label
                >
                <input
                  type="text"
                  id="ProductName"
                  v-model="locationForm.employee_name"
                  placeholder="Input Product Name"
                  disabled
                  class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                />
              </div>
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
                  class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                />
              </div>
              <div class="mb-4">
                <label
                  for="LeagueName"
                  class="block text-sm font-medium text-gray-700"
                  >Position</label
                >
                <input
                  type="text"
                  id="ProductName"
                  v-model="locationForm.position"
                  placeholder="Input Product Name"
                  disabled
                  class="mt-1 p-2 border rounded-md w-full bg-gray-200"
                />
              </div>
        </div>
        <div class="flex justify-end gap-6">
          <AddAccountability :key="updateKey" @transaction="handleTransaction" :data="locationForm" />
        </div>
        <div class="rounded-lg dark:border-gray-700">
          <ViewAccountableItems :key="updateKey"  :data="locationForm" />
        </div>
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

  import ViewAccountableItems from './ViewAccountableItems.vue';
  import AddAccountability from './AddAccountability.vue';
  const token = localStorage.getItem("token");
  const emits = defineEmits(["transaction_id"]);
  const isEditModalOpen = ref(false);
  const updateKey = ref(0);
  const data = ref([]);
  const props = defineProps({
    data: Object,
  });
  const search = ref({
    location_sku: 0,
    search: '',
    itemsperpage: 10,
    page_num: 1,
  });
  const locationForm = ref({
    sku: 0,
    warehouse_name: '',
    building_name: '',
  });
  // Activate a tab
  const accountabilityBehavior = () => {
    isEditModalOpen.value = true;
    const locs = props.data;

    locationForm.value.employee_id = locs.id ?? 0;
    locationForm.value.location_sku = locs.employeeNumber;
    locationForm.value.employee_name = locs.firstName+' '+locs.middleName+' '+locs.lastName;
    locationForm.value.position = locs.employeePositionName;
    search.value.location_sku = locs.employeeNumber;

  };
  const handleTransaction = (id) => {
    updateKey.value = Math.random();
  };
  </script>
  