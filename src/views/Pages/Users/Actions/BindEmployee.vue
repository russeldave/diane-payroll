<template>
  <button
    @click="assignButtonBehavior()"
    class="bg-gray-500 hover:opacity-70 focus:bg-gray-300 text-white font-bold text-sm md:text-md py-2 px-4 mb-4 text-nowrap"
  >
    <i class="fas fa-user"></i>
    Bind
  </button>
  <!-- Add Item Modal -->
  <Modal
    :show="isAddModalOpen"
    :maxWidth="'xl'"
    title="Bind User to Employee"
    @close="isAddModalOpen = false"
  >
    <div class="grid grid-cols-1 gap-6 p-6">
      <form class="mt-4" @submit.prevent="bindEmployee()">
        <div class="grid grid-cols-1 gap-6">
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >User</label
            >
            <input
              type="text"
              placeholder="User Name"
              v-model="bindForm.user_name"
              disabled
              required
              class="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div class="mb-4">
            <label for="LeagueName" class="block text-sm font-medium text-gray-700"
              >Bind to</label
            >
            <div class="flex items-center mt-1">
              <SearchDropdown
                apiEndpoint="employees/list"
                :searchModel="searchUser"
                placeholder="Search Employee"
                :defaultValue="bindForm.employee_name"
                itemLabel="name"
                itemId="id"
                inputId="employeeName"
                @item-selected="(data) => fillEmployeeForm(data)"
                dataKey="employees"
                returnName="['firstName','lastName']"
              />
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/views/Component/Modal.vue";
import Paginator from "@/views/Component/Pagination.vue";
import BreadCrumbs from "@/views/Component/BreadCrumbs.vue";
import { VUE_APP_API_URL, PERMISSION, ROLE } from "@/views/Utility/Global";
import {
  FormDx,
  BearToken,
  Alert,
  replaceUnderScore,
  useDebounce,
  handleApiError,
} from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";
const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: Object,
});
const token = localStorage.getItem("token");
const isAddModalOpen = ref(false);
const users = ref([]);
const bindForm = ref({
  user_id: 0,
  user_name: "",
  employee_id: 0,
  employee_name: "",
});
const searchUser = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});
const assignButtonBehavior = () => {
  isAddModalOpen.value = true;
  resetForm();
  fillForm();
};
const fillForm = () => {
  const data = props.data;
  console.log(data);
  bindForm.value.user_id = data.id;
  bindForm.value.user_name = data.name;
  bindForm.value.employee_id = data.employeeId;
  bindForm.value.employee_name = data.employeeName;
};

const resetForm = () => {
  bindForm.value.user_id = 0;
  bindForm.value.user_name = "";
  bindForm.value.employee_id = 0;
  bindForm.value.employee_name = "";
};
const bindEmployee = async () => {
  try {
    // Show processing state
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we bind the employee to user.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = FormDx(bindForm.value);
    const response = await axios.post(
      `${VUE_APP_API_URL}users/assign-employee`,
      formData,
      BearToken(token)
    );

    // Close processing alert
    Swal.close();

    isAddModalOpen.value = false;
    Alert("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    // Close processing alert on error
    Swal.close();
    handleApiError(error);
  }
};

//users dropdown
const fillEmployeeForm = (user) => {
  bindForm.value.employee_id = user.id;
  bindForm.value.employee_name =
    user.employeeNumber +
    " - " +
    user.firstName +
    " " +
    user.middleName +
    " " +
    user.lastName;

  searchUser.value.search = "";
};
</script>
