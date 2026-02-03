<template>
  <button
    @click.prevent="completeItem()"
    type="button"
    :disabled="props.data.status > 1"
    :class="props.data.status > 1 ? 'opacity-50' : ''"
    class="bg-green-500 hover:opacity-70 focus:bg-green-300 text-white font-bold rounded text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-check-circle text-lime-200"></i>
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
  data: Object,
});
const completeItem = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to complete this item. This action cannot be undone.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Proceed with deletion using Axios
      const formData = FormDx({ po_item_id: props.data.id });
      const response = await axios.post(
        `${VUE_APP_API_URL}pos/to-complete-po-item`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("success", "Completed!", response.data.message);
      // Optionally, update any local state or UI after deletion
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      // Handle cancellation
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);//
  }
};
</script>
