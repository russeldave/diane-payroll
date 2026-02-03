<template>
  <button
    @click.prevent="logCostPrice()"
    class="bg-yellow-500 text-white hover:opacity-70 focus:bg-yellow-300 rounded font-bold text-sm md:text-md py-2 px-2 float-end text-nowrap"
  >
    <i class="fa fa-photo-film"></i>
    Snapshot Cost Price
  </button>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
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
  buffet_id: [Number, String],
});

const logCostPrice = async () => {
  try {
    // Show confirmation dialog first
    const confirmation = await Swal.fire({
      title: "Confirm Action",
      text: "Are you sure you want to take snapshot of this cost price?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#EAB308", // yellow-500
      cancelButtonColor: "#6B7280", // gray-500
      confirmButtonText: "Yes, take snapshot!",
      cancelButtonText: "Cancel",
    });

    // If user confirms, proceed with the action
    if (confirmation.isConfirmed) {
      // Show processing alert
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we update the cost price.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({ buffet_id: props.buffet_id });
      const response = await axios.post(
        `${VUE_APP_API_URL}buffets/log-cost-price`,
        formData,
        BearToken(token)
      );

      // Close processing alert
      Swal.close();

      if (!response.data.error) {
        Alert("success", "Success!", response.data.message);
        emits("transaction_id", Math.random());
      } else {
        Alert("warning", "Warning!", response.data.message);
      }
    }
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const updateCostPrice = () => {
  // Update cost price logic
};
</script>
