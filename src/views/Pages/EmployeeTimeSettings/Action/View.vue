<template>
  <Modal :show="show" :maxWidth="'4xl'" title="VIEW SHIFT" @close="show = false">
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Shift Name </label>
            <input
              type="text"
              v-model="form.shift_name"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Shift Type </label>
            <input
              type="text"
              v-model="form.type"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Max Early </label>
            <input
              type="time"
              v-model="form.max_early"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Time In </label>
            <input
              type="time"
              v-model="form.time_in"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Time Out </label>
            <input
              type="time"
              v-model="form.time_out"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Max Out </label>
            <input
              type="time"
              v-model="form.max_out"
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";

const show = ref(false);

const form = ref({
  shift_name: "",
  type: "",
  max_early: "",
  time_in: "",
  time_out: "",
  max_out: "",
});

const openModal = async (id) => {
  show.value = true; // ✅ OPEN MODAL IMMEDIATELY

  try {
    const response = await axios.post(
      "http://localhost:8995/api/employee-time-settings/view",
      { id }
    );

    form.value = response.data.employeeTimeSetting;
  } catch (error) {
    console.error(error.response?.data || error);
  }
};

defineExpose({ openModal });
</script>
