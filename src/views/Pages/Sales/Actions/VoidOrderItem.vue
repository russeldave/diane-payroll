<template>
  <button
    @click="voidItem()"
    class="bg-red-500 hover:opacity-70 focus:bg-red-300 text-white rounded font-bold rounded text-xs md:text-sm py-1 px-4 float-end text-nowrap"
  >
    <i class="fas fa-ban"></i>
    Void
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
import { getUnits } from "@/views/Utility/PreProcess";
const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const voidItem = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to void this item. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, void it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show processing state
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we void the item.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({ transaction_item_id: props.data.id });
      const response = await axios.post(
        `${VUE_APP_API_URL}menu-sales/void-per-item`,
        formData,
        BearToken(token)
      );

      // Close processing alert
      Swal.close();

      Alert("warning", "Voided!", response.data.message);
      getUnits(token);
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
