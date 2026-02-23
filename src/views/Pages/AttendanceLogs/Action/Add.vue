<template>
  <Modal :show="show" :maxWidth="'md'" title="Add Attendance Log" @close="closeModal">
    <template #header>
      <div class="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
        <h2 class="text-lg font-bold">Add Attendance Log</h2>
        <button @click="closeModal" class="text-xl font-bold hover:opacity-70">✕</button>
      </div>
    </template>

    <div class="p-6">
      <form @submit.prevent="saveLog">
        <!-- NAME FIELD - ONLY NUMBERS -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">
            Employee ID <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            v-model="form.employee_id"
            @input="validateNumberInput"
            required
            placeholder="Enter employee ID (numbers only)"
            class="w-full p-2 border rounded-md"
            pattern="[0-9]*"
          />
          <small class="text-gray-500 mt-1 block">Numbers only</small>
        </div>

        <!-- SAVE BUTTON -->
        <div class="text-right">
          <button
            type="submit"
            :disabled="!isValidNumber || loading"
            class="bg-blue-600 hover:opacity-70 text-white px-4 py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "@/views/Component/Modal.vue";

const emits = defineEmits(["refresh"]);

const show = ref(false);
const loading = ref(false);

const form = ref({
  employee_id: 0,
});

// Check if input is valid number
const isValidNumber = computed(() => {
  return form.value.name && /^\d+$/.test(form.value.name);
});

// Validate number input - only allow numbers
const validateNumberInput = (event) => {
  // Remove any non-digit characters
  form.value.name = event.target.value.replace(/\D/g, "");
};

/* OPEN MODAL */
const openModal = () => {
  form.value.name = "";
  show.value = true;
};

/* CLOSE MODAL */
const closeModal = () => {
  show.value = false;
  form.value.employee_id = 0;
};

/* SAVE FUNCTION */
const saveLog = async () => {
  try {
    // Additional validation
    if (!isValidNumber.value) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Input",
        text: "Please enter a valid employee ID (numbers only)",
      });
      return;
    }

    loading.value = true;

    Swal.fire({
      title: "Saving...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    await axios.post("api/attendance-logs/add", {
      employee_id: form.value.employee_id,
    });

    Swal.close();

    await Swal.fire({
      icon: "success",
      title: "Success",
      text: "Attendance log saved successfully!",
      timer: 1500,
      showConfirmButton: false,
    });

    closeModal();
    emits("refresh");
  } catch (error) {
    Swal.close();
    console.error(error.response?.data || error);

    let errorMessage = "Failed to save log.";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).flat().join("\n");
    }

    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
    });
  } finally {
    loading.value = false;
  }
};

defineExpose({ openModal });
</script>
