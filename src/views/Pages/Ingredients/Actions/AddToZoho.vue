<template>
  <button
    @click.prevent="addToZohoItem()"
    class="bg-green-700 text-white hover:opacity-70 font-bold text-md py-2 px-0 text-nowrap rounded-md"
    >
    Add To ZOHO Books
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
  ingredient_id_number: String,
});
const addToZohoItem = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to add this ingredient to zoho books?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, ADD it to ZOHO Books!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    console.log("addToZohoBooks");
    console.log(props.ingredient_id_number)

    if (confirmed.isConfirmed) {
      // Show processing state
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we add the ingredient to ZOHO Books.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({ ingredient_id_number: props.ingredient_id_number });
      const response = await axios.post(
        `${VUE_APP_API_URL}ingredients/add-to-zoho-books`,
        formData,
        BearToken(token)
      );

      // Close processing alert
      Swal.close();

      Alert("warning", "Added!", response.data.message);
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
