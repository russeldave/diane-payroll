<template>
  <button
    @click.prevent="deviceWarehouseBehavior()"
    type="button"
    class="font-bold text-2xl border border-2 border-blue-300 bg-blue-200 rounded-md p-2"
    >
    <i class="fa-duotone fa-solid fa-warehouse"></i>
    {{ warehouse_name}}
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isDeviceWarehouseModalOpen"
    :maxWidth="'md'"
    title="Set the Device Warehouse"
    @close="isDeviceWarehouseModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="setDeviceWarehouse()" autocomplete="off">
        <div class="grid grid-cols-1 gap-6">
          <select
            v-model="deviceWarehouseForm.new_device_warehouse_id"
            class="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 bg-white"
          >
            <option value="0">--Select Warehouse--</option>
            <option
              v-for="warehouse in warehouses"
              :key="warehouse.value"
              :value="warehouse.value"
            >
              {{ warehouse.label }}
            </option>
          </select>

          <div class="mb-4">
            <label for="ProductName" class="block text-sm font-medium text-gray-700"
              >User Barcode</label
            >
            <input
              type="text"
              id="ProductName"
              required
              v-model="deviceWarehouseForm.user_barcode"
              placeholder="Input Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
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
import { VUE_APP_API_URL, UNITS } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";
const emits = defineEmits(["transaction_id", "warehouse-changed"]);
const token = localStorage.getItem("token");
const warehouses = ref([]);
const loadingWarehouses = ref(false);
const props = defineProps({
  warehouse_name: String,
  // warehouses: Object
});
const isDeviceWarehouseModalOpen = ref(false);

const deviceWarehouseForm = ref({
  user_barcode: "",
  new_device_warehouse_id: 0,
});

const deviceWarehouseBehavior = () => {
  getWarehouses();
  resetForm();
  // unitsDropdown();
  isDeviceWarehouseModalOpen.value = true;
};

const resetForm = () => {
  deviceWarehouseForm.value.category_name = "";
};

const setDeviceWarehouse = async () => {
  if(deviceWarehouseForm.value.new_device_warehouse_id == 0){
    Alert("warning", "warning", "warehouse are required");
    return;
  }
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we change warehouse.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(deviceWarehouseForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}pub-stock-set-device-warehouse-id`,
      formData
    );
    // Close processing alert
    Swal.close();

    if(!response.data.error){
      localStorage.setItem('device_warehouse_id', deviceWarehouseForm.value.new_device_warehouse_id);
    }

    isDeviceWarehouseModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
    emits('warehouse-changed', deviceWarehouseForm.value.new_device_warehouse_id)
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

// Fetch warehouses
const getWarehouses = async () => {
  try {
    loadingWarehouses.value = true
    warehouses.value = []
    const response = await axios.post(
      `${VUE_APP_API_URL}pub-stock-warehouses-dropdown`,{}
    )
    warehouses.value = response.data.warehouses || []
    
    // Check if there's a device warehouse in localStorage
    // if (deviceWarehouseId) {
    //   console.log(deviceWarehouseId);
      
    //   const deviceWarehouse = warehouses.value.find(w => w.value == deviceWarehouseId)
    //   if (deviceWarehouse) {
    //     selectedWarehouse.value = deviceWarehouseId
    //     emit('update:selectedWarehouse', deviceWarehouseId)
    //   }
    // }
    
    loadingWarehouses.value = false
  } catch (error) {
    console.error("Error fetching warehouses:", error)
    loadingWarehouses.value = false
    Alert("error", "Error", "Failed to load warehouses")
  }
}
</script>
