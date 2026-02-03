<template>
  <button
    @click="editPositionBehavior()"
    class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white font-bold text-sm md:text-md  py-2 px-4 rounded mb-4 float-end"
  >
    <i class="fa fa-edit"></i> Edit
  </button>
  <Modal :show="isEditModalOpen" :maxWidth="'2xl'"  title="Update Position" @close="isEditModalOpen = false">
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4" @submit.prevent="editPosition()" autocomplete="off">
       
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
          placeholder="Input Position."
          class="mt-1 p-2 border rounded-md w-full"
        />
      </div>
      <div class="mb-4 md:col-span-2">
        <label
          for="LeagueName"
          class="block text-sm font-medium text-gray-700"
          >Remarks</label
        >
        <textarea
          placeholder="Input Remarks"
          v-model="form.remarks"
          required
          class="mt-1 p-2 border rounded-md w-full"
        >
        </textarea>
      </div>
        <div class="block float-end">
          <button
            type="submit"
            class="bg-yellow-500 text-white font-bold py-2 px-4 rounded"
          >
            Update
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
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
});
const token = localStorage.getItem("token");

const isEditModalOpen = ref(false); // Control visibility of add product modal
const form = ref({
 position_id: 0,
 position_name: '',
 remarks: '',

});
const editPositionBehavior = async () => {
  isEditModalOpen.value = true;
  viewForm();
};

const viewForm = () => {
  const data = props.data;
  form.value = {
   position_id: data.id,
   position_name: data.name,
   remarks: data.remarks,
  };
};
const editPosition = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    form.value.is_daily = form.value.is_daily ? 1 : 0;
    form.value.date_now = DATE_NOW();

    const formData = FormDx(form.value);
    const response = await axios.post(
      VUE_APP_API_URL + "employee-positions/edit",
      formData,
      BearToken(token)
    );
    if (response.data) {
      Swal.close();
      isEditModalOpen.value = false;
      Swal.fire("Success", response.data.messsage, "success");
    }

    emits("transaction_id", Math.random()); // Emit the event with an identifier
  } catch (error) {
    Swal.close();
    handleApiError(error);
    emits("transaction_id", Math.random()); // Emit the event with an identifier
  }
};
</script>
