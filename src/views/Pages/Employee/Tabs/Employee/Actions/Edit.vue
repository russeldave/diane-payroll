<template>
  <button
    @click.prevent="editEmployeeBehavior()"
    class="bg-yellow-500 hover:opacity-70 focus:bg-yellow-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 float-end"
  >
    <i class="fa fa-edit"></i> Edit
  </button>
  <Modal
    :show="isEditModalOpen"
    :maxWidth="'4xl'"
    title="Update Employee"
    @close="isEditModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4" @submit.prevent="editEmployee()" autocomplete="off">
        <div class="mb-4">
          <label for="LeagueName" class="block text-sm font-medium text-gray-700"
            >Employee ID</label
          >
          <input
            type="text"
            v-model="form.employee_no"
            placeholder="Input Last Name"
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
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
            <option v-for="(position, pp) in positions" :value="position.value" :key="pp">
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
        <div class="mb-4 md:col-span-2">
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
import { VUE_APP_API_URL, DATE_NOW } from "@/views/Utility/Global";
import { FormDx, BearToken, handleApiError } from "@/views/Utility/Helper";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const token = localStorage.getItem("token");
const positions = ref([]);
const users = ref([]);
const isEditModalOpen = ref(false); // Control visibility of add product modal
const form = ref({
  employee_id: 0,
  employee_position_id: 0,
  employee_no: "",
  first_name: "",
  last_name: "",
  middle_name: "",
  user_id: 0,
  address: "",
  remarks: "",
  contact_info: "",
});
const editEmployeeBehavior = async () => {
  isEditModalOpen.value = true;

  viewForm();
  getPositionDropdown();
  getUsersDropdown();
};

const viewForm = () => {
  const data = props.data;
  form.value = {
    employee_id: data.id,
    first_name: data.firstName,
    last_name: data.lastName,
    middle_name: data.middleName,
    address: data.address,
    remarks: data.remarks,
    employee_position_id: data.positionId ?? 0,
    contact_info: data.contactInfo,
    employee_no: data.employeeNumber,
    user_id: data.userId ?? 0,
  };
};
const editEmployee = async () => {
  try {
    // Show the processing alert
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    form.value.is_daily = form.value.is_daily ? 1 : 0;
    form.value.date_now = DATE_NOW();

    const formData = FormDx(form.value);
    const response = await axios.post(
      VUE_APP_API_URL + "employees/edit",
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
</script>
