<template>
  <button
    @click.prevent="addEmployeeBehavior()"
    class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-md text-sm md:text-md py-2 px-4 rounded-lg mb-4 float-end"
  >
    <i class="fa fa-user-plus"></i> Add Employee
  </button>
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'4xl'"
    title="Add New Employee"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4" @submit.prevent="addEmployee()" autocomplete="off">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Last Name</label
            >
            <input
              type="text"
              v-model="form.last_name"
              placeholder="Input Last Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >First Name</label
            >
            <input
              type="text"
              v-model="form.first_name"
              placeholder="Input First Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Middle Name</label
            >
            <input
              type="text"
              v-model="form.middle_name"
              placeholder="Input Middle Name"
              class="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Position</label
          >
          <select
            v-model="form.employee_position_id"
            class="mt-1 p-2 border rounded-md w-full"
          >
            <option value="0">--Select Position--</option>
            <option
              v-for="(position, pp) in positions"
              :value="position.value"
              :key="pp"
              @click="selectPosition(position)"
            >
              {{ position.label }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Supervisor</label
          >
          <select v-model="form.user_id" class="mt-1 p-2 border rounded-md w-full">
            <option value="0">None</option>
            <option v-for="(user, uu) in users" :value="user.value" :key="uu">
              {{ user.label }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Address</label
          >
          <textarea
            placeholder="Input Address"
            v-model="form.address"
            class="mt-1 p-2 border rounded-md w-full"
          >
          </textarea>
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Contact No.</label
          >
          <input
            type="text"
            v-model="form.contact_info"
            placeholder="Input Contact No."
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
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
const positions = ref([]);
const users = ref([]);
const isAddModalOpen = ref(false); // Control visibility of add product modal
const form = ref({
  first_name: "",
  last_name: "",
  middle_name: "",
  address: "",
  remarks: "",
  contact_info: "",
  pos_id: 0,
  employee_position_id: 0,
});
const addEmployeeBehavior = async () => {
  isAddModalOpen.value = true;

  getPositionDropdown();
  getUsersDropdown();
  resetForm();
};
const resetForm = () => {
  form.value = {
    first_name: "",
    last_name: "",
    middle_name: "",
    address: "",
    remarks: "",
    contact_info: "",
    employee_position_id: 0,
    user_id: 0,
  };
};
const addEmployee = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(form.value);
    const response = await axios.post(
      VUE_APP_API_URL + "/employees/add",
      formData,
      BearToken(token)
    );
    if (response.data) {
      Swal.close();
      isAddModalOpen.value = false;
      Swal.fire("Success", "Employee added successfully.", "success");
    }

    emits("transaction_id", Math.random()); // Emit the event with an identifier
  } catch (error) {
    Swal.close();
    handleApiError(error);
    emits("transaction_id", Math.random()); // Emit the event with an identifier
  }
};
const selectPosition = (position) => {
  console.log(position);
  form.employee_position_id.value = position.id;
};
const getPositionDropdown = async () => {
  try {
    const formData = FormDx({ id: 0 });
    positions.value = [];
    const response = await axios.post(
      VUE_APP_API_URL + "/employee-positions/dropdown",
      formData,
      BearToken(token)
    );

    positions.value = response.data.employeePositions;
  } catch (error) {
    handleApiError(error);
  }
};
const getUsersDropdown = async () => {
  try {
    const formData = FormDx({ id: 0 });
    users.value = [];
    const response = await axios.post(
      VUE_APP_API_URL + "/users/dropdown",
      formData,
      BearToken(token)
    );

    users.value = response.data.users;
  } catch (error) {
    handleApiError(error);
  }
};
const handlePhotoUpload = (event) => {
  const files = event.target.files; // Get all selected files
  const fileArray = Array.from(files); // Convert FileList to array for easier manipulation

  // Assuming form.value.employee_images is an array to store multiple files
  form.value.employee_images = fileArray; // Assign the array of selected files to form object
};
</script>
