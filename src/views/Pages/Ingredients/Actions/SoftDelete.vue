<template>
  <button
    @click="deleteItem()"
    :class="[
      'bg-rose-600 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap hover:scale-110',
      className,
    ]"
  >
    <!-- <i class="fas fa-trash"></i> -->
    Soft Delete
  </button>
</template>
<script setup>

import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, PERMISSION} from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  handleApiError
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  className: String,
});
const deleteItem = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to soft delete this item. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Soft delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show the processing alert
      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Proceed with deletion using Axios
      const formData = FormDx({ ingredient_id_number: props.data.ingredientIdNumber });
      const response = await axios.post(
        `${VUE_APP_API_URL}ingredients/soft-delete`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Swal.close();
      Alert("warning", "Deleted!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    // Handle Axios or other errors
    handleApiError(error);
  }
};
</script>
