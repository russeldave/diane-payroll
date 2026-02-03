<template>
  <button
    @click.prevent="addAccountabilityItemBehavior()"
    class="bg-blue-500 text-white hover:opacity-70 focus:bg-blue-300 font-bold text-md text-sm md:text-md py-2  px-4 rounded-lg mb-4 float-end"
  >
    <i class="fa fa-user-plus"></i> Add Accountability Item
  </button>
  <Modal :show="isAddModalOpen" :maxWidth="'4xl'" title="Add Employee Accountability Item" @close="isAddModalOpen = false">
    <div class="grid grid-cols-1 gap-2 p-4">
      <form class="mt-4" @submit.prevent="addAccountabilityItem()" autocomplete="off">
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Employee Name</label
          >
          <input
            v-if="hasUser"
            type="text"
            v-model="form.employee_name"
            disabled
            placeholder="Input Employee Name"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
          <div v-else class="flex">
             <SearchDropdown
                  apiEndpoint="employees/list"
                  :searchModel="searchEmployee"
                  placeholder="Search Employee"
                  itemLabel="name"
                  itemId="id"
                  inputId="employeeName"
                  :defaultValue="form.employee_name"
                  formatLabel="none"
                  @item-selected="(data) => fillEmployeeName(data)"
                  dataKey="employees"
                  returnName="['employeeCompleteName']"
              />
          </div>
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Item</label
          >
          <input
            v-if="hasItem"
            type="text"
            v-model="form.item_name"
            disabled
            placeholder="Input Item Name"
            class="mt-1 p-2 border rounded-md w-full bg-gray-200"
          />
          <div v-else class="flex">
            <SearchDropdown
                apiEndpoint="items/search-name-only"
                :searchModel="searchItem"
                placeholder="Search Item"
                itemLabel="name"
                itemId="id"
                inputId="brandName"
                formatLabel="none"
                @item-selected="(data) => fillItemForm(data)"
                dataKey="items"
                returnName="['itemCompleteName']"
              />
          </div>
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
            >Quantity</label
          >
          <input
            type="text"
            v-model="form.quantity"
            placeholder="Input quantity"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-6">
          <label
            for="itemImages"
              class="block text-sm font-medium"
            >Proof</label
          >
          <input
            type="file"
            id="itemImages"
            @change="handlePhotoUpload"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div class="mb-4">
          <label
            for="LeagueName"
            class="block text-sm font-medium text-gray-700"
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
import { FormDx, BearToken, handleApiError, typeFormatter } from "@/views/Utility/Helper";
import SearchDropdown from "@/views/Component/SearchDropdown.vue";

const emits = defineEmits(["transaction_id"]);
const token = localStorage.getItem("token");
const props = defineProps({
    data: Object,
    hasUser: {
      type: Boolean,
      default: true,
    },
    hasItem: {
      type: Boolean,
      default: false,
    }
});
const isAddModalOpen = ref(false); // Control visibility of add product modal
const searchItem = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
  building_id: 0,
});

const searchEmployee = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

const form = ref({
  employee_id: 0,
  item_id: 0,
  item_name: '',
  quantity: 0, 
  remarks: '', 
  proof_images : [],
});
const addAccountabilityItemBehavior = async () => {
  isAddModalOpen.value = true;
  resetForm();
  fillForm();
};
const fillForm = () => {
  const data = props.data;
  console.log(data);
  form.value = {
    employee_id: data.employee_id ?? 0,
    employee_name: data.employee_name ?? '',
    item_id: data.id ?? 0,
    item_name: data.itemCompleteName ?? '',
    quantity: 0, 
    remarks: '', 
    proof_images : [],
  };
}

const fillItemForm = (item) => {
  console.log(item);
  form.value.item_id = item.id;
  form.value.item_name = item.itemCompleteName;
};

const fillEmployeeName = (data) => {
  form.value.employee_id = data.id;
  form.value.employee_name = data.employeeCompleteName ?? '-';
}
const resetForm = () => {
  form.value = {
    employee_id: 0,
    employee_name: '',
    item_id: 0,
    item_name: '',
    quantity: 0, 
    remarks: 0, 
    proof_images : [],
  };
}
const addAccountabilityItem = async () => {
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
      VUE_APP_API_URL + "employees-accountability/add",
      formData,
      BearToken(token)
    );
    if (response.data) {
      Swal.close();
      isAddModalOpen.value = false;
      Swal.fire("Success", response.data.message, "success");
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
  form.value.proof_images = fileArray; // Assign the array of selected files to form object
};

</script>
