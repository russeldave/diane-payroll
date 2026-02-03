<template>
  <button
    @click.prevent="returnItemBehavior()"
    class="bg-green-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-rotate-left"></i>
    Return Item
  </button>
  <Modal :show="isReturnItemModalOpen" :maxWidth="'xl'" title="Return Item" @close="isReturnItemModalOpen = false">
    <div class="block">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6" @submit.prevent="returnItem()">
        <!-- Common: Item Name -->
        <div class="mb-4" :class="!props.hasMRFID ? 'md:col-span-2' : ''">
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            disabled
            v-model="returnItemForm.item_name"
            required
            placeholder="Item Name"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <!-- Common: Item Location -->
        
        <div class="mb-4" :class="!props.hasMRFID ? 'md:col-span-2' : ''">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Location</label
            >
            <div v-if="props.hasMRFID" class="flex items-center gap-2">
              <input
                type="text"
                disabled
                v-model="returnItemForm.location_name"
                required
                placeholder="Location Name"
                class="mt-1 p-2 border rounded-md w-full bg-gray-200"
              />
            </div>
            <SearchDropdown
                v-else
                apiEndpoint="mrfs/rooms-warehouses-list"
                :searchModel="searchLocation"
                placeholder="Search Location"
                itemLabel="name"
                itemId="id"
                inputId="locationName"
                @item-selected="(data) => fillLocationForm(data)"
                dataKey="roomsWarehouses"
                returnName="['completeName']"
              />
        </div>
        
        <div class="mb-4" v-if="props.hasMRFID">
          <label class="block text-sm font-medium text-gray-700">MRF No.</label>
          <input
            type="text"
            v-model="returnItemForm.mrf_number"
            disabled
            required
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
         <div class="mb-4" v-if="props.hasMRFID">
          <label class="block text-sm font-medium text-gray-700">MRF Date</label>
          <input
            type="text"
            v-model="returnItemForm.created_date"
            disabled
            required
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Date of Actual Return</label>
          <input
            type="date"
            v-model="returnItemForm.date_of_actual_returned"
            required
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
         <!-- Reason Selector -->
        <div class="mb-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Return Condition</label>
          <select v-model="returnItemForm.return_type_id" required class="mt-1 p-2 border rounded-md w-full">
            <option value="0">Brand New</option>
            <option value="1">Repaired</option>
            <option value="2">Scrap/Damage</option>
          </select>
        </div>
        <!-- Reason Selector -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Receiving Warehouse</label>
          <select class="mt-1 p-2 border rounded-md w-full" required v-model="returnItemForm.warehouse_id">
            <option value="0">--Select Warehouse--</option>
            <option v-for="(w, ww) in warehouse" :key="w.id" :value="w.warehouseId">
              {{ w.warehouseName }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-red-700">Return Quantity</label>
          <input
            type="number"
            v-model="returnItemForm.quantity"
            min="1"
            required
            placeholder="Input Quantity"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <!-- Checked By Employee -->
        <div class="mb-6 md:col-span-2">
            <label for="checked_by_employee_id" class="block text-sm font-medium text-gray-700">
                Returned By:
            </label>
            <SearchDropdown
                apiEndpoint="employees/list"
                :searchModel="searchEmployee"
                placeholder="Search Employee"
                itemLabel="name"
                itemId="id"
                inputId="checkerName"
                formatLabel="none"
                @item-selected="(data) => fillEmployeeForm(data)"
                dataKey="employees"
                returnName="['employeeCompleteName']"
            />
        </div>
        <div class="mb-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea v-model="returnItemForm.remarks" placeholder="Input Remarks" class="mt-1 p-2 border rounded-md w-full"></textarea>
        </div>
        <div class="mb-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Proof</label>
          <input type="file" @change="handleImageUpload" multiple class="mt-1 p-2 border rounded-md w-full" />
        </div>
        <!-- {{ returnItemForm }} -->
        <div class="flex justify-end md:col-span-2">
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
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import { VUE_APP_API_URL, DATE_NOW, WAREHOUSE, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  useDebounce,
  handleApiError
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
const searchSupplier = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
// Define props with a default value
const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
  warehouse_id: Number,
  hasMRFID: {
    type: Boolean,
    default: false,
  },
});
const imageFiles = ref([]);
const isReturnItemModalOpen = ref(false);
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const searchEmployee = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const searchLocation = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const returnItemForm = ref({
  return_type_id: 0, // <-- added
  supplier_id: 0,
  location_id: 0,
  location_name: '',
  location_sku: '',
  item_id: 0,
  item_name: '',
  item_sku: '',
  quantity: 0,
  warehouse_id: 0,
  mrf_item_id: 0,
  employee_id: 0,
  employee_name: '',
  remarks: "",
  date_of_actual_returned: '',
  mrf_number: '',
  created_date: '',
});

const returnItemBehavior = async () => {
  const data = props.data;
  const [mrfId, itemId] = props.hasMRFID ? [data.id, 0] : [0, data.id];
  resetForm();

  returnItemForm.value.mrf_item_id = mrfId;
  returnItemForm.value.item_id = itemId;
  returnItemForm.value.item_name = props.hasMRFID ? data.itemName : data.name;
  returnItemForm.value.item_sku = data.sku;
  returnItemForm.value.warehouse_id = props.warehouse_id ?? 0;

  returnItemForm.value.location_id = props.hasMRFID ? data.id : 0;
  returnItemForm.value.location_name = props.hasMRFID ? data.locationName : '';
  returnItemForm.value.location_sku = props.hasMRFID ? data.locationSku : '';
  returnItemForm.value.date_of_actual_returned = data.dateOfActualReturn || DATE_NOW().split(" ")[0];

  returnItemForm.value.created_date = data.dateOfmrf; // Default to "Brand New"
  returnItemForm.value.mrf_number = data.mrfNumber ?? '-'; // Default to "Brand New"
  isReturnItemModalOpen.value = true;
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const fillEmployeeForm = (item) => {
  returnItemForm.value.employee_id = item.id;
  returnItemForm.value.employee_name = item.employeeCompleteName;
  searchEmployee.value.search = "";
};

const fillLocationForm = (item) => {
  returnItemForm.value.location_id = item.id;
  returnItemForm.value.location_name = item.completeName;
  returnItemForm.value.location_sku = item.sku;
  searchLocation.value.search = "";
};

const resetForm = () => {
  returnItemForm.value = {
    return_type_id: 0, // <-- added
    supplier_id: 0,
    location_id: 0,
    location_name: '',
    location_sku: '',
    item_id: 0,
    item_name: '',
    item_sku: '',
    quantity: 0,
    warehouse_id: 0,
    employee_id: 0,
    employee_name: '',
    remarks: "",
    date_of_actual_returned: DATE_NOW().split(" ")[0],
    mrf_number: '',
    created_date: '',
    mrf_item_id: 0,

  };
};

const returnItem = async () => {
  try {
    // Show loading alert before request
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we process your returned items.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = FormDx(returnItemForm.value);
    imageFiles.value.forEach((file) => {
      formData.append("item_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}return-items/add`,
      formData,
      BearToken(token)
    );

    Swal.close(); // Close the loading alert

    isReturnItemModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close(); // Make sure to close if there's an error
    handleApiError(error);
  }
};

</script>
