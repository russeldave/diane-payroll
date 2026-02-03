<template>
  <button
    @click.prevent="returnTransferredItemBehavior()"
    class="bg-gray-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-history"></i>
    Return
  </button>
  <Modal :show="isTransferModalOpen" :maxWidth="'xl'" title="Return Transferred Item" @close="isTransferModalOpen = false">
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="returnTransferredItem()">
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >MRF Reference No.</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="ProductName"
            disabled
            v-model="transferForm.mrf_reference_number"
            placeholder="Input Reference No."
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >MRF Manual No.</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="text"
            id="ProductName"
            disabled
            v-model="transferForm.mrf_manual_number"
            placeholder="Input Reference No."
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Returned to Warehouse</label
          >
          <select
            placeholder="Select Building Name"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            v-model="transferForm.to_warehouse_id"
          >
            <option value="0">--Select Warehouse to Return--</option>
            <option v-for="(w, ww) in warehouse" :key="w.id" :value="w.warehouseId">
              {{ w.warehouseName }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Released Quantity</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="number"
            id="ProductName"
            disabled
            v-model="transferForm.released_quantity"
            placeholder="Released Quantity"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Returned Quantity</label
          >
          <!-- building_id,contact_info,address,geo_map,remarks. -->
          <input
            type="number"
            id="ProductName"
            v-model="transferForm.returned_quantity"
            placeholder="Input Reference No."
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            v-model="transferForm.remarks"
            placeholder="Input Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="transferForm.returned_quantity <= 0 || transferForm.returned_quantity > transferForm.released_quantity"
            :class="transferForm.returned_quantity <= 0 || transferForm.returned_quantity > transferForm.released_quantity ? 'opacity-50' : ''"
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


const token = localStorage.getItem("token");
//emits
const emits = defineEmits(["transaction_id"]);
// Define props with a default value
const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
});
const isTransferModalOpen = ref(false);
const warehouse = JSON.parse(localStorage.getItem("warehouses"));
const transferForm = ref({
  mrf_item_id: 0,
  date_now: DATE_NOW(),
  mrf_reference_number: "",
  mrf_manual_number: "",
  from_warehouse_id: 0,
  to_warehouse_id: 0,
  released_quantity: 0,
  returned_quantity: 0,
});

const returnTransferredItemBehavior = async () => {
  const data = props.data;

  resetForm();
  transferForm.value.mrf_item_id = data.id; // id sa mrf item yayayahahah
  transferForm.value.mrf_reference_number = data.mrfNumber;
  transferForm.value.mrf_manual_number = data.mrfManualNumber;
  transferForm.value.released_quantity = data.releasedQuantity ?? 0;
  transferForm.value.to_warehouse_id = data.toWarehouseId ?? 0;
  isTransferModalOpen.value = true;
};

//warehouse dropdown
const resetForm = () => {
  transferForm.value = {
    mrf_id: 0,
    date_now: DATE_NOW(),
    mrf_reference_number: "",
    mrf_manual_number: "",
    from_warehouse_id: 0,
    to_warehouse_id: 0,
    released_quantity: 0,
    returned_quantity: 0,
  };
  // emits("transaction_id", Math.random());
};
const returnTransferredItem = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = FormDx(transferForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}warehouse-item-in/mrf-items-transfer-return-float`,
      formData,
      BearToken(token)
    );

    // Close the processing dialog
    Swal.close();
    isTransferModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);//
  }
};
</script>
