<template>
  <button
    @click.prevent="deleteItem()"
    type="button"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold rounded-r text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fa-solid fa-pen-to-square text-red-200"></i>
    Edit
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
import { data } from "autoprefixer";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object, // Changed from Array to Object
});


const deleteItem = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Edit this mrf item?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes!,Edit it.",
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
      const formData = FormDx({    
        quantity: props.data.quantity,
        remark: props.data.remarks,
        mrf_item_id: props.data.mrf_item_id });
      const response = await axios.post(
        `${VUE_APP_API_URL}mrfs/mrf-item-edit`,
        formData,
        BearToken(token)
      );
      Swal.close();
      Alert("success", "MRF Items Edited!", response.data.message);
    } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
      Alert("info", "Cancelled!", "Your action has been cancelled.");
    }
    emits("transaction_id", Math.random());
  } catch (error) {
    Swal.close();
    handleApiError(error);
  }
};
</script>