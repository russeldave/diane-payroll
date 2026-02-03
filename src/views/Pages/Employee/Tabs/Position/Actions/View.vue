<template>
  <button
    @click="viewPositionBehavior()"
    class="bg-blue-500 hover:opacity-70 focus:bg-blue-300 text-white font-bold text-sm md:text-md py-2 px-4 rounded-l mb-4 float-end"
  >
    <i class="fa fa-eye"></i> View
  </button>
  <Modal :show="isViewModalOpen" :maxWidth="'2xl'" title="View Employee Information" @close="isViewModalOpen = false">
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4">
        <div class="mb-4">
          <label
            for="EmployeeID"
            class="block text-sm font-medium text-gray-700"
            >Employee ID</label
          >
          <input
            type="text"
            v-model="form.employee_no"
            placeholder="Input Employee ID"
            required
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="mb-4">
            <label
              for="LastName"
              class="block text-sm font-medium text-gray-700"
              >Last Name</label
            >
            <input
              type="text"
              v-model="form.last_name"
              placeholder="Input Last Name"
              required
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label
              for="FirstName"
              class="block text-sm font-medium text-gray-700"
              >First Name</label
            >
            <input
              type="text"
              v-model="form.first_name"
              placeholder="Input First Name"
              required
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label
              for="MiddleName"
              class="block text-sm font-medium text-gray-700"
              >Middle Name</label
            >
            <input
              type="text"
              v-model="form.middle_name"
              placeholder="Input Middle Name"
              required
              disabled
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
        </div>
        <div class="mb-4 md:col-span-2">
          <label
            for="Address"
            class="block text-sm font-medium text-gray-700"
            >Address</label
          >
          <textarea
            placeholder="Input Address"
            v-model="form.address"
            required
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          >
          </textarea>
        </div>
        <div class="mb-4">
          <label
            for="ContactNo"
            class="block text-sm font-medium text-gray-700"
            >Contact No.</label
          >
          <input
            type="text"
            v-model="form.contact_info"
            required
            placeholder="Input Contact No."
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
        </div>
        <div class="mb-4 md:col-span-2">
          <label
            for="Remarks"
            class="block text-sm font-medium text-gray-700"
            >Remarks</label
          >
          <textarea
            placeholder="Input Remarks"
            v-model="form.remarks"
            required
            disabled
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          >
          </textarea>
        </div>
        <!-- <div class="block float-end">
          <button
            type="submit"
            class="bg-yellow-500 text-white font-bold py-2 px-4 rounded"
          >
            Update
          </button>
        </div> -->
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

const isViewModalOpen = ref(false); // Control visibility of add product modal
const form = ref({
  employee_id: 0,
  employee_no: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  address: '',
  remarks: '',
  contact_info: '',
});
const viewPositionBehavior = async () => {
  isViewModalOpen.value = true;
  viewForm();
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
    contact_info: data.contactInfo,
    employee_no: data.employeeNumber,
  };
};

</script>
