<template>
  <button
    @click="deleteShift"
    class="bg-red-500 hover:opacity-70 focus:bg-red-300 text-white font-bold rounded-r text-sm md:text-md py-2 px-4 text-nowrap"
  >
    <i class="fas fa-trash mr-1"></i>
    Delete
  </button>
</template>

<script setup>
import Swal from "sweetalert2";
import axios from "axios";

const emits = defineEmits(["refresh"]);

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const deleteShift = async () => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this shift. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "Deletion cancelled.",
          timer: 1200,
          showConfirmButton: false,
        });
      }
      return;
    }

    // Proceed delete
    await axios.post("http://localhost:8995/api/employee-time-settings/delete", {
      id: props.id,
    });

    await Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Shift has been deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    emits("refresh");
  } catch (error) {
    console.error(error.response?.data || error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while deleting.",
    });
  }
};
</script>
