<template>
  <button
    @click="addPositionBehavior()"
    class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-sm md:text-md py-2 px-4 rounded-lg mb-4 float-end"
  >
    <i class="fa fa-network-wired"></i> Add Position
  </button>
  <Modal :show="isAddModalOpen" :maxWidth="'xl'" title="Add New Position" @close="isAddModalOpen = false">
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4" @submit.prevent="addPosition()" autocomplete="off">
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              type="text"
              v-model="form.position_name"
              required
              placeholder="Input Position Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label
              for="LeagueName"
              class="block text-sm font-medium text-gray-700"
              >Remarks</label
            >
            <!-- <textarea
              placeholder="Input Remarks"
              v-model="form.remarks"
              required
              class="mt-1 p-2 border rounded-md w-full"
            >
            </textarea> -->
            <textarea
              placeholder="Input Remarks"
              v-model="form.remarks"
              class="mt-1 p-2 border rounded-md w-full"
            >
            </textarea>
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
import { VUE_APP_API_URL } from "@/views/Utility/Global";
import { FormDx, BearToken, handleApiError } from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false); // Control visibility of add product modal
const form = ref({
  position_name: '',
  remarks: '',
});
const addPositionBehavior = async () => {
  isAddModalOpen.value = true;
  resetForm();
};
const resetForm = () => {
  form.value = {
    position_name: '',
    remarks: '',
  };
}
const addPosition = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = FormDx(form.value);
    const response = await axios.post(
      VUE_APP_API_URL + "employee-positions/add",
      formData,
      BearToken(token)
    );
    if (response.data) {
      Swal.close();
      isAddModalOpen.value = false;
      Swal.fire("Success", "Position added successfully.", "success");
    }

    emits("transaction_id", Math.random()); // Emit the event with an identifier
  } catch (error) {
    Swal.close();
    handleApiError(error);
    emits("transaction_id", Math.random()); // Emit the event with an identifier
  }
};
const handlePhotoUpload = (event) => {
  const files = event.target.files; // Get all selected files
  const fileArray = Array.from(files); // Convert FileList to array for easier manipulation

  // Assuming form.value.employee_images is an array to store multiple files
  form.value.employee_images = fileArray; // Assign the array of selected files to form object
};

</script>
