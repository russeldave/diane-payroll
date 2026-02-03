<template>
  <button
    @click.prevent="overrideAutoAssigneWarehouse()"
    title="Override Cost Price"
    class="bg-red-500 text-white hover:opacity-70 focus:bg-red-300 rounded-r font-bold text-sm md:text-lg py-2 px-4 float-end text-nowrap shadow-xl border"
  >
    <i class="fas fa-pencil-alt"></i>
  </button>
</template>

<script setup>
import Swal from "sweetalert2";
import axios from "axios";
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  handleApiError,
} from "@/views/Utility/Helper";

const token = localStorage.getItem("token");
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  ingredient_id: [Number, String],
  auto_assign_warehouse_id: Number,
});
const overrideAutoAssigneWarehouse = async () => {
  try {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text:
        "You are about to override the Auto Assign stocking of warehouse during receiving?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, override Assign!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      // Show processing state
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we update the Warehouse assigning.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = FormDx({
        ingredient_id: props.ingredient_id,
        auto_assign_warehouse_id: props.auto_assign_warehouse_id,
      });

      const response = await axios.post(
        `${VUE_APP_API_URL}override-food/auto-assign-warehouse`,
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
