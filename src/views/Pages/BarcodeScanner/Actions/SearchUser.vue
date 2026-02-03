<template>
  <button
    @click.prevent="searchuserBehavior()"
    class="flex items-center justify-center px-5 text-white bg-blue-500 border-2 border-r-0 border-blue-200 rounded-l-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
    title="Search User (optional)"
  >
    <!-- Optional icon or text -->
    <i class="fa-solid fa-users"></i>
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isDeviceWarehouseModalOpen"
    :maxWidth="'md'"
    title="Set the Device Warehouse"
    @close="isDeviceWarehouseModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="setSearchUser()" autocomplete="off">
        <div class="flex items-center mt-1">
          <SearchDropdown
            apiEndpoint="pub-employee-list"
            :searchModel="searchUser"
            placeholder="Search Employee"
            class="searchUser"
            itemLabel="name"
            itemId="id"
            inputId="employeeName"
            @item-selected="(data) => fillUserForm(data)"
            dataKey="employees"
            returnName="['firstName','middleName','lastName']"
          />
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
import SearchDropdown from "@/views/Component/SearchDropdownNoToken.vue";

const emits = defineEmits(["transaction_id", "warehouse-changed", "user-barcode"]);
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

const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const searchuserBehavior = () => {
  getWarehouses();
  resetForm();
  isDeviceWarehouseModalOpen.value = true;
};

const resetForm = () => {
  deviceWarehouseForm.value.category_name = "";
  searchUser.value.search = "";
};

const setSearchUser = () => {
  // Close the modal after emitting
  isDeviceWarehouseModalOpen.value = false;
  
  // Clear search after submit
  searchUser.value.search = "";
};

const fillUserForm = (user) => {
  // Emit the user barcode
  // Assuming the employee data has a barcode field
  // If not, you might need to adjust the field name
  if (user.barCodeToken) {
    const barcode = user.barCodeToken;
    emits("user-barcode", barcode);
    
    // You can also store it in your form if needed
    deviceWarehouseForm.value.user_barcode = barcode;
  } else {
    // If no barcode field exists, you could use employee ID or other identifier
    // Or show an error
    console.warn("No barcode found for selected employee");
    Alert("error", "Error", "No barcode found for selected employee");
  }
  
  // Optionally auto-close modal or submit
  setSearchUser();
};

// Fetch warehouses - you'll need to implement this
const getWarehouses = async () => {
  // Your implementation to fetch warehouses
  loadingWarehouses.value = true;
  try {
    // const response = await axios.get(...)
    // warehouses.value = response.data;
  } catch (error) {
    handleApiError(error);
  } finally {
    loadingWarehouses.value = false;
  }
};

// On mounted if needed
onMounted(() => {
  // Initialize if needed
});
</script>