<template>
  <Modal
    :show="isShiftModalOpen"
    :maxWidth="'4xl'"
    title="CREATE NEW SHIFT"
    @close="closeShiftModal"
  >
    <!-- HEADER -->
    <template #header>
      <div
        class="flex justify-between items-center px-6 py-4 text-white"
        style="background: linear-gradient(to right, #b91c1c, #7f1d1d)"
      >
        <div class="flex items-center gap-3">
          <i class="fas fa-clock text-white text-lg"></i>
          <h2 class="text-lg font-bold">CREATE NEW SHIFT</h2>
        </div>

        <button @click="closeShiftModal" class="text-white text-xl font-bold">✕</button>
      </div>
    </template>

    <!-- BODY -->
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4" @submit.prevent="addShift">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Shift Name </label>
            <input
              type="text"
              v-model="form.shift_name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Shift Type </label>
            <select v-model="form.type" class="mt-1 p-2 border rounded-md w-full">
              <option value="">--Select Type--</option>
              <option value="Daily">Daily</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Max Early </label>
            <input
              type="time"
              v-model="form.max_early"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Time In </label>
            <input
              type="time"
              v-model="form.time_in"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Time Out </label>
            <input
              type="time"
              v-model="form.time_out"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Max Out </label>
            <input
              type="time"
              v-model="form.max_out"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>

        <div class="block float-end">
          <button
            type="submit"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";

const emits = defineEmits(["refresh"]);

const isShiftModalOpen = ref(false);

const form = ref({
  shift_name: "",
  type: "",
  max_early: "",
  time_in: "",
  time_out: "",
  max_out: "",
});

const openShiftModal = () => {
  isShiftModalOpen.value = true;
  resetForm();
};

const closeShiftModal = () => {
  isShiftModalOpen.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    shift_name: "",
    type: "",
    max_early: "",
    time_in: "",
    time_out: "",
    max_out: "",
  };
};

const addShift = async () => {
  try {
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    await axios.post("http://localhost:8995/api/employee-time-settings/add", form.value);

    Swal.close();
    closeShiftModal();
    Swal.fire("Success", "Shift created successfully.", "success");

    emits("refresh");
  } catch (error) {
    Swal.close();
    console.error(error.response?.data || error);
  }
};

defineExpose({
  openShiftModal,
});
</script>
