<template>
  <div class="flex space-x-2">
    <button
      @click="handleTime('in')"
      :disabled="processing"
      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Time In
    </button>

    <button
      @click="handleTime('out')"
      :disabled="processing"
      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Time Out
    </button>
  </div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";

const props = defineProps({
  employeeId: Number,
});

const emit = defineEmits(["refresh"]);

const processing = ref(false);

/* ================= HANDLE TIME (Reusable) ================= */
const handleTime = async (type) => {
  try {
    processing.value = true;

    const actionText = type === "in" ? "Time In" : "Time Out";

    Swal.fire({
      title: `Processing ${actionText}...`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    await axios.post(
      `http://localhost:8995/api/daily-attendance/time-${type}/${props.employeeId}`
    );

    Swal.close();

    await Swal.fire({
      icon: "success",
      title: "Success",
      text: `${actionText} recorded successfully!`,
      timer: 1200,
      showConfirmButton: false,
    });

    // small delay ensures fresh backend data
    setTimeout(() => {
      emit("refresh");
    }, 300);
  } catch (error) {
    Swal.close();

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        `${type === "in" ? "Time In" : "Time Out"} failed.`,
    });
  } finally {
    processing.value = false;
  }
};
</script>
