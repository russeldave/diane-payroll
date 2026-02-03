<template>
  <button
    @click.prevent="editItem()"
    type="button"
    class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white rounde-l font-bold rounded-l text-sm md:text-md py-2 px-4 mb-4 float-end text-nowrap"
  >
    <i class="fas fa-edit"></i>
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
const form = ref({
  po_item_id: 0,
  new_price: 0,
  new_sub_price: 0,
  new_quantity: 0,
  new_remarks: '',
  new_sub_quantity: 0
});
const fillForm = () => {
  const data = props.data;

  console.log(data);
  form.value = {
    po_item_id: data.id,
    new_price: data.price,
    new_quantity: data.quantity,
    new_remarks: data.remarks,
    new_discount: data.discountAmount ?? 0,
    chart_of_account_id: data.charOfAccountId ?? 0,
    tax_code_id: data.taxCodeId ?? 0,
  }
}
const editItem = async () => {
  try {
    fillForm()

    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to edit this item. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Proceed with deletion using Axios
      const formData = FormDx(form.value);
      const response = await axios.post(
        `${VUE_APP_API_URL}pos/edit-po-item`,
        formData,
        BearToken(token)
      );

      // Handle success response
      Alert("warning", "Item Updated!", response.data.message);
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
