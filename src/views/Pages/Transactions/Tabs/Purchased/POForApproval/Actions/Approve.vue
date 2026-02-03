<template>
  <button
    @click.prevent="updateStatusJO()"
    type="button"
    class="bg-lime-500 hover:opacity-70 focus:bg-lime-300 text-white rounded-r font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fa fa-thumbs-up"></i>
    Approve
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
  po_id: Number,
});
const updateStatusJO = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text:
        "You are about to update the status of this Purchase Order. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show the processing alert
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      // Proceed with deletion using Axios
      const formData = FormDx({ po_id: props.po_id });
      const response = await axios.post(
        `${VUE_APP_API_URL}pos/approve`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Swal.close();
      Alert("success", "Success!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
</script>
