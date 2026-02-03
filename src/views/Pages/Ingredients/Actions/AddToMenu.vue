<template>
  <button
    @click="addToMenu"
    :class="[
      'bg-lime-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 float-end text-nowrap ',
      className,
    ]"
  >
    <i class="fas fa-plus-circle mr-1"></i>
    Add to Menu
  </button>
</template>

<script setup>
import Swal from "sweetalert2";
import axios from "axios";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, Alert, handleApiError } from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
  className: String,
});

const addToMenu = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Add this item to the menu?",
      text: "This will add the ingredient to the menu lists.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show processing state
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we add the ingredient to menu.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({ ingredient_id: props.data.id });
      const response = await axios.post(
        `${VUE_APP_API_URL}menu/add-ingredient`,
        formData,
        BearToken(token)
      );

      // Close processing alert
      Swal.close();

      Alert("success", "Added!", response.data.message);
      emits("transaction_id", Math.random());
    } else {
      Alert("info", "Cancelled", "Ingredient was not added.");
    }
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};
</script>
