<template>
  <div class="flex space-x-2">
    <button
      @click="handleTime('in')"
      :disabled="processing || hasTimeIn"
      :class="[
        'px-3 py-1 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed',
        hasTimeIn
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-600 text-white',
      ]"
    >
      Time In
    </button>

    <button
      @click="handleTime('out')"
      :disabled="processing || hasTimeOut"
      :class="[
        'px-3 py-1 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed',
        hasTimeOut
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-red-500 hover:bg-red-600 text-white',
      ]"
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
  employeeId: {
    type: Number,
    required: true,
  },
  hasTimeIn: {
    type: Boolean,
    default: false,
  },
  hasTimeOut: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["refresh"]);

const processing = ref(false);

const handleTime = async (type) => {
  try {
    processing.value = true;

    const actionText = type === "in" ? "Time In" : "Time Out";

    Swal.fire({
      title: `Processing ${actionText}...`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const response = await axios.post(
      `/api/daily-attendance/time-${type}/${props.employeeId}`
    );

    Swal.close();

    await Swal.fire({
      icon: "success",
      title: "Success",
      text: `${actionText} recorded successfully!`,
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      emit("refresh");
    }, 300);
  } catch (error) {
    Swal.close();

    // Handle early/late prompts (422 status with early flag)
    if (error.response?.status === 422 && error.response.data?.early) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Confirm Action",
        text: error.response.data.message,
        showCancelButton: true,
        confirmButtonText: "Yes, continue",
        cancelButtonText: "No, cancel",

        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        try {
          processing.value = true;

          Swal.fire({
            title: "Processing...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });

          await axios.post(
            `/api/daily-attendance/time-${type}/${props.employeeId}?force=true`
          );

          Swal.close();

          await Swal.fire({
            icon: "success",
            title: "Success",
            text: `${actionText} recorded successfully!`,
            timer: 1500,
            showConfirmButton: false,
          });

          setTimeout(() => {
            emit("refresh");
          }, 300);
        } catch (forceError) {
          Swal.close();

          Swal.fire({
            icon: "error",
            title: "Error",
            text: forceError.response?.data?.message || "Action failed.",
          });
        } finally {
          processing.value = false;
        }
      }
      return;
    }

    // Handle specific error messages
    if (error.response?.status === 400) {
      let message = error.response.data?.message || "Action failed.";

      if (message.includes("already timed in")) {
        message = "Employee has already timed in today.";
      } else if (message.includes("No time settings")) {
        message = "No time settings assigned to employee.";
      } else if (message.includes("No time in record")) {
        message = "No time in record found. Please time in first.";
      } else if (message.includes("Already completed")) {
        message = "Attendance already completed for today.";
      }

      Swal.fire({
        icon: "info",
        title: "Information",
        text: message,
      });
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || `${actionText} failed.`,
    });
  } finally {
    processing.value = false;
  }
};
</script>
