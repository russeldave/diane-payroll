<template>
  <button
    @click.prevent="receiveItemBehavior()"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-eye"></i>
    View
  </button>
  <Modal
    :show="isReceiveItemModalOpen"
    :maxWidth="'xl'"
    title="Direct Receive Item Details"
    @close="isReceiveItemModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-0" @submit.prevent="directReceiveItem()">
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="ProductName"
            disabled
            v-model="receiveForm.item_name"
            required
            placeholder="Item Name"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Supplier</label
          >
          <div class="flex items-center mt-1">
            <input
              type="text"
              id="ProductName"
              v-model="receiveForm.supplier_name"
              placeholder="Input Supplier Name"
              autocomplete="off"
              disabled
              class="p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Invoice No.</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="ProductName"
            v-model="receiveForm.invoice_number"
            placeholder="Input Invoice No."
            autocomplete="off"
            disabled
            class="p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Serial No.</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="SerialName"
            v-model="receiveForm.serial_number"
            placeholder="Input Serial No."
            autocomplete="off"
            disabled
            class="p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Model No.</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="ModelName"
            v-model="receiveForm.model_number"
            placeholder="Input Model No."
            autocomplete="off"
            disabled
            class="p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Purchase Order No.</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="ProductName"
            v-model="receiveForm.po_number"
            autocomplete="off"
            placeholder="Input Purchase Order No."
            disabled
            class="p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Receiving Warehouse</label
          >
          <select
            placeholder="Select Building Name"
            disabled
            class="p-2 border rounded-md w-full bg-gray-200"
            required
            v-model="receiveForm.warehouse_id"
          >
            <option value="0">--Select Warehouse--</option>
            <option v-for="(w, ww) in warehouse" :key="w.id" :value="w.warehouseId">
              {{ w.warehouseName }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Price per Item</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="number"
            id="ProductName"
            required
            v-model="receiveForm.price"
            autocomplete="off"
            placeholder="Input Price"
            disabled
            class="p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Received Quantity</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="number"
            id="ProductName"
            v-model="receiveForm.received_quantity"
            min="0"
            placeholder="Input Reference No."
            required
            autocomplete="off"
            disabled
            class="p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="receiveForm.remarks"
            placeholder="Input Remarks"
            disabled
            class="p-2 border rounded-md w-full bg-gray-200"
          ></textarea>
        </div>
        <div class="mb-4 col-span-2">
          <label for="itemImages" class="block text-sm font-medium text-gray-700"
            >Proof</label
          >
          <div class="flex justify-start mt-4">
            <DirectReceiveProof :key="receiveForm.item_id" :data="props.data" />
          </div>
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
  handleApiError,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

import DirectReceiveProof from "./DirectReceiveProof.vue";

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
});
const imageFiles = ref([]);
const isReceiveItemModalOpen = ref(false);
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const receiveForm = ref({
  supplier_id: 0,
  item_id: 0,
  received_quantity: 0,
  invoice_number: "",
  po_number: "",
  price: 0,
  warehouse_id: 0,
});

const receiveItemBehavior = async () => {
  const data = props.data;
  resetForm();

  receiveForm.value = {
    item_id: data.itemId,
    item_name: data.itemName,
    item_sku: data.itemSku,
    supplier_id: data.supplierId,
    supplier_name: data.supplierName,
    invoice_number: data.invoiceNumber,
    serial_number: data.serialNumber,
    model_number: data.modelNumber,
    po_number: data.poNumber,
    price: data.price,
    received_quantity: parseFloat(data.quantity),
    warehouse_id: data.warehouseId,
    remarks: "", // if any
  };

  isReceiveItemModalOpen.value = true;
};

const handleImageUpload = (event) => {
  imageFiles.value = Array.from(event.target.files);
};

const fillSupplierForm = (item) => {
  receiveForm.value.supplier_id = item.id;
  receiveForm.value.supplier_name = item.name + " / " + item.supplierNumber;

  searchSupplier.value.search = "";
};
//warehouse dropdown
const resetForm = () => {
  receiveForm.value = {
    date_now: DATE_NOW(),
    item_id: 0,
    received_quantity: 0,
    invoice_number: "",
    po_number: "",
    price: 0,
    warehouse_id: 0,
  };
  // emits("transaction_id", Math.random());
};
const directReceiveItem = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(receiveForm.value);
    imageFiles.value.forEach((file) => {
      formData.append("item_images[]", file); // Using array notation for multiple files
    });
    const response = await axios.post(
      `${VUE_APP_API_URL}direct-receiveds/received-item`,
      formData,
      BearToken(token)
    );

    Swal.close();
    isReceiveItemModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error); //
  }
};
</script>
