<template>
  <Modal :show="show" :maxWidth="'4xl'" title="EDIT SHIFT" @close="closeModal">
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4" @submit.prevent="updateShift">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- SHIFT NAME -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Shift Name </label>
            <input
              type="text"
              v-model="form.shift_name"
              required
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <!-- SHIFT TYPE -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Shift Type </label>
            <select
              v-model="form.type"
              required
              class="mt-1 p-2 border rounded-md w-full"
            >
              <option value="Daily">Daily</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <!-- MAX EARLY -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Max Early </label>
            <input
              type="time"
              v-model="form.max_early"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <!-- TIME IN -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Time In </label>
            <input
              type="time"
              v-model="form.time_in"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <!-- TIME OUT -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Time Out </label>
            <input
              type="time"
              v-model="form.time_out"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <!-- MAX OUT -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"> Max Out </label>
            <input
              type="time"
              v-model="form.max_out"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>

        <!-- UPDATE BUTTON -->
        <div class="block float-end">
          <button
            type="submit"
            :disabled="loading"
            class="bg-yellow-500 hover:opacity-70 text-white font-bold py-2 px-4 rounded"
          >
            <span v-if="loading">Updating...</span>
            <span v-else>Update</span>
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
const loading = ref(false);
const editId = ref(null);

const form = ref({
  shift_name: "",
  type: "",
  max_early: "",
  time_in: "",
  time_out: "",
  max_out: "",
});

/* ================= OPEN MODAL (FIXED) ================= */
const openModal = async (id) => {
  show.value = true; // ✅ OPEN MODAL IMMEDIATELY

  try {
    const response = await axios.post(
      "http://localhost:8995/api/employee-time-settings/view",
      { id }
    );

    const data = response.data.employeeTimeSetting;

    editId.value = data.id;

    form.value = {
      shift_name: data.shift_name || "",
      type: data.type || "",
      max_early: data.max_early || "",
      time_in: data.time_in || "",
      time_out: data.time_out || "",
      max_out: data.max_out || "",
    };
  } catch (error) {
    console.error("Load error:", error.response?.data || error);
  }
};

/* ================= UPDATE SHIFT ================= */
const updateShift = async () => {
  try {
    loading.value = true;

    const payload = {
      id: editId.value,
      shift_name: form.value.shift_name,
      type: form.value.type,
      max_early: form.value.max_early,
      time_in: form.value.time_in,
      time_out: form.value.time_out,
      max_out: form.value.max_out,
    };

    await axios.post("http://localhost:8995/api/employee-time-settings/update", payload);

    await Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Shift updated successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    closeModal();
    emits("refresh");
  } catch (error) {
    console.error("Update error:", error.response?.data || error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to update shift.",
    });
  } finally {
    loading.value = false;
  }
};

/* ================= CLOSE MODAL ================= */
const closeModal = () => {
  show.value = false;
};

/* ================= EXPOSE ================= */
defineExpose({ openModal });
</script>
