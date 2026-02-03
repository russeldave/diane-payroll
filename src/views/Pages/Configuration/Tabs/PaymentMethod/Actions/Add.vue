<template>
  <button
    @click="isAddPaymentMethodModalOpen = true"
    class="bg-blue-500 text-white hover:opacity-70 w-full focus:bg-blue-300 font-bold rounded text-sm md:text-md py-2 px-4 rounded-r mb-4 float-end text-nowrap"
  >
    <i class="fas fa-credit-card"></i>
    Add Payment Method
  </button>
  <!-- Add Role Modal -->
  <Modal
    :show="isAddPaymentMethodModalOpen"
    :maxWidth="'lg'"
    title="Add Payment Method"
    @close="isAddPaymentMethodModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="addPaymentMethod()" autocomplete="off">
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            type="text"
            id="ProductName"
            v-model="paymentMethodForm.name"
            placeholder="Input Payment Method Name"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            rows=""
            cols=""
            v-model="paymentMethodForm.remarks"
            placeholder="Input Payment Method Remarks"
            class="mt-1 p-2 border rounded-md w-full"
          ></textarea>
        </div>
        <div class="flex justify-end">
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
import { VUE_APP_API_URL, PERMISSION } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  replaceSpaceWithUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const isAddPaymentMethodModalOpen = ref(false);
const data = ref({});

const paymentMethodForm = ref({
  name: "",
  remarks: "",
});

const addPaymentMethod = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we add the payment method.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(paymentMethodForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}payment-methods/add`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isAddPaymentMethodModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

onMounted(() => {});
</script>
