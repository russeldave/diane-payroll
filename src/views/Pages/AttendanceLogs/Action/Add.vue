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
        <!-- NAME FIELD ONLY -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2"> Name </label>
          <input
            type="text"
            v-model="form.name"
            required
            placeholder="Enter employee name"
            class="w-full p-2 border rounded-md"
          />
        </div>

        <!-- SAVE BUTTON -->
        <div class="text-right">
          <button
            type="submit"
            class="bg-blue-600 hover:opacity-70 text-white px-4 py-2 rounded font-bold"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "@/views/Component/Modal.vue";

const emits = defineEmits(["refresh"]);

const show = ref(false);

const form = ref({
  name: "",
});

/* OPEN MODAL */
const openModal = () => {
  form.value.name = "";
  show.value = true;
};

/* CLOSE MODAL */
const closeModal = () => {
  show.value = false;
};

/* SAVE FUNCTION */
const saveLog = async () => {
  try {
    Swal.fire({
      title: "Saving...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    await axios.post("http://localhost:8995/api/attendance-logs", {
      name: form.value.name, // ONLY NAME
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

    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Failed to save log.",
    });
  }
};

defineExpose({ openModal });
</script>
