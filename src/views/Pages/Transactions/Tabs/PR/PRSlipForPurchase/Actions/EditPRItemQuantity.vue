<template>
  <button
    @click.prevent="editPrItem()"
    type="button"
    class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-edit text-red-200"></i>
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

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Array,
});
const editPrItem = async () => {
  console.log("editPrItem");
  console.log(props.data);
  try {
    // const confirmed = await Swal.fire({
    //   title: "Are you sure?",
    //   text: "Do you want to delete this PR item?. This action cannot be undone.",
    //   icon: "question",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes!,delete it.",
    //   cancelButtonText: "No!, I change my mind.",
    //   reverseButtons: true,
    // });

    // if (confirmed.isConfirmed) {
      // Proceed with deletion using Axios
      const formData = FormDx({ 
        pr_item_id: props.data.pr_item_id,
        pr_item_price: props.data.pr_price,
        pr_price_conversion: props.data.pr_price_conversion,
        quantity: props.data.quantity,
        remarks: props.data.pr_remarks,
        unit_id: props.data.unit_id,
        to_unit_id: props.data.to_unit_id,
        conversion_rate: props.data.conversion_rate,
      });
      const response = await axios.post(
        `${VUE_APP_API_URL}prs/edit-pr-item`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("success", "PR Items Updated!", response.data.message);
      // Optionally, update any local state or UI after deletion
    // } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
    //   // Handle cancellation
    //   Alert("info", "Cancelled!", "Your action has been cancelled.");
    // }
    emits("transaction_id", Math.random());
  } catch (error) {
    handleApiError(error);
  }
};

</script>
