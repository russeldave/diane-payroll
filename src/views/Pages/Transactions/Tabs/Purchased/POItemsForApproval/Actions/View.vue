<template>
  <button
    @click="(isViewModalOpen = true), editMRFBehavior()"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-eye"></i>
    Item Details
  </button>
  <Modal :show="isViewModalOpen" :maxWidth="'2xl'" title="View Item Details" @close="isViewModalOpen = false">
    <div class="p-6">    
      <form class="mt-4" @submit.prevent="editMRF()">
        <div class="mb-4">
          <label
            for="po_number"
            class="block text-sm font-medium text-gray-700"
          >
            PO Number
          </label>
          <input
            type="text"
            id="po_number"
            v-model="poForm.po_number"
            disabled
            placeholder="Input PO Number"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        
        <div class="grid gap-6 mb-4">
          <label
            for="po_number"
            class="block text-sm font-medium text-gray-700"
          >
            Items:
          </label>
          <div
            v-for="(item, index) in poForm.items"
            :key="index"
            class="p-4 border border-gray-300 rounded-md shadow-sm bg-white"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h6 class="font-medium text-gray-700">Item Name</h6>
                <p class="text-gray-600">{{ item.item_name }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Brand</h6>
                <p class="text-gray-600">{{ item.brand_abbre ?? '-' }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Requested Quantity</h6>
                <p class="text-gray-600">{{ item.requested_quantity }} {{ item.unit_abbre }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Received Quantity</h6>
                <p class="text-gray-600">{{ item.quantity }} {{ item.unit_abbre }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Price</h6>
                <p class="text-gray-600">{{ item.price }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Qty per Unit</h6>
                <p class="text-gray-600">{{ item.quantity_per_unit }} {{ item.sub_unit_abbre }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Sub Price</h6>
                <p class="text-gray-600">{{ item.sub_price }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Sub Quantity Requested</h6>
                <p class="text-gray-600">{{ item.requested_sub_quantity }} {{ item.sub_unit_abbre }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Sub Quantity Received</h6>
                <p class="text-gray-600">{{ item.sub_quantity }} {{ item.sub_unit_abbre }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Discount</h6>
                <p class="text-gray-600">{{ item.discount }}</p>
              </div>
              <div>
                <h6 class="font-medium text-gray-700">Total Price</h6>
                <p class="text-gray-600">{{ item.total_price }}</p>
              </div>
              <div class="col-span-2">
                <h6 class="font-medium text-gray-700">Remarks</h6>
                <p class="text-gray-600">{{ item.remarks }}</p>
              </div>
            </div>
            <button
              v-if="item.item_id"
              @click.prevent="removeItemField(index)"
              type="button"
              class="bg-red-500 text-white rounded font-bold text-md md:text-lg py-2 px-4 mt-4 float-end text-nowrap"
            >
              <i class="fas fa-trash"></i>
              Delete
            </button>
          </div>
          <div v-if="poForm.items.length === 0">
            <p class="text-red-500 font-bold text-center">**No items found**</p>
          </div>
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
import { VUE_APP_API_URL, DATE_NOW, COMPANIES } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  mrfStatusFormatter,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const isViewModalOpen = ref(false);
//emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Array,
});
const poForm = ref({
    po_number: '',
    pr_number: '',
    items: [{
        item_name: '',
        brand_abbre: '',
        quantity: '',
        unit_abbre: '',
        quantity_per_unit: '',
        price: '',
        sub_price: '',
        sub_unit_abbre: '',
        sub_quantity: ''
    }],
});

const editMRFBehavior = () => {
  fillForm(props.data);
  isViewModalOpen.value = true;
};

const fillForm = () => {
  const data = props.data;
  console.log(data);
  poForm.value.po_number = data.poNumber;
  poForm.value.pr_number = data.prNumber;
  poForm.value.item_name = data.itemName;
  // Ensure the items array has at least one object
  if (poForm.value.items.length === 0) {
    poForm.value.items.push({});
  }
  
  // Assuming data.itemName and other fields are for the first item in the array
  poForm.value.items[0].item_name = data.itemName;
  poForm.value.items[0].brand_abbre = data.brandAbbre;
  poForm.value.items[0].quantity = data.quantity;
  poForm.value.items[0].unit_abbre = data.unitAbbre;
  poForm.value.items[0].quantity_per_unit = data.quantityPerUnit;
  poForm.value.items[0].price = data.price;
  poForm.value.items[0].sub_price = data.subPrice;
  poForm.value.items[0].sub_unit_abbre = data.subUnitAbbre;
  poForm.value.items[0].sub_quantity = data.subQuantity;
  poForm.value.items[0].discount = data.discountAmount;
  poForm.value.items[0].remarks = data.remarks;
  poForm.value.items[0].requested_quantity = data.prQuantity ?? 0;
  poForm.value.items[0].requested_sub_quantity = data.prSubQuantity ?? 0;
};


// const generateItemField = async () => {
//   let item_data = {
//     item_id: 0,
//     item_name: "",
//     quantity: 0,
//     description: "",
//     remarks: "",
//     room_location_number: 0,
//     /* other charge properties */
//   };

//   // Assuming salesForm.charges is an array
//   poForm.value.items.push(item_data);
// };
// const removeItemField = (index) => {
//   // form.charges.length <= 1 ? false : form.charges.splice(index, 1);
//   poForm.value.items.splice(index, 1);
// };
</script>
