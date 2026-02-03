<template>
  <button
    @click="completeMrfItem()"
    :class="[
      'bg-lime-600 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap hover:scale-110',
      className,
    ]"
  >
    Complete
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
  mrf_item_id: {
    type:Number,
    default:0
  },
});
const completeMrfItem = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to COMPLETE this item",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Complete!",
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
      const formData = FormDx({ mrf_item_id: props.mrf_item_id });
      const response = await axios.post(
        `${VUE_APP_API_URL}mrfs/complete-item`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Swal.close();
      Alert("warning", "Completed!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Completed!", "Your action has been completed.");
    }
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    // Handle Axios or other errors
    handleApiError(error);
  }
};
</script>
