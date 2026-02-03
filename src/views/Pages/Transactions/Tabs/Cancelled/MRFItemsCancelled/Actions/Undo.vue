<template>
    <button
      @click="undoRejectItem()"
      class="bg-red-500 hover:opacity-70 focus:bg-gray-300 rounded-r text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
    >
      <i class="fas fa-undo"></i>
      Undo
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
    handleApiError
  } from "@/views/Utility/Helper";
  
  const token = localStorage.getItem("token");
  const emits = defineEmits(["transaction_id"]);
  const props = defineProps({
    mrf_item_id: Number,
  });
  const undoRejectItem = async () => {
    try {
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to undo the last action of this item. This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, undo it!",
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
        // Proceed with undo using Axios
        const formData = FormDx({ mrf_id: props.data.id });
        const response = await axios.post(
          `${VUE_APP_API_URL}mrfs/undo-reject`,
          formData,
          BearToken(token)
        );

        // Handle success response
        Swal.close();
        Alert("success", "Undo Success!", response.data.message);
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
  