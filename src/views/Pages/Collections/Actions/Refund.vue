<template>
  <button
    @click="refund()"
    :class="[
      'bg-gray-500 text-white hover:opacity-70 rounded-l focus:bg-red-300 font-bold text-xs md:text-sm py-2 px-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-undo"></i>
    Refund
  </button>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, PERMISSION, BUILDING } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError,
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  className: String,
});

const refund = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to refund this transaction. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, refund it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show processing state
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we process the refund.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({ menu_sales_id: props.data.id });
      const response = await axios.post(
        `${VUE_APP_API_URL}menu-sales/refund`,
        formData,
        BearToken(token)
      );

      // Close processing alert
      Swal.close();

      Alert("success", "Refunded!", response.data.message);
      emits("transaction_id", Math.random());
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};
</script>
