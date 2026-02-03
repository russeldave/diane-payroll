<template>
  <button
    @click.prevent="addItem()"
    type="button"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-plus text-red-200"></i>
    Add
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
  data: Array,
});
const addItem = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this mrf item?. This action cannot be undone.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes!,add it.",
      cancelButtonText: "No!, I change my mind.",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const formData = FormDx(props.data);

      if (props.data.item_images && props.data.item_images.length > 0) {
        props.data.item_images.forEach((file, index) => {
          formData.append(`item_images[${index}]`, file);
        });
      }
      
      const response = await axios.post(
        `${VUE_APP_API_URL}mrfs/add-mrf-item`,
        formData,
        BearToken(token)
      );
      Swal.close();
      // Handle success response
      Alert("success", "MRF Items Added!", response.data.message);
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
