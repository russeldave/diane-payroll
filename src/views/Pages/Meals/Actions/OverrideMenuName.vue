<template>
  <button
    @click.prevent="overrideMenuName()"
    title="Override Menu Name"
    class="bg-red-500 text-white hover:opacity-70 focus:bg-red-300 rounded-r font-bold text-sm md:text-lg py-2 px-4 float-end text-nowrap shadow-xl border"
  >
    <i class="fas fa-pencil-alt"></i>
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
});
const overrideMenuName = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to override menu name?. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, override!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show processing state
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we update the menu name.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({
        menu_id: props.data.menu_id,
        menu_name: props.data.name,
      });

      const response = await axios.post(
        `${VUE_APP_API_URL}override-food/menu-name`,
        formData,
        BearToken(token)
      );

      // Close processing alert
      Swal.close();

      Alert("success", "Updated!", response.data.message);
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
