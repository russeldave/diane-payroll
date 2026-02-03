<template>
  <button
    @click.prevent="editBehavior()"
    type="button"
    :class="[
      'bg-yellow-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap',
      className,
    ]"
  >
    <i class="fas fa-edit"></i>
    Edit
  </button>

  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'2xl'"
    title="Edit Receiving"
    @close="closeMarination()"
  >
    <div class="grid grid-cols-1 gap-6 p-4">
      <form class="" @submit.prevent="editReceiving()" autocomplete="off">
        <div class="mb-4">
          <label for="ProductName" class="block text-sm font-medium"
            >Date Received:</label
          >
          <input
            type="text"
            id="ProductName"
            required
            min="0"
            v-model="receivingForm.date_of_received"
            placeholder="Input Stock Limit"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200 cursor-not-allowed"
          />
        </div>
        <div class="mb-4">
          <label for="ProductName" class="block text-sm font-medium"
            >Ingredient Name:</label
          >
          <input
            type="text"
            id="ProductName"
            required
            min="0"
            v-model="receivingForm.ingredient_name"
            placeholder="Input Stock Limit"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200 cursor-not-allowed"
          />
        </div>
        <div class="mb-4">
          <label for="ProductName" class="block text-sm font-medium">Quantity:</label>
          <input
            type="number"
            id="ProductName"
            required
            v-model="receivingForm.quantity"
            placeholder="Input Stock Limit"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200 cursor-not-allowed"
          />
        </div>
        <div class="mb-4">
          <label for="ProductName" class="block text-sm font-medium"
            >Adjusted Quantity</label
          >
          <input
            type="number"
            id="ProductName"
            required
            v-model="receivingForm.adjusted_quantity"
            placeholder="Input Adjusted Quantity"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="referenceNumber" class="block text-sm font-medium">Reference Number:</label>
          <input
            type="text"
            id="referenceNumber"
            v-model="receivingForm.reference_number"
            placeholder="Input Reference Number"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="remarks" class="block text-sm font-medium">Remarks:</label>
          <textarea
            id="remarks"
            v-model="receivingForm.remarks"
            placeholder="Input Remarks"
            rows="3"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="md:flex items-center justify-end hidden">
          <button
            type="submit"
            class="bg-green-500 text-white hover:bg-green-600 font-bold py-2 px-4 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { hasPermission } from "@/views/Utility/Permissions";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
import { VUE_APP_API_URL, UNITS, DEFAULT_BG } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
  className: String,
  data: Object,
});
const isAddModalOpen = ref(false);
const units = ref([]);
const imageFiles = ref([]);
const categories = ref([]);
const ingredients = ref([]);
const searchIngredient = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});
const receivingForm = ref({
  ingredient_receiving_id: 0,
  reference_number: "",
  remarks: "",
  quantity: 0,
  adjusted_quantity: 0,
});

const editBehavior = () => {
  resetForm();
  fillForm();
  isAddModalOpen.value = true;
};

const closeMarination = () => {
  emits("transaction_id", Math.random());
  isAddModalOpen.value = false;
};
const resetForm = () => {
  receivingForm.value.date_of_received = "";
  receivingForm.value.ingredient_name = "";
  receivingForm.value.ingredient_receiving_id = 0;
  receivingForm.value.reference_number = "";
  receivingForm.value.remarks = "";
  receivingForm.value.quantity = 0;
  receivingForm.value.adjusted_quantity = 0;
};
const fillForm = () => {
  const data = props.data;

  console.log(data);
  receivingForm.value.date_of_received = data.dateOfReceived;
  receivingForm.value.ingredient_name = data.ingredientName;
  receivingForm.value.ingredient_receiving_id = data.id;
  receivingForm.value.reference_number = data.invoiceNumber;
  receivingForm.value.remarks = data.remarks;
  receivingForm.value.quantity = data.quantity;
  receivingForm.value.adjusted_quantity = 0;
};

const handleTransaction = () => {
  getMealIngredients();
};

const editReceiving = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we update the receiving transaction.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(receivingForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}ingredient-receiving/edit`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const unitsDropdown = async () => {
  units.value = await UNITS();
};
</script>
